import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/axios";
import { getInitials } from "@/lib/utils";

export default function AdminMentors() {
  const queryClient = useQueryClient();
  const { data: pending = [] } = useQuery({
    queryKey: ["admin-mentors-pending"],
    queryFn: async () => { const { data } = await api.get("/admin/mentors/pending"); return data.data; },
  });

  const verify = async (id) => {
    await api.put(`/admin/mentors/${id}/verify`);
    queryClient.invalidateQueries({ queryKey: ["admin-mentors-pending"] });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black">Mentor Applications</h1>
        <p className="text-sm text-muted-foreground">Review and approve mentor applications</p>
      </div>

      {pending.length === 0 && <p className="text-center py-12 text-muted-foreground">No pending applications.</p>}

      <div className="space-y-3">
        {pending.map((mentor) => (
          <div key={mentor._id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback>{getInitials(mentor.user.name)}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold">{mentor.user.name}</p>
                  <p className="text-xs text-muted-foreground">{mentor.user.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 h-8">
                  <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                </Button>
                <Button variant="gradient" size="sm" className="h-8" onClick={() => verify(mentor._id)}>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 mb-2">{mentor.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map((e) => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
              <Badge variant="blue" className="text-xs">₹{mentor.hourlyRate}/hr</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
