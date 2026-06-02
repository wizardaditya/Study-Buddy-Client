import api from "@/lib/axios";

export const subscriptionService = {
  async getPlans() {
    const { data } = await api.get("/subscriptions/plans");
    return data.data;
  },
  async createOrder(planId) {
    const { data } = await api.post("/subscriptions/create", { planId });
    return data.data;
  },
  async verifyPayment({ razorpayPaymentId, razorpayOrderId, razorpaySignature, planId }) {
    await api.post("/subscriptions/verify", {
      razorpayPaymentId, razorpayOrderId, razorpaySignature, planId,
    });
  },
  async getStatus() {
    const { data } = await api.get("/subscriptions/status");
    return data.data;
  },
};
