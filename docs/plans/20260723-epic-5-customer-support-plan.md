# Epic 5: Customer Support — Implementation Plan

**Date:** 2026-07-23  
**Branch:** `feat/epic-5-customer-support`  
**Stack:** .NET 10 (`api-oos`) · Next.js (`web-shop`) · SentraCX (`api-crm` + `web-crm`)

---

## Overview

Epic 5 has three stories. The biggest — 5.1 Live Chat — is an **integration** between `web-shop` and the already-built SentraCX CRM (not a build-from-scratch). 5.2 and 5.3 are self-contained in `br-online-shop`.

| Story | Title | Scope |
|-------|-------|-------|
| 5.1 | Live chat widget (SignalR via SentraCX `api-crm`) | `web-shop` + `api-oos` webhook + SentraCX `api-crm` |
| 5.2 | Contact page + Brevo email | `api-oos` + `web-shop` |
| 5.3 | FAQ page (static) | `web-shop` only |

---

## Clarified Architecture Decisions

| Question | Answer |
|----------|--------|
| Guest chat? | ❌ Customer must be **logged in** via `web-shop` credentials |
| Agent auth | ✅ `web-crm` uses OIDC via `internal-auth-service` (already wired) |
| Contact email | ✅ **Brevo SMTP** (credentials provided) |
| FAQ content | ✅ Static placeholders (Shipping, Returns, Products, Account) |

---

## Architecture

```
┌────────────────────────────────────┐
│         web-shop (Customer)         │
│  JWT from api-oos (already done)    │
│                                     │
│  1. POST /api/oos-webhooks/tickets  │  ──────► api-oos webhook relay
│     (create ticket on api-oos side) │          │
│  2. Connect SignalR → api-crm hub   │  ◄──►   api-crm /hubs/chat
│  3. Chat widget UI                  │          │
└────────────────────────────────────┘          │
                                                 │ (already built)
┌────────────────────────────────────┐          │
│         web-crm (SentraCX agent)   │ ◄──► ───┘
│  OIDC via internal-auth-service     │
│  Conversations page (already built) │
│  useSignalR hook (already built)    │
└────────────────────────────────────┘
```

### Key insight: SentraCX is already built

SentraCX `api-crm` **already has**:
- `ChatHub` (`JoinTicket`, `SendMessage`, `MarkMessageRead`, `LeaveTicket`)
- `Ticket` + `Message` models & full REST API (`/api/v1/tickets`, `/api/v1/messages`)
- `WebhooksController` (`/api/v1/webhooks/*`)
- Redis backplane for SignalR scale-out

SentraCX `web-crm` **already has**:
- `Conversations` page + `ConversationList` + `ConversationWindow` + `CustomerContextPanel`
- `useSignalR` hook (connects to `/hubs/chat`, `JoinTicket`/`SendMessage`/`MarkMessageRead`)
- `useMessages`, `useTickets`, `useTicket` hooks

**We only need to build the customer-facing side in `web-shop`** and a thin relay layer in `api-oos`.

---

## 5.1 — Live Chat Widget

### Ticket Creation Flow

When a logged-in customer opens a chat for the first time:

1. `web-shop` calls `POST /api/webhooks/support-ticket` on `api-oos`  
2. `api-oos` relay calls `POST https://api-crm/api/v1/tickets` on SentraCX, forwarding customer identity  
3. Returns `ticketId` to `web-shop`; stored in `localStorage` (keyed by user ID so it persists per session)  
4. `web-shop` establishes SignalR connection directly to `api-crm` `/hubs/chat` using ticketId

> **Why relay through `api-oos`?** `web-shop` already trusts `api-oos` with the user JWT. `api-oos` holds customer identity (userId, name, email) and constructs the proper `CreateTicketRequestDto` for SentraCX — keeping the CRM API internal.

### `api-oos` changes

#### [NEW] `Controllers/SupportWebhookController.cs`
- `POST /api/webhooks/support-ticket` `[Authorize]`
  - Extracts user identity from JWT claims
  - Calls `api-crm` `POST /api/v1/tickets` with `{ Title, Description, CustomerId }`
  - Returns `{ ticketId }` to client

#### [NEW] `Services/SentraCxService.cs` + `Interfaces/Services/ISentraCxService.cs`
- `CreateSupportTicketAsync(userId, userName, email)` — HTTP call to SentraCX api-crm
- Uses `IHttpClientFactory` (registered as named client `"sentraCx"`)

#### [MODIFY] `Extensions/ServiceCollectionExtensions.cs`
- Register `IHttpClientFactory` + `ISentraCxService`

#### [MODIFY] `appsettings.json` / `.env`
- Add `SentraCX__ApiUrl` config key

---

### `web-shop` changes

#### New npm package
```bash
pnpm add @microsoft/signalr
```
> `web-crm` already uses this package — confirm version in SentraCX `package.json`

#### New Files

| File | Purpose |
|------|---------|
| `src/lib/signalr.ts` | SignalR connection factory pointing to `NEXT_PUBLIC_CRM_API_URL` |
| `src/hooks/useChat.ts` | Manages ticket creation, connection, messages state, send/receive |
| `src/components/features/chat/ChatBubble.tsx` | Fixed bottom-right floating button |
| `src/components/features/chat/ChatPanel.tsx` | Slide-up panel (shadcn Sheet) — message list + input |
| `src/components/features/chat/ChatMessageBubble.tsx` | Single message bubble (customer vs agent styling) |
| `src/components/features/chat/ChatUnreadBadge.tsx` | Red dot on bubble when panel closed + new message |

#### `useChat.ts` logic
```
onOpen:
  ticketId = localStorage.get(`chat-ticket-${userId}`)
  if (!ticketId):
    ticketId = await POST /api/webhooks/support-ticket  (api-oos)
    localStorage.set(`chat-ticket-${userId}`, ticketId)
  Fetch message history: GET /api/v1/messages?ticketId={id} (via api-crm proxy or api-oos relay)
  Connect SignalR → api-crm /hubs/chat
  invoke JoinTicket(ticketId)

onMessage:
  invoke SendMessage(ticketId, userId, content)

onReceiveMessage:
  append to messages state
  if panel closed → set unread badge
```

#### `.env.local` additions
```
NEXT_PUBLIC_CRM_API_URL=https://localhost:7001
```

#### `src/auth.ts` — already has `/contact` and `/faq` in `publicPaths`; no changes needed

---

### No SentraCX changes needed
The existing `ChatHub`, `TicketsController`, and Conversations UI in `web-crm` handle the agent side completely. Auth bypass is already in place for development (`[Authorize]` commented out in `TicketsController`).

---

## 5.2 — Contact Page + Brevo Email

### `api-oos` changes

#### [NEW] `Models/ContactInquiry.cs`
```csharp
Id, Name, Email, Subject, Message, CreatedAt
```

#### [NEW] `DTOs/Contact/CreateContactInquiryRequestDto.cs`
#### [NEW] `DTOs/Contact/ContactInquiryResponseDto.cs`
#### [NEW] `Interfaces/Repositories/IContactInquiryRepository.cs`
#### [NEW] `Repositories/ContactInquiryRepository.cs`
#### [NEW] `Interfaces/Services/IContactService.cs`
#### [NEW] `Services/ContactService.cs`
- Persists to DB
- Sends email via **Brevo SMTP** using `System.Net.Mail.SmtpClient` (no extra NuGet, built-in)
  - SMTP host: `smtp-relay.brevo.com`, port `587`, STARTTLS
  - Credentials from `appsettings` / env vars
#### [NEW] `Controllers/ContactController.cs`
- `POST /api/contact` — public endpoint (no auth required)

#### [NEW] EF migration — `ContactInquiries` table

#### [MODIFY] `appsettings.json`
```json
"Brevo": {
  "SmtpHost": "smtp-relay.brevo.com",
  "SmtpPort": 587,
  "Username": "",
  "Password": "",
  "FromEmail": "",
  "ToEmail": ""
}
```

#### [MODIFY] `Extensions/ServiceCollectionExtensions.cs`
- Register `IContactInquiryRepository`, `IContactService`

---

### `web-shop` changes (5.2)

| File | Purpose |
|------|---------|
| `src/app/contact/page.tsx` | Contact page — already listed in `publicPaths` in `auth.ts` ✅ |
| `src/components/features/contact/ContactForm.tsx` | shadcn Form — name, email, subject, message + Zod validation |
| `src/components/features/contact/ContactInfo.tsx` | Company details, email, hours |

> `/contact` is already a public path in `auth.ts` — no middleware change needed.

---

## 5.3 — FAQ Page (Static)

### `web-shop` changes only

| File | Purpose |
|------|---------|
| `src/app/faq/page.tsx` | FAQ page |
| `src/components/features/faq/FaqAccordion.tsx` | shadcn Accordion, grouped by category |
| `src/lib/faq-data.ts` | Static FAQ data (Shipping, Returns, Products, Account) |

> `/faq` is already a public path in `auth.ts` ✅. No backend needed.

---

## Full File Change Summary

### `br-online-shop / api-oos`

| Change | File |
|--------|------|
| [NEW] | `Controllers/SupportWebhookController.cs` |
| [NEW] | `Controllers/ContactController.cs` |
| [NEW] | `Models/ContactInquiry.cs` |
| [NEW] | `DTOs/Contact/CreateContactInquiryRequestDto.cs` |
| [NEW] | `DTOs/Contact/ContactInquiryResponseDto.cs` |
| [NEW] | `Interfaces/Services/ISentraCxService.cs` |
| [NEW] | `Services/SentraCxService.cs` |
| [NEW] | `Interfaces/Services/IContactService.cs` |
| [NEW] | `Services/ContactService.cs` |
| [NEW] | `Interfaces/Repositories/IContactInquiryRepository.cs` |
| [NEW] | `Repositories/ContactInquiryRepository.cs` |
| [NEW] | EF Migration |
| [MODIFY] | `Extensions/ServiceCollectionExtensions.cs` |
| [MODIFY] | `appsettings.json` (Brevo + SentraCX config) |

### `br-online-shop / web-shop`

| Change | File |
|--------|------|
| [NEW] | `src/lib/signalr.ts` |
| [NEW] | `src/hooks/useChat.ts` |
| [NEW] | `src/components/features/chat/ChatBubble.tsx` |
| [NEW] | `src/components/features/chat/ChatPanel.tsx` |
| [NEW] | `src/components/features/chat/ChatMessageBubble.tsx` |
| [NEW] | `src/components/features/chat/ChatUnreadBadge.tsx` |
| [NEW] | `src/app/contact/page.tsx` |
| [NEW] | `src/components/features/contact/ContactForm.tsx` |
| [NEW] | `src/components/features/contact/ContactInfo.tsx` |
| [NEW] | `src/app/faq/page.tsx` |
| [NEW] | `src/components/features/faq/FaqAccordion.tsx` |
| [NEW] | `src/lib/faq-data.ts` |
| [MODIFY] | `.env.local` — add `NEXT_PUBLIC_CRM_API_URL` |

### `SentraCX` — **No changes needed**

The SentraCX `api-crm` ChatHub, Ticket system, and `web-crm` Conversations UI are already built and will work as-is.

---

## Verification Plan

### Build checks
```bash
cd apps/api-oos && dotnet build
cd apps/web-shop && pnpm tsc --noEmit
```

### Manual verification
1. Log in as customer on `web-shop` → open chat bubble → first open creates ticket
2. Check SentraCX `web-crm` conversations page → new ticket appears
3. Agent replies → customer sees reply in real-time via SignalR
4. Close browser, re-open `web-shop`, chat → same ticket loaded from localStorage
5. Submit contact form → `ContactInquiries` DB record + Brevo email delivered to configured `ToEmail`
6. FAQ page → all categories expand/collapse correctly

