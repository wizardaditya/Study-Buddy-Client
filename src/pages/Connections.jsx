import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { UserCheck, UserX, Clock, Users, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { connectionService } from "@/services/connection.service";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants";

function UserCard({ user, actions }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <Link to={ROUTES.PROFILE(user.username)}>
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={ROUTES.PROFILE(user.username)} className="hover:underline">
          <p className="font-semibold text-sm truncate">{user.name}</p>
        </Link>
        <p className="text-xs text-muted-foreground">@{user.username}</p>
        {user.bio && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{user.bio}</p>}
        {user.role && (
          <Badge variant="secondary" className="text-xs mt-1 capitalize">{user.role}</Badge>
        )}
      </div>
      <div className="flex gap-2 shrink-0">{actions}</div>
    </div>
  );
}

export default function Connections() {
  const [tab, setTab] = useState("connections");
  const queryClient = useQueryClient();

  const { data: connections = [], isLoading: loadingConnections } = useQuery({
    queryKey: ["connections"],
    queryFn: connectionService.getMyConnections,
  });

  const { data: pending = [], isLoading: loadingPending } = useQuery({
    queryKey: ["connections-pending"],
    queryFn: connectionService.getPendingRequests,
  });

  const { data: sent = [], isLoading: loadingSent } = useQuery({
    queryKey: ["connections-sent"],
    queryFn: connectionService.getSentRequests,
  });

  const acceptMutation = useMutation({
    mutationFn: (connectionId) => connectionService.acceptRequest(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["connections-pending"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id) => connectionService.removeConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["connections-pending"] });
      queryClient.invalidateQueries({ queryKey: ["connections-sent"] });
    },
  });

  const tabs = [
    { id: "connections", label: "Connections", count: connections.length, icon: Users },
    { id: "pending", label: "Requests", count: pending.length, icon: Clock },
    { id: "sent", label: "Sent", count: sent.length, icon: UserCheck },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black">Connections</h1>
        <p className="text-sm text-muted-foreground">Manage your professional network</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Connections tab */}
      {tab === "connections" && (
        <div className="space-y-3">
          {loadingConnections && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
          {!loadingConnections && connections.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No connections yet</p>
              <p className="text-xs text-muted-foreground mt-1">Visit profiles to send connection requests</p>
            </div>
          )}
          {connections.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeMutation.mutate(user.connectionId)}
                  disabled={removeMutation.isPending}
                  className="text-destructive hover:text-destructive hover:border-destructive/50"
                >
                  {removeMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                  <span className="ml-1.5 hidden sm:inline">Remove</span>
                </Button>
              }
            />
          ))}
        </div>
      )}

      {/* Pending requests tab */}
      {tab === "pending" && (
        <div className="space-y-3">
          {loadingPending && <Skeleton className="h-20 w-full rounded-xl" />}
          {!loadingPending && pending.length === 0 && (
            <div className="text-center py-16">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No pending requests</p>
            </div>
          )}
          {pending.map((req) => (
            <UserCard
              key={req._id}
              user={req.requester}
              actions={
                <>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => acceptMutation.mutate(req._id)}
                    disabled={acceptMutation.isPending}
                  >
                    {acceptMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                    <span className="ml-1.5">Accept</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMutation.mutate(req._id)}
                    disabled={removeMutation.isPending}
                  >
                    <UserX className="h-3.5 w-3.5" />
                    <span className="ml-1.5 hidden sm:inline">Decline</span>
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Sent requests tab */}
      {tab === "sent" && (
        <div className="space-y-3">
          {loadingSent && <Skeleton className="h-20 w-full rounded-xl" />}
          {!loadingSent && sent.length === 0 && (
            <div className="text-center py-16">
              <UserCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No sent requests</p>
            </div>
          )}
          {sent.map((req) => (
            <UserCard
              key={req._id}
              user={req.recipient}
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeMutation.mutate(req._id)}
                  disabled={removeMutation.isPending}
                  className="text-muted-foreground"
                >
                  Withdraw
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
