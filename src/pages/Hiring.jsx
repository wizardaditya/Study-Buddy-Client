import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Building2, Lock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants";
import { timeAgo } from "@/lib/utils";

export default function Hiring() {
  const { user } = useAuthStore();
  const isElite = user?.plan === "elite";

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["hiring"],
    queryFn: async () => {
      const { data } = await api.get("/hiring");
      return data.data;
    },
    enabled: isElite,
  });

  if (!isElite) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-black mb-2">Elite Members Only</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The Hiring Board is exclusive to Elite members. Companies specifically looking for Robotics, IoT & AI talent post here.
        </p>
        <Button asChild variant="gradient">
          <Link to={ROUTES.PRICING}>Upgrade to Elite — ₹699/mo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black">Hiring Board</h1>
        <p className="text-sm text-muted-foreground">Companies actively hiring Robotics, IoT & AI talent</p>
      </div>
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job._id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-base">{job.role}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.companyName}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-400">{job.salary}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(job.postedAt)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.map((skill) => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
              <Badge variant="blue" className="text-xs">{job.type}</Badge>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Apply
            </Button>
          </div>
        ))}
        {!isLoading && jobs.length === 0 && (
          <p className="text-center py-16 text-muted-foreground">No jobs posted yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
