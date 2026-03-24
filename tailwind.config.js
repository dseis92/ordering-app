/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        linen: "#ecebe4",
        fern: "#64b445",
        forest: "#134611",
        blackpure: "#000000",
        // Modern food delivery colors
        brand: {
          primary: "#16a34a", // Vibrant green (similar to Uber Eats)
          dark: "#15803d",
          light: "#22c55e",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        }
      }
    },
  },
  plugins: [],
}
