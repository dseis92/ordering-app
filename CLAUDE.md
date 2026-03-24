# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Restaurant Information

**Hilltop Pub and Grill**
- Location: 4901 Main St., Stevens Point, WI 54481
- Phone: (715) 341-3037
- Hours: Mon & Sun 10:30am–9pm, Tue–Sat 10:30am–10pm
- Established: Early 1980s
- Famous for: Kathy Mitchell's fish fry (signature dish since the 1980s, served daily)

## Commands

```bash
npm run dev        # Start dev server with HMR (Vite)
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

There is no test suite configured.

## Architecture

This is a multi-page React 19 app built with Vite and React Router.

**Key Pages:**
- `/` — MenuPage: Browse menu with category filtering, search, and customization
- `/checkout` — CheckoutPage: Order form with Stripe payment integration (simulated)
- `/confirmation` — ConfirmationPage: Order success with confetti animation

**State Management:**
- Zustand stores for cart (`useCartStore`) and order (`useOrderStore`)
- Cart persists items, quantities, and customizations
- Order store tracks customer info, order type (pickup/delivery), and order status

**Menu Data:**
- `src/data/menu.js` — Menu items organized by category (appetizers, fish-fry, burgers, dinners, salads)
- Each item supports customization options (sizes, toppings, temperatures, etc.)
- Categories include: Appetizers, Fish Fry, Burgers & Sandwiches, Dinners, Salads & Soup

**Payment:**
- Stripe integration via `@stripe/react-stripe-js` and `@stripe/stripe-js`
- Currently simulated (see `src/pages/CheckoutPage.jsx:78-80`)
- Ready for backend API integration at `/api/orders`

## Styling

Tailwind CSS v3 with custom pub-themed colors in `tailwind.config.js`:
- `linen` (#ecebe4) — background
- `fern` (#64b445) — accents, progress
- `forest` (#134611) — primary text, buttons
- `blackpure` (#000000)

**Animations:**
- `framer-motion` — Page transitions, card interactions, form animations
- `canvas-confetti` — Celebration effect on order confirmation
- `react-hot-toast` — Toast notifications for cart actions

**Brand Configuration:**
- `src/brand.config.js` — Restaurant details, tax rate (5.5% WI), hours, contact info
