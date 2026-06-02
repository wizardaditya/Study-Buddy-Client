import { useQuery } from "@tanstack/react-query";
import { Users, MessageCircle, CreditCard, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data.data;
    },
  });

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: "from-blue-600 to-cyan-600" },
    { label: "Active Subscriptions", value: stats?.activeSubscriptions ?? "—", icon: CreditCard, color: "from-green-600 to-teal-600" },
    { label: "Doubts Today", value: stats?.doubtsToday ?? "—", icon: MessageCircle, color: "from-purple-600 to-blue-600" },
    { label: "Open Reports", value: stats?.openReports ?? "—", icon: AlertTriangle, color: "from-red-600 to-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Platform health at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Activity feed coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
