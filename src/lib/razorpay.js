export function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiatePayment({ orderId, amount, name, email, phone, planName, onSuccess, onDismiss }) {
  const loaded = await loadRazorpay();
  if (!loaded) throw new Error("Razorpay SDK failed to load");

  const rzp = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: "INR",
    name: "Study Buddy",
    description: `${planName} Plan Subscription`,
    order_id: orderId,
    handler: onSuccess,
    prefill: { name, email, contact: phone },
    theme: { color: "#7C3AED" },
    modal: { ondismiss: onDismiss },
  });

  rzp.open();
}
