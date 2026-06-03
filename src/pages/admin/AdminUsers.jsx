import { useQuery } from "@tanstack/react-query";
import { Ban, Search } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { getInitials, timeAgo } from "@/lib/utils";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => { const { data } = await api.get("/admin/users"); return data.data; },
  });

  const filtered = search ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Users</h1>
          <p className="text-sm text-muted-foreground">Manage platform users</p>
        </div>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/40">
            <th className="text-left p-4 font-semibold text-xs text-muted-foreground">User</th>
            <th className="text-left p-4 font-semibold text-xs text-muted-foreground">Plan</th>
            <th className="text-left p-4 font-semibold text-xs text-muted-foreground">Joined</th>
            <th className="text-right p-4 font-semibold text-xs text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                <td className="p-4"><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-32" /></div></td>
                <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                <td className="p-4"></td>
              </tr>
            )) : filtered.map((user) => (
              <tr key={user._id} className="border-b border-border hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback></Avatar>
                    <div><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                  </div>
                </td>
                <td className="p-4"><Badge variant={user.plan === "elite" ? "purple" : user.plan === "pro" ? "blue" : "secondary"} className="text-xs capitalize">{user.plan}</Badge></td>
                <td className="p-4 text-muted-foreground text-xs">{timeAgo(user.createdAt)}</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7"><Ban className="h-3.5 w-3.5 mr-1" /> Ban</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
