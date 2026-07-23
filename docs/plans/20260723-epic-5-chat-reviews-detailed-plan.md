# Epic 5 — Chat, Reviews & Profile Enhancements: Final Implementation Plan

**Date:** 2026-07-23  
**Branch:** `feat/epic-5-customer-support`

---

## Overview & Architecture

### 1. AI-Powered Chatbot (`api-ai-analytics` + `SentraCX`)
- **Backend Flow:** `web-shop` → `api-oos` (`POST /api/bot/reply`) → `api-ai-analytics` (`POST /api/v1/tickets/analyze-intent`)
- **Model:** Groq LLM (`llama-3.1-8b-instant`) with keyword heuristic fallback
- **Response Mapping:** Returns `{ reply, category, shouldEscalate }` to drive interactive bot responses before connecting to live agent
- **Ticket Integration:** Integrated with SentraCX `api-crm` via `SentraCxService` (`customer-signup` webhook + `POST /api/v1/tickets`)

### 2. Live Chat Enhancements & Dedicated Route
- **Dedicated Route:** `/support/[ticketId]` for full-screen conversation
- **Ticket Actions:** Cancel Ticket (`DELETE /api/v1/tickets/{id}`) with confirmation modal
- **Message Details:** Click message bubble to expand inline details (timestamp, sender name, read status)

### 3. Product Reviews & Ratings (`api-oos` + `web-shop`)
- **Backend:** `ProductReview` model, `ReviewsController` (`GET /api/reviews?productId=`, `POST /api/reviews`), 1-5 star validation, max 500 chars, per-user duplicate check (409 Conflict)
- **Frontend:** `<ProductReviewsSection />` on product detail page with star summary, reviews list, interactive rating form

### 4. Enhanced Profile Page (`/profile`)
- **Account Overview Header:** Stats bar (Total Orders, Active Tickets, Saved Addresses, Member Since badge)
- **New "Support Tickets" Tab:** Lists customer tickets fetched from SentraCX (`api-crm`), displaying status badges, title, created date, and a "View / Message" button linking to `/support/[ticketId]`

---

## File Changes Summary

### `apps/api-oos`
- `Models/ProductReview.cs` [NEW]
- `Interfaces/Repositories/IReviewRepository.cs` [NEW]
- `Interfaces/Services/IReviewService.cs` [NEW]
- `Repositories/ReviewRepository.cs` [NEW]
- `Services/ReviewService.cs` [NEW]
- `Controllers/ReviewsController.cs` [NEW]
- `Controllers/BotController.cs` [NEW]
- `Interfaces/Services/IAiAnalyticsService.cs` [NEW]
- `Services/AiAnalyticsService.cs` [NEW]
- `DTOs/Requests/BotReplyRequestDto.cs` [NEW]
- `DTOs/Requests/CreateReviewRequestDto.cs` [NEW]
- `DTOs/Responses/BotReplyResponseDto.cs` [NEW]
- `DTOs/Responses/ReviewResponseDto.cs` [NEW]
- `Data/AppDbContext.cs` [MODIFY] — register `ProductReview`
- `Extensions/ServiceCollectionExtensions.cs` [MODIFY] — register services & `HttpClient("AiAnalytics")`
- EF Core Migration `AddProductReviews` [NEW]

### `apps/web-shop`
- `types/chat.ts` [MODIFY] — add `senderType`, `BotReply`
- `hooks/useChat.ts` [MODIFY] — bot phase state machine & escalation
- `components/features/chat/ChatPanel.tsx` [MODIFY] — bot messages & prompt UI
- `components/features/chat/ChatMessageBubble.tsx` [MODIFY] — bot style & click-to-expand details
- `app/support/[ticketId]/page.tsx` [NEW]
- `components/features/chat/ConversationPage.tsx` [NEW]
- `lib/api/support-api.ts` [NEW]
- `lib/api/reviews-api.ts` [NEW]
- `hooks/useReviews.ts` [NEW]
- `components/features/products/ProductReviewsSection.tsx` [NEW]
- `components/features/products/ProductDetailPage.tsx` [MODIFY] — append reviews
- `hooks/useProfilePage.ts` [MODIFY] — add `tickets` tab, ticket fetching
- `components/features/profile/ProfileSidebar.tsx` [MODIFY] — add Tickets tab
- `components/features/profile/ProfilePage.tsx` [MODIFY] — account stats header + Tickets tab content
- `components/features/profile/ProfileTicketsTab.tsx` [NEW]

---

## Verification Plan

1. Build & Lint: `pnpm turbo run lint type-check --filter=web-shop`, `dotnet build apps/api-oos`
2. Test AI Bot: Trigger bot reply -> check `api-ai-analytics` proxy response
3. Test Ticket Cancellation & Details: Cancel ticket via `/support/[ticketId]`, click message for details
4. Test Product Reviews: Submit review, check 1-5 validation & 500-char limit
5. Test Enhanced Profile: Check stats header and Tickets tab navigation
