import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, GraduationCap, Flag, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

const adminNav = [
  { label: "Overview", icon: LayoutDashboard, to: ROUTES.ADMIN },
  { label: "Users", icon: Users, to: ROUTES.ADMIN_USERS },
  { label: "Mentors", icon: GraduationCap, to: ROUTES.ADMIN_MENTORS },
  { label: "Reports", icon: Flag, to: ROUTES.ADMIN_REPORTS },
  { label: "Analytics", icon: BarChart3, to: ROUTES.ADMIN_ANALYTICS },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card flex flex-col fixed inset-y-0 left-0">
        <div className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span>Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.ADMIN}
              className={({ isActive }) =>
                cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 ml-64 p-8"><Outlet /></main>
    </div>
  );
}
