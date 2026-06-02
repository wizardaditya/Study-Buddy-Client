import { Check, X, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Plan } from "@/constants/plans";

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelect: (plan: Plan) => void;
  loading?: boolean;
}

export default function PlanCard({ plan, isCurrentPlan, onSelect, loading }: PlanCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-8 transition-all duration-300",
        plan.highlight
          ? "border-purple-500/50 bg-gradient-to-b from-purple-950/40 to-card shadow-xl shadow-purple-500/10 scale-105"
          : "border-border bg-card hover:border-primary/30"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="purple" className="px-3 py-1 text-xs font-semibold">
            <Crown className="h-3 w-3 mr-1" />
            {plan.badge}
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-black mb-1">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black">
            {plan.price === 0 ? "Free" : `₹${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-muted-foreground text-sm">/ {plan.period}</span>
          )}
        </div>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
        {plan.notIncluded.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <X className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <span className="line-through">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isCurrentPlan ? "secondary" : plan.highlight ? "gradient" : "outline"}
        className="w-full"
        disabled={isCurrentPlan || loading}
        onClick={() => !isCurrentPlan && onSelect(plan)}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isCurrentPlan ? "Current Plan" : plan.price === 0 ? "Get Started Free" : `Upgrade to ${plan.name}`}
      </Button>
    </div>
  );
}
