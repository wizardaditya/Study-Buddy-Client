import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Zap, Flame, Trophy, Bot, ArrowRight, BookOpen, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import { ROUTES, LEVEL_THRESHOLDS } from "@/constants";
import { getInitials } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: userService.getMe,
    initialData: user ?? undefined,
  });

  const currentLevel = me?.level ?? 1;
  const currentXP = me?.xp ?? 0;
  const xpForNextLevel = LEVEL_THRESHOLDS[currentLevel] ?? 10000;
  const xpForCurrentLevel = LEVEL_THRESHOLDS[currentLevel - 1] ?? 0;
  const xpProgress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/20 p-6">
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-purple-500/30">
                <AvatarImage src={me?.avatar} alt={me?.name} />
                <AvatarFallback className="text-lg">{getInitials(me?.name ?? "")}</AvatarFallback>
              </Avatar>
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-black">
                      Hey, {me?.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      @{me?.username} · Level {currentLevel}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {me?.currentStreak! > 0 && (
                <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-bold text-orange-400">{me?.currentStreak} days</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1.5">
                <Zap className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-400">{currentXP} XP</span>
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Level {currentLevel}</span>
              <span>{currentXP} / {xpForNextLevel} XP → Level {currentLevel + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Level", value: currentLevel, icon: Trophy, color: "text-yellow-400" },
          { label: "XP Points", value: `${currentXP}`, icon: Zap, color: "text-purple-400" },
          { label: "Day Streak", value: me?.currentStreak ?? 0, icon: Flame, color: "text-orange-400" },
          { label: "Best Streak", value: me?.longestStreak ?? 0, icon: TrendingUp, color: "text-blue-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:border-purple-500/30 transition-colors cursor-pointer">
          <Link to={ROUTES.AURA}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Chat with Aura</p>
                <p className="text-xs text-muted-foreground">Your AI study companion</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-blue-500/30 transition-colors cursor-pointer">
          <Link to={ROUTES.DOUBTS_NEW}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Ask a Doubt</p>
                <p className="text-xs text-muted-foreground">Get community answers</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-green-500/30 transition-colors cursor-pointer">
          <Link to={ROUTES.MENTORS}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Find a Mentor</p>
                <p className="text-xs text-muted-foreground">Book 1-on-1 sessions</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Upgrade CTA for free users */}
      {me?.plan === "free" && (
        <Card className="border-purple-500/20 bg-gradient-to-r from-purple-950/30 to-blue-950/30">
          <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-bold text-lg">Unlock the full experience</p>
              <p className="text-sm text-muted-foreground">Upgrade to Pro for unlimited Aura AI, all study rooms & mentor sessions</p>
            </div>
            <Button asChild variant="gradient">
              <Link to={ROUTES.PRICING}>Upgrade to Pro — ₹299/mo</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plan badge */}
      {me?.plan !== "free" && (
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="text-sm px-3 py-1">
            <Trophy className="h-3.5 w-3.5 mr-1" />
            {me?.plan?.toUpperCase()} Member
          </Badge>
        </div>
      )}
    </div>
  );
}
