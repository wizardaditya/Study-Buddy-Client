import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black">Reset password</h1>
          <p className="text-muted-foreground mt-1">We'll send a reset link to your email</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h2 className="font-bold text-lg mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground mb-6">We sent a reset link to <strong>{email}</strong></p>
              <Link to={ROUTES.LOGIN} className="text-primary hover:underline text-sm">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
              <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-2">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
