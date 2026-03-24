import { motion } from "framer-motion";

export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-dark shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
    ghost: "text-brand-primary hover:bg-brand-primary/10",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
