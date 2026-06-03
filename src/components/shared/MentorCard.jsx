import { Link } from "react-router-dom";
import { Star, CheckCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants";

export default function MentorCard({ mentor }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={mentor.user.avatar} />
          <AvatarFallback className="text-base">{getInitials(mentor.user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold">{mentor.user.name}</h3>
            {mentor.isVerified && <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mb-2">@{mentor.user.username}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{mentor.bio}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mentor.expertise.slice(0, 3).map((exp) => (
              <Badge key={exp} variant="purple" className="text-[11px]">{exp}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />{mentor.rating.toFixed(1)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{mentor.totalSessions} sessions</span>
              <span className="font-semibold text-foreground">₹{mentor.hourlyRate}/hr</span>
            </div>
            <Button asChild variant="gradient" size="sm">
              <Link to={ROUTES.MENTOR_PROFILE(mentor.user.username)}>Book Session</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
