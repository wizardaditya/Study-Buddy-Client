import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Zap, LogOut, Settings, User, GraduationCap, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants";
import api from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";

function SearchDropdown({ query, onClose }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => setResults(r.data.data))
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  if (!debouncedQuery || debouncedQuery.length < 2) return null;

  const hasResults = results && (
    results.users?.length > 0 ||
    results.doubts?.length > 0 ||
    results.posts?.length > 0 ||
    results.projects?.length > 0
  );

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
      {loading && (
        <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
      )}

      {!loading && !hasResults && (
        <div className="p-4 text-center text-sm text-muted-foreground">No results for "{debouncedQuery}"</div>
      )}

      {!loading && results?.users?.length > 0 && (
        <div>
          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">People</p>
          {results.users.map((u) => (
            <button
              key={u._id}
              onClick={() => { navigate(ROUTES.PROFILE(u.username)); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={u.avatar} />
                <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  @{u.username}
                  {u.role === "mentor" ? <BookOpen className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && results?.doubts?.length > 0 && (
        <div>
          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Doubts</p>
          {results.doubts.map((d) => (
            <button
              key={d._id}
              onClick={() => { navigate(ROUTES.DOUBTS_DETAIL(d._id)); onClose(); }}
              className="w-full px-3 py-2.5 hover:bg-accent text-left transition-colors"
            >
              <p className="text-sm font-medium line-clamp-1">{d.title}</p>
              <p className="text-xs text-muted-foreground">by @{d.author?.username}</p>
            </button>
          ))}
        </div>
      )}

      {!loading && results?.projects?.length > 0 && (
        <div>
          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Projects</p>
          {results.projects.map((p) => (
            <button
              key={p._id}
              onClick={() => { navigate(`/projects/${p._id}`); onClose(); }}
              className="w-full px-3 py-2.5 hover:bg-accent text-left transition-colors"
            >
              <p className="text-sm font-medium line-clamp-1">{p.title}</p>
              <p className="text-xs text-muted-foreground">by @{p.owner?.username}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 gap-4">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 font-bold text-lg mr-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="gradient-text hidden sm:block">Study Buddy</span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-md relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search people, doubts, projects..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted border border-transparent focus:border-primary focus:outline-none text-sm"
          />
          {searchOpen && (
            <SearchDropdown
              query={searchQuery}
              onClose={() => { setSearchOpen(false); setSearchQuery(""); }}
            />
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-400">{user.xp} XP</span>
            </div>
          )}

          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          {user && (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/50 transition-all">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">{user.role}</p>
                </div>
                <div className="p-1">
                  <Link to={ROUTES.PROFILE(user.username)} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link to={ROUTES.SETTINGS} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
