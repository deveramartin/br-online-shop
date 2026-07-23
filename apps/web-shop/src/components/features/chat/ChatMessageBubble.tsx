import type { ChatMessage } from "@/types/chat";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
}

export function ChatMessageBubble({ message, isSelf }: ChatMessageBubbleProps) {
  const formattedTime = new Date(message.sentAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} my-1.5`}>
      {!isSelf && message.senderName && (
        <span className="mb-0.5 text-[11px] font-medium text-slate-500">
          {message.senderName}
        </span>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
          isSelf
            ? "bg-[#451077] text-white rounded-br-none"
            : "bg-slate-100 text-slate-900 border border-slate-200/80 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        <span
          className={`block text-[10px] mt-1 text-right ${
            isSelf ? "text-purple-200" : "text-slate-400"
          }`}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
