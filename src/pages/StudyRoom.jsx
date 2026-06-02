import { useParams } from "react-router-dom";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StudyRoom() {
  const { roomId } = useParams();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-2rem)] -mt-6 -mx-4">
      {/* Video grid */}
      <div className="flex-1 bg-black/50 grid grid-cols-2 md:grid-cols-3 gap-2 p-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-xl aspect-video flex items-center justify-center relative">
            <Video className="h-8 w-8 text-muted-foreground" />
            <div className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-2 py-0.5 text-xs text-white">
              {i === 0 ? "You" : "Participant"}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-card border-t border-border p-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors ${micOn ? "bg-muted hover:bg-accent" : "bg-red-500/20 text-red-400"}`}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setCamOn(!camOn)}
          className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors ${camOn ? "bg-muted hover:bg-accent" : "bg-red-500/20 text-red-400"}`}
        >
          {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button className="h-11 w-11 rounded-full bg-muted hover:bg-accent flex items-center justify-center">
          <MessageCircle className="h-5 w-5" />
        </button>
        <button className="h-11 px-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 text-sm font-medium">
          <PhoneOff className="h-4 w-4" /> Leave
        </button>
      </div>
    </div>
  );
}
