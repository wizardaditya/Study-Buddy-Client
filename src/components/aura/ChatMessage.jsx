import { Bot, User } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-1",
        isUser
          ? "bg-gradient-to-br from-blue-600 to-cyan-600"
          : "bg-gradient-to-br from-purple-600 to-blue-600 animate-pulse-glow"
      )}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>

      <div className={cn("max-w-[80%] space-y-1", isUser && "items-end flex flex-col")}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-tr-sm"
            : "bg-card border border-border rounded-tl-sm"
        )}>
          {message.content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground px-1">{timeAgo(message.timestamp)}</p>
      </div>
    </div>
  );
}
