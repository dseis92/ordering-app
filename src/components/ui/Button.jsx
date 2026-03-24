import { motion } from "framer-motion";

export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-hilltop-green text-white hover:bg-hilltop-green-hover shadow-sm",
    secondary: "bg-gray-100 text-hilltop-charcoal hover:bg-gray-200",
    outline: "border-2 border-hilltop-green text-hilltop-green hover:bg-hilltop-green hover:text-white",
    ghost: "text-hilltop-green hover:bg-hilltop-green/10",
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
