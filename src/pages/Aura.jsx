import { useState } from "react";
import { Bot, Trash2, Plus, Zap, Lock } from "lucide-react";
import ChatWindow from "@/components/aura/ChatWindow";
import ChatInput from "@/components/aura/ChatInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuraStore } from "@/store/aura.store";
import { useAuthStore } from "@/store/auth.store";
import { auraService } from "@/services/aura.service";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";

export default function Aura() {
  const { user } = useAuthStore();
  const {
    messages, sessionId, isTyping, dailyUsed, dailyLimit,
    addMessage, setSessionId, setTyping, incrementUsage, clearSession,
  } = useAuraStore();

  const [error, setError] = useState("");
  const isLimited = user?.plan === "free" && dailyUsed >= dailyLimit;

  const handleSend = async (content) => {
    if (isLimited) return;
    setError("");

    const userMsg = {
      _id: `tmp_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setTyping(true);
    incrementUsage();

    try {
      const { reply, sessionId: sid } = await auraService.chat(content, sessionId);
      if (!sessionId) setSessionId(sid);
      addMessage(reply);
    } catch {
      setError("Aura had a hiccup. Try again.");
    } finally {
      setTyping(false);
    }
  };

  const handleClear = async () => {
    try { await auraService.clearMemory(); } catch { /* ignore */ }
    clearSession();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-2rem)] -mt-6 -mx-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Aura AI</p>
            <p className="text-xs text-muted-foreground">
              {isTyping ? "Thinking..." : "Powered by GPT-4o · Your study companion"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user?.plan === "free" && (
            <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1">
              <Zap className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{dailyUsed}/{dailyLimit} today</span>
            </div>
          )}
          {user?.plan !== "free" && (
            <Badge variant="purple" className="text-xs">
              <Zap className="h-3 w-3 mr-1" /> Unlimited
            </Badge>
          )}
          {messages.length > 0 && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearSession} title="New chat">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={handleClear} title="Clear memory">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-2.5">{error}</div>
      )}

      <ChatWindow />

      {isLimited ? (
        <div className="p-4 border-t border-border bg-gradient-to-r from-purple-950/30 to-blue-950/30">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-purple-400" />
              <span className="text-muted-foreground">Daily limit reached. Upgrade for unlimited Aura AI.</span>
            </div>
            <Button asChild variant="gradient" size="sm">
              <Link to={ROUTES.PRICING}>Upgrade to Pro</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ChatInput onSend={handleSend} disabled={isTyping} />
      )}
    </div>
  );
}
