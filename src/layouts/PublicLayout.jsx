import { Outlet, Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/auth.store";

export default function PublicLayout() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-lg">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text">Study Buddy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to={ROUTES.PRICING} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild variant="gradient" size="sm"><Link to={ROUTES.DASHBOARD}>Dashboard</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to={ROUTES.LOGIN}>Login</Link></Button>
                <Button asChild variant="gradient" size="sm"><Link to={ROUTES.REGISTER}>Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
