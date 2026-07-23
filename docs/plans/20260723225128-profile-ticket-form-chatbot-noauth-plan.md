# Profile Redesign, Ticket Submission Form & Chatbot No-Auth Plan

**Date:** 2026-07-23  
**Branch:** `feat/epic-5-customer-support`

---

## Overview

Three focused improvements to the `web-shop` frontend:

1. **Profile Page Simplification** — Minimal but detailed profile using `shadcn/ui` Tabs + Cards.
2. **Ticket Submission Form** — Structured dialog form (Subject, Type, Description, Image Upload) using `shadcn/ui` Dialog + Form.
3. **Chatbot Auth-Free** — Remove the `!isAuthenticated` gate from the AI bot; only gate on live agent escalation.

---

## Requirements

| # | Requirement |
|---|---|
| 1 | Profile page: simple but detailed. Use `shadcn/ui` throughout. |
| 2 | Ticket form: Subject (text), Type (Inquiry/Request/Complain), Description (textarea), Image Upload (optional). |
| 3 | Chatbot: no sign-in required to chat with AI. Only prompt sign-in when escalating to live agent. |
| 4 | UI/UX: minimal. |

---

## Proposed Changes

### 1. Profile Page — `shadcn/ui` Tabs Layout

Remove the large purple gradient banner. Use `shadcn/ui` `Tabs` for navigation. Show a compact header card: avatar + user info + quick stats.

**Stats to show:** saved addresses count, total orders count, active tickets count.

#### Files
- **[MODIFY]** `ProfilePage.tsx` — remove banner, adopt `shadcn/ui` Tabs
- **[DELETE]** `ProfileSidebar.tsx` — navigation moves into `Tabs` in `ProfilePage.tsx`
- **[MODIFY]** `useProfilePage.ts` — expose orders count + tickets count for stats

---

### 2. Ticket Submission Dialog

Replace "Start New Live Chat" in `ProfileTicketsTab` with "Open a Ticket" button.

#### Files
- **[NEW]** `components/features/profile/TicketSubmitDialog.tsx` — shadcn Dialog with:
  - `Input` → Subject
  - `Select` → Type: Inquiry | Request | Complain
  - `Textarea` → Description
  - File `Input` (multiple images, `accept="image/*"`)
  - Submit `Button`
- **[MODIFY]** `ProfileTicketsTab.tsx` — use `<TicketSubmitDialog>`, refresh list on success

---

### 3. Chatbot — No Auth Gate

- **[MODIFY]** `ChatPanel.tsx` — move `!isAuthenticated` check from top-level to inside escalation block only; show inline nudge when unauthenticated user tries to escalate
- **[MODIFY]** `useChat.ts` — on `escalateToLiveAgent()`, return early + set error if not authenticated; remove loading guard blocking initial bot greeting

---

## Verification Plan

```bash
pnpm turbo run lint type-check --filter=web-shop
```

Manual:
1. Chatbot opens without sign-in, AI greeting shows.
2. Clicking "Connect to Live Agent" without auth shows inline nudge.
3. Profile page loads with minimal Tabs layout + stats card.
4. Tickets tab → "Open a Ticket" → dialog with all fields.
5. Submit ticket → list refreshes.
