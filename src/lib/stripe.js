import { loadStripe } from "@stripe/stripe-js";

// Stripe is loaded once and reused — never call loadStripe() inside a component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default stripePromise;
