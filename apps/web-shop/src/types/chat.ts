export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface SupportTicketResponse {
  ticketId: string;
}
