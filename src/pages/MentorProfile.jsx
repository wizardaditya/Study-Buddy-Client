import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, CheckCircle, Clock, Calendar, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mentorService } from "@/services/mentor.service";
import { getInitials } from "@/lib/utils";

export default function MentorProfile() {
  const { username } = useParams();
  const { data: mentor, isLoading } = useQuery({
    queryKey: ["mentor", username],
    queryFn: () => mentorService.getMentor(username),
    enabled: !!username,
  });

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!mentor) return <div className="text-center py-20 text-muted-foreground">Mentor not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <Avatar className="h-20 w-20">
            <AvatarImage src={mentor.user.avatar} />
            <AvatarFallback className="text-2xl">{getInitials(mentor.user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black">{mentor.user.name}</h1>
              {mentor.isVerified && <CheckCircle className="h-5 w-5 text-blue-400" />}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-current" />{mentor.rating.toFixed(1)}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{mentor.totalSessions} sessions</span>
              <span className="font-bold text-foreground">₹{mentor.hourlyRate}/hr</span>
            </div>
            <p className="text-sm mb-4">{mentor.bio}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {mentor.expertise.map((e) => <Badge key={e} variant="purple" className="text-xs">{e}</Badge>)}
            </div>
            <Button variant="gradient">
              <Calendar className="h-4 w-4 mr-2" /> Book a Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
