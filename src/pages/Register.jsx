import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Zap, Loader2, GraduationCap, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
import { TOPICS } from "@/constants/topics";

export default function Register() {
  const [step, setStep] = useState(1); // 1 = role select, 2 = form
  const [role, setRole] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, googleLogin } = useAuth();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleExpertise = (slug) => {
    setExpertise((prev) =>
      prev.includes(slug) ? prev.filter((e) => e !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (role === "mentor" && expertise.length === 0) { setError("Please select at least one area of expertise"); return; }
    setLoading(true);
    try {
      await register({ ...form, role, expertise });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      setError(err?.response?.data?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black">Join Study Buddy</h1>
          <p className="text-muted-foreground mt-1">Free forever · No credit card needed</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          {/* Step 1 — Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-center text-muted-foreground mb-6">I am joining as a...</p>
              <button
                onClick={() => { setRole("student"); setStep(2); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:border-purple-500 ${role === "student" ? "border-purple-500 bg-purple-500/10" : "border-border"}`}
              >
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Student</p>
                  <p className="text-xs text-muted-foreground">Learn, ask doubts, connect with mentors</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </button>

              <button
                onClick={() => { setRole("mentor"); setStep(2); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:border-purple-500 ${role === "mentor" ? "border-purple-500 bg-purple-500/10" : "border-border"}`}
              >
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Mentor</p>
                  <p className="text-xs text-muted-foreground">Share expertise, guide students, build your profile</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-card px-2">or continue with</span></div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed")}
                  text="signup_with"
                  shape="rectangular"
                  theme="filled_black"
                  width="360"
                />
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link to={ROUTES.LOGIN} className="text-primary hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          )}

          {/* Step 2 — Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 mb-4">
                {role === "student"
                  ? <><GraduationCap className="h-4 w-4 text-blue-500" /><span className="text-sm font-medium">Signing up as Student</span></>
                  : <><BookOpen className="h-4 w-4 text-purple-500" /><span className="text-sm font-medium">Signing up as Mentor</span></>
                }
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <Input name="name" placeholder="Arjun Sharma" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Username</label>
                <Input name="username" placeholder="arjun_sharma" value={form.username} onChange={handleChange} required pattern="[a-z0-9_]+" title="Lowercase letters, numbers, and underscores only" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <Input name="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={handleChange} required minLength={8} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expertise for mentors */}
              {role === "mentor" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Areas of Expertise <span className="text-destructive">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleExpertise(t.slug)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          expertise.includes(t.slug)
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "border-border text-muted-foreground hover:border-purple-500"
                        }`}
                      >
                        {t.icon} {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" variant="gradient" className="w-full mt-2" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-2">
                By signing up, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
