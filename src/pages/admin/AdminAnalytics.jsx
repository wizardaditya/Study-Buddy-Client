import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, MessageCircle, ClipboardList, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

export default function AdminAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data.data;
    },
  });

  const metrics = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "from-blue-600 to-cyan-600", sub: "Registered accounts" },
    { label: "Active Subscriptions", value: stats?.activeSubscriptions, icon: Star, color: "from-green-600 to-teal-600", sub: "Pro + Elite plans" },
    { label: "Total Posts", value: stats?.totalPosts, icon: MessageCircle, color: "from-purple-600 to-blue-600", sub: "Community feed" },
    { label: "Doubts Today", value: stats?.doubtsToday, icon: ClipboardList, color: "from-orange-600 to-red-600", sub: "Questions asked today" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Analytics</h1>
        <p className="text-sm text-muted-foreground">Platform growth and engagement metrics</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color, sub }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-black">{value ?? "—"}</p>
              )}
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Growth chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            User Growth (Last 30 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-end gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = Math.floor(Math.random() * 80) + 20;
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                  style={{ height: `${height}%` }}
                  title={`Day ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Top topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Topics by Doubts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { topic: "Arduino", count: 142, color: "bg-cyan-500" },
              { topic: "Machine Learning", count: 118, color: "bg-purple-500" },
              { topic: "ESP32", count: 96, color: "bg-red-500" },
              { topic: "Computer Vision", count: 78, color: "bg-green-500" },
              { topic: "MQTT Protocol", count: 63, color: "bg-indigo-500" },
            ].map(({ topic, count, color }) => (
              <div key={topic} className="flex items-center gap-3">
                <span className="text-sm w-40 truncate">{topic}</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${(count / 150) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
