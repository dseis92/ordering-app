import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const POINTS_PER_DOLLAR = 10; // 10 points per dollar spent
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1000,
  platinum: 2500,
};

const TIER_BENEFITS = {
  bronze: {
    name: "Bronze",
    discount: 0,
    color: "#cd7f32",
    perks: ["Earn 10 points per dollar"],
  },
  silver: {
    name: "Silver",
    discount: 0.05,
    color: "#c0c0c0",
    perks: ["5% off all orders", "Earn 10 points per dollar", "Birthday reward"],
  },
  gold: {
    name: "Gold",
    discount: 0.10,
    color: "#ffd700",
    perks: ["10% off all orders", "Earn 12 points per dollar", "Birthday reward", "Free delivery"],
  },
  platinum: {
    name: "Platinum",
    discount: 0.15,
    color: "#e5e4e2",
    perks: ["15% off all orders", "Earn 15 points per dollar", "Birthday reward", "Free delivery", "Exclusive specials"],
  },
};

const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      points: 0,
      lifetimePoints: 0,
      tier: "bronze",
      rewards: [], // Available rewards
      redeemedRewards: [],

      // Add points from an order
      addPoints: (orderTotal) => {
        const state = get();
        const tier = state.tier;
        let multiplier = 1;

        // Gold and Platinum tiers earn more points
        if (tier === "gold") multiplier = 1.2;
        if (tier === "platinum") multiplier = 1.5;

        const pointsEarned = Math.floor(orderTotal * POINTS_PER_DOLLAR * multiplier);
        const newPoints = state.points + pointsEarned;
        const newLifetimePoints = state.lifetimePoints + pointsEarned;

        // Determine new tier based on lifetime points
        let newTier = "bronze";
        if (newLifetimePoints >= TIER_THRESHOLDS.platinum) newTier = "platinum";
        else if (newLifetimePoints >= TIER_THRESHOLDS.gold) newTier = "gold";
        else if (newLifetimePoints >= TIER_THRESHOLDS.silver) newTier = "silver";

        set({
          points: newPoints,
          lifetimePoints: newLifetimePoints,
          tier: newTier,
        });

        return pointsEarned;
      },

      // Redeem points for rewards
      redeemReward: (reward) => {
        const state = get();
        if (state.points >= reward.pointCost) {
          set({
            points: state.points - reward.pointCost,
            redeemedRewards: [...state.redeemedRewards, {
              ...reward,
              redeemedAt: new Date().toISOString(),
              code: `REWARD-${Date.now()}`,
            }],
          });
          return true;
        }
        return false;
      },

      // Get current tier info
      getTierInfo: () => {
        const state = get();
        return TIER_BENEFITS[state.tier];
      },

      // Get points to next tier
      getPointsToNextTier: () => {
        const state = get();
        const currentTier = state.tier;

        if (currentTier === "platinum") return 0;

        const nextTier = currentTier === "bronze" ? "silver" : currentTier === "silver" ? "gold" : "platinum";
        return TIER_THRESHOLDS[nextTier] - state.lifetimePoints;
      },

      // Get tier discount
      getTierDiscount: () => {
        const state = get();
        return TIER_BENEFITS[state.tier].discount;
      },

      // Reset (for testing)
      reset: () => set({ points: 0, lifetimePoints: 0, tier: "bronze", rewards: [], redeemedRewards: [] }),
    }),
    {
      name: 'hilltop-loyalty',
      version: 1,
    }
  )
);

// Available rewards catalog
export const REWARDS_CATALOG = [
  {
    id: "free-appetizer",
    name: "Free Appetizer",
    description: "Redeem for any appetizer up to $10",
    pointCost: 250,
    icon: "🧀",
  },
  {
    id: "free-dessert",
    name: "Free Dessert",
    description: "Any dessert on the house",
    pointCost: 150,
    icon: "🍰",
  },
  {
    id: "5-off",
    name: "$5 Off",
    description: "$5 off your next order",
    pointCost: 300,
    icon: "💵",
  },
  {
    id: "10-off",
    name: "$10 Off",
    description: "$10 off your next order",
    pointCost: 500,
    icon: "💰",
  },
  {
    id: "free-delivery",
    name: "Free Delivery",
    description: "Free delivery on your next order",
    pointCost: 200,
    icon: "🚚",
  },
  {
    id: "free-fish-fry",
    name: "Free Fish Fry",
    description: "Complimentary famous fish fry",
    pointCost: 400,
    icon: "🐟",
  },
];

export default useLoyaltyStore;
