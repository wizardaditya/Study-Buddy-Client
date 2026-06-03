import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLANS } from "@/constants/plans";
import { ROUTES } from "@/constants";
import PlanCard from "@/components/pricing/PlanCard";
import { useAuthStore } from "@/store/auth.store";
import { subscriptionService } from "@/services/subscription.service";
import { initiatePayment } from "@/lib/razorpay";

export default function Pricing() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSelect = async (plan) => {
    if (!isAuthenticated) {
      navigate(ROUTES.REGISTER);
      return;
    }
    if (plan.price === 0) {
      navigate(ROUTES.DASHBOARD);
      return;
    }
    setLoadingPlan(plan.id);
    try {
      const order = await subscriptionService.createOrder(plan.id);
      await initiatePayment({
        orderId: order.orderId,
        amount: order.amount,
        name: user.name,
        email: user.email,
        planName: plan.name,
        onSuccess: async (response) => {
          await subscriptionService.verifyPayment({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            planId: plan.id,
          });
          navigate(ROUTES.DASHBOARD);
        },
      });
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Simple, honest <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees. Cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={user?.plan === plan.id}
              onSelect={handleSelect}
              loading={loadingPlan === plan.id}
            />
          ))}
        </div>
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Have questions?</h2>
          <p className="text-muted-foreground mb-4">
            Reach us at{" "}
            <a href="mailto:support@studybuddy.in" className="text-primary hover:underline">
              support@studybuddy.in
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            All payments are secured by Razorpay · GST included · INR only
          </p>
        </div>
      </div>
    </div>
  );
}
