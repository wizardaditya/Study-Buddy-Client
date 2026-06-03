import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag, CheckCircle, X, Eye, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo, getInitials } from "@/lib/utils";
import api from "@/lib/axios";

export default function AdminReports() {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/admin/reports");
        return data.data;
      } catch {
        return [];
      }
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/reports/${id}/resolve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reports"] }),
  });

  const pending = reports.filter((r) => r.status === "open");
  const resolved = reports.filter((r) => r.status === "resolved");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black">Reports</h1>
        <p className="text-sm text-muted-foreground">Review user-reported content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: reports.length, icon: Flag, color: "text-orange-400" },
          { label: "Pending", value: pending.length, icon: AlertTriangle, color: "text-red-400" },
          { label: "Resolved", value: resolved.length, icon: CheckCircle, color: "text-green-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <Icon className={`h-8 w-8 ${color}`} />
            <div>
              <p className="text-xl font-black">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending {pending.length > 0 && <span className="ml-1.5 bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full">{pending.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="font-semibold">No pending reports</p>
              <p className="text-sm text-muted-foreground">The community is behaving well 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((report) => (
                <ReportCard key={report._id} report={report} onResolve={() => resolveMutation.mutate(report._id)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved">
          {resolved.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No resolved reports yet.</div>
          ) : (
            <div className="space-y-3">
              {resolved.map((report) => (
                <ReportCard key={report._id} report={report} resolved />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportCard({ report, onResolve, resolved }) {
  return (
    <div className={`bg-card border rounded-xl p-5 ${resolved ? "border-border opacity-60" : "border-red-500/20"}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Flag className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">{report.reason || "Inappropriate content"}</p>
            <p className="text-xs text-muted-foreground">
              Reported by @{report.reportedBy?.username} · {timeAgo(report.createdAt)}
            </p>
          </div>
        </div>
        {!resolved && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Eye className="h-3.5 w-3.5 mr-1" /> View
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              onClick={onResolve}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Resolve
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
              <X className="h-3.5 w-3.5 mr-1" /> Remove
            </Button>
          </div>
        )}
        {resolved && <Badge variant="success">Resolved</Badge>}
      </div>
      {report.description && (
        <p className="text-xs text-muted-foreground mt-3 pl-12">{report.description}</p>
      )}
    </div>
  );
}
