import { useQuery } from "@tanstack/react-query";
import { Zap, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import api from "@/lib/axios";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

const rankColors = ["text-yellow-400", "text-slate-300", "text-orange-400"];
const rankIcons = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const { user } = useAuthStore();

  const { data: xpBoard = [], isLoading } = useQuery({
    queryKey: ["leaderboard", "xp"],
    queryFn: async () => {
      const { data } = await api.get("/users/leaderboard?type=xp");
      return data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Top learners on Study Buddy this month</p>
      </div>

      {/* Top 3 podium */}
      {!isLoading && xpBoard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {[xpBoard[1], xpBoard[0], xpBoard[2]].map((entry, i) => {
            if (!entry) return null;
            const podiumIndex = i === 1 ? 0 : i === 0 ? 1 : 2;
            return (
              <div key={entry.user._id} className={`flex flex-col items-center p-4 rounded-2xl border ${podiumIndex === 0 ? "border-yellow-500/30 bg-yellow-500/5 scale-105" : "border-border bg-card"}`}>
                <span className="text-2xl mb-2">{rankIcons[podiumIndex]}</span>
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback>{getInitials(entry.user.name)}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-xs text-center truncate w-full">{entry.user.name}</p>
                <p className="text-[11px] text-muted-foreground">{entry.xp} XP</p>
              </div>
            );
          })}
        </div>
      )}

      <Tabs defaultValue="xp">
        <TabsList>
          <TabsTrigger value="xp"><Zap className="h-3.5 w-3.5 mr-1.5" />XP</TabsTrigger>
          <TabsTrigger value="streak"><Flame className="h-3.5 w-3.5 mr-1.5" />Streak</TabsTrigger>
        </TabsList>
        <TabsContent value="xp">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </div>
                ))
              : xpBoard.map((entry, i) => (
                  <div
                    key={entry.user._id}
                    className={`flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors ${entry.user._id === user?._id ? "bg-primary/5" : ""}`}
                  >
                    <span className={cn("w-7 text-center font-black text-sm", rankColors[i] || "text-muted-foreground")}>
                      {i < 3 ? rankIcons[i] : `#${i + 1}`}
                    </span>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback className="text-xs">{getInitials(entry.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{entry.user.name}</p>
                      <p className="text-xs text-muted-foreground">@{entry.user.username} · Level {entry.level}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-purple-400 font-bold text-sm">
                      <Zap className="h-3.5 w-3.5" />{entry.xp}
                    </div>
                  </div>
                ))}
          </div>
        </TabsContent>
        <TabsContent value="streak">
          <div className="text-center py-10 text-muted-foreground">Streak leaderboard coming soon...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
