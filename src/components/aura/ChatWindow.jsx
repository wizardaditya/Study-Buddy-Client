import { useEffect, useRef } from "react";
import { Bot, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useAuraStore } from "@/store/aura.store";

export default function ChatWindow() {
  const { messages, isTyping } = useAuraStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4 animate-pulse-glow">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2">Hi, I'm Aura ✨</h2>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
          Your personal AI study companion for Robotics, IoT & AI. I remember your learning journey and adapt to help you grow.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
          {[
            "Explain PID controllers simply",
            "How does MQTT work?",
            "Quiz me on CNNs",
            "Help me debug my Arduino code",
          ].map((prompt) => (
            <button
              key={prompt}
              className="text-left text-xs px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-accent transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg._id} message={msg} />
      ))}

      {isTyping && (
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex gap-1.5 items-center h-5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
