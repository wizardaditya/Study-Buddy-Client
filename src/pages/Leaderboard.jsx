import { useQuery } from "@tanstack/react-query";
import { Zap, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

const rankColors = ["text-yellow-400", "text-slate-300", "text-orange-400"];
const rankIcons = ["🥇", "🥈", "🥉"];

function LeaderboardTable({ data, isLoading, userId, valueKey, valueIcon }) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
        No data yet. Start learning to get on the board!
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {data.map((entry, i) => (
        <div
          key={entry.user._id}
          className={cn(
            "flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors",
            entry.user._id === userId && "bg-primary/5 border-l-2 border-l-primary"
          )}
        >
          <span className={cn("w-8 text-center font-black text-sm shrink-0", rankColors[i] || "text-muted-foreground")}>
            {i < 3 ? rankIcons[i] : `#${i + 1}`}
          </span>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={entry.user.avatar} />
            <AvatarFallback className="text-xs">{getInitials(entry.user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {entry.user.name}
              {entry.user._id === userId && (
                <span className="ml-2 text-xs text-primary font-normal">(you)</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              @{entry.user.username} · Level {entry.level}
            </p>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-sm shrink-0">
            {valueIcon}
            <span>{entry[valueKey]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useAuthStore();

  const { data: xpBoard = [], isLoading: xpLoading } = useQuery({
    queryKey: ["leaderboard", "xp"],
    queryFn: async () => {
      const { data } = await api.get("/users/leaderboard?type=xp");
      return data.data;
    },
  });

  const { data: streakBoard = [], isLoading: streakLoading } = useQuery({
    queryKey: ["leaderboard", "streak"],
    queryFn: async () => {
      const { data } = await api.get("/users/leaderboard?type=streak");
      return data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Top learners this month — keep your streak going 🔥</p>
      </div>

      {/* Top 3 Podium */}
      {!xpLoading && xpBoard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {[xpBoard[1], xpBoard[0], xpBoard[2]].map((entry, i) => {
            if (!entry) return null;
            const podiumIndex = i === 1 ? 0 : i === 0 ? 1 : 2;
            const heights = ["h-24", "h-32", "h-20"];
            return (
              <div
                key={entry.user._id}
                className={cn(
                  "flex flex-col items-center p-3 rounded-2xl border transition-all",
                  podiumIndex === 0
                    ? "border-yellow-500/40 bg-gradient-to-b from-yellow-500/10 to-card scale-105 shadow-lg shadow-yellow-500/10"
                    : "border-border bg-card"
                )}
              >
                <span className="text-2xl mb-1">{rankIcons[podiumIndex]}</span>
                <Avatar className="h-11 w-11 mb-1.5 ring-2 ring-border">
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(entry.user.name)}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-[11px] text-center truncate w-full">{entry.user.name}</p>
                <p className="text-[10px] text-purple-400 font-semibold">{entry.xp} XP</p>
              </div>
            );
          })}
        </div>
      )}

      <Tabs defaultValue="xp">
        <TabsList className="w-full max-w-xs">
          <TabsTrigger value="xp" className="flex-1">
            <Zap className="h-3.5 w-3.5 mr-1.5 text-purple-400" />XP Points
          </TabsTrigger>
          <TabsTrigger value="streak" className="flex-1">
            <Flame className="h-3.5 w-3.5 mr-1.5 text-orange-400" />Streaks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="xp">
          <LeaderboardTable
            data={xpBoard}
            isLoading={xpLoading}
            userId={user?._id}
            valueKey="xp"
            valueIcon={<Zap className="h-4 w-4 text-purple-400" />}
          />
        </TabsContent>

        <TabsContent value="streak">
          <LeaderboardTable
            data={streakBoard}
            isLoading={streakLoading}
            userId={user?._id}
            valueKey="streak"
            valueIcon={<Flame className="h-4 w-4 text-orange-400" />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
