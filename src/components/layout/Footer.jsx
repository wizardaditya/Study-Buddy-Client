import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-text">Study Buddy</span>
            </Link>
            <p className="text-sm text-muted-foreground">India's first dedicated learning platform for Robotics, IoT & AI students.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[["Feed", "/feed"], ["Doubts", "/doubts"], ["Mentors", "/mentors"], ["Mock Tests", "/mock-tests"]].map(([label, href]) => (
                <li key={href}><Link to={href} className="hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Privacy Policy", "Terms of Service", "Refund Policy"].map((item) => (
                <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Study Buddy. Built for India's next generation of builders.</p>
          <p className="text-sm text-muted-foreground">🤖 Robotics · 📡 IoT · 🧠 AI</p>
        </div>
      </div>
    </footer>
  );
}
