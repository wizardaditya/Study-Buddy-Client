import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Video, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { ROUTES } from "@/constants";

export default function StudyRooms() {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data } = await api.get("/rooms");
      return data.data;
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Study Rooms</h1>
          <p className="text-sm text-muted-foreground">Live collaborative rooms powered by WebRTC</p>
        </div>
        <Button variant="gradient" size="sm"><Plus className="h-4 w-4 mr-1.5" /> Create Room</Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div key={room._id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              {room.isLive && <Badge variant="success" className="animate-pulse">● LIVE</Badge>}
            </div>
            <h3 className="font-bold mb-1">{room.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">Hosted by {room.host?.name} · {room.topic}</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {room.participantsCount}/{room.maxParticipants}
              </span>
              <Button asChild variant="gradient" size="sm">
                <Link to={ROUTES.STUDY_ROOM(room._id)}>Join Room</Link>
              </Button>
            </div>
          </div>
        ))}
        {!isLoading && rooms.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted-foreground">No live rooms right now. Create one!</div>
        )}
      </div>
    </div>
  );
}
