/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Hilltop Pub and Grill brand colors
        hilltop: {
          green: "#0a4f39",      // Deep forest green - primary
          "green-hover": "#11694d", // Lighter green - hover state
          charcoal: "#1b1b1b",   // Dark text
          gray: "#575757",       // Body text
          "gray-light": "#5e5e5e", // Secondary text
          "bg-light": "#f6f6f6", // Light background sections
        },
        // Modern food delivery colors
        brand: {
          primary: "#0a4f39",    // Hilltop green
          dark: "#083d2d",       // Darker green
          light: "#11694d",      // Lighter green for hover
        },
        gray: {
          50: "#f9fafb",
          100: "#f6f6f6",        // Match Hilltop's light bg
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#575757",        // Match Hilltop's body text
          700: "#374151",
          800: "#1f2937",
          900: "#1b1b1b",        // Match Hilltop's dark text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
