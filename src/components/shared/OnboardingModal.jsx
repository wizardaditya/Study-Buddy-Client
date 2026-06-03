import { useState } from "react";
import { GraduationCap, BookOpen, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOPICS } from "@/constants/topics";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1); // 1=role, 2=expertise
  const [role, setRole] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { completeOnboarding } = useAuth();

  const toggleExpertise = (slug) => {
    setExpertise((prev) =>
      prev.includes(slug) ? prev.filter((e) => e !== slug) : [...prev, slug]
    );
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "student") {
      handleFinish(selectedRole, []);
    } else {
      setStep(2);
    }
  };

  const handleFinish = async (selectedRole, selectedExpertise) => {
    setLoading(true);
    setError("");
    try {
      await completeOnboarding(selectedRole, selectedExpertise);
      onComplete?.();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-black">Welcome to Study Buddy!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1 ? "How will you be using Study Buddy?" : "What are your areas of expertise?"}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* Step 1 — Role */}
        {step === 1 && (
          <div className="space-y-3">
            <button
              onClick={() => handleRoleSelect("student")}
              disabled={loading}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-blue-500 hover:bg-blue-500/5 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold">I'm a Student</p>
                <p className="text-xs text-muted-foreground">Learn, ask doubts, connect with mentors</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("mentor")}
              disabled={loading}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-purple-500 hover:bg-purple-500/5 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold">I'm a Mentor</p>
                <p className="text-xs text-muted-foreground">Share expertise, guide students, build your profile</p>
              </div>
            </button>
          </div>
        )}

        {/* Step 2 — Expertise */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleExpertise(t.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    expertise.includes(t.slug)
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "border-border text-muted-foreground hover:border-purple-500"
                  }`}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>

            <Button
              onClick={() => handleFinish("mentor", expertise)}
              variant="gradient"
              className="w-full"
              disabled={loading || expertise.length === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {expertise.length === 0 ? "Select at least one" : "Complete Setup"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
