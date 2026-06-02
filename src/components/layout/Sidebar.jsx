import { NavLink } from "react-router-dom";
import { LayoutDashboard, Rss, HelpCircle, FolderKanban, Users, Video, ClipboardList, Trophy, Briefcase, Bot, Flame, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  { label: "Feed", icon: Rss, to: ROUTES.FEED },
  { label: "Doubts", icon: HelpCircle, to: ROUTES.DOUBTS },
  { label: "Projects", icon: FolderKanban, to: ROUTES.PROJECTS },
  { label: "Mentors", icon: Users, to: ROUTES.MENTORS },
  { label: "Study Rooms", icon: Video, to: ROUTES.STUDY_ROOMS },
  { label: "Mock Tests", icon: ClipboardList, to: ROUTES.MOCK_TESTS },
  { label: "Leaderboard", icon: Trophy, to: ROUTES.LEADERBOARD },
  { label: "Hiring", icon: Briefcase, to: ROUTES.HIRING },
  { label: "Aura AI", icon: Bot, to: ROUTES.AURA, highlight: true },
];

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card min-h-screen px-3 py-4 fixed top-16 left-0 bottom-0 overflow-y-auto">
      {user?.currentStreak > 0 && (
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 mb-4">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-xs font-semibold text-orange-400">{user.currentStreak} day streak 🔥</span>
        </div>
      )}

      {user?.plan !== "free" && (
        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 mb-4">
          <Crown className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-semibold text-purple-400 capitalize">{user?.plan} Plan</span>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, icon: Icon, to, highlight }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                highlight && "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
            {highlight && (
              <span className="ml-auto text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">AI</span>
            )}
          </NavLink>
        ))}
      </nav>

      {user?.plan === "free" && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20">
          <p className="text-xs font-semibold mb-1">Upgrade to Pro</p>
          <p className="text-xs text-muted-foreground mb-3">Unlock unlimited AI, mentors & more</p>
          <NavLink
            to={ROUTES.PRICING}
            className="block text-center text-xs font-semibold py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all"
          >
            Upgrade — ₹299/mo
          </NavLink>
        </div>
      )}
    </aside>
  );
}
