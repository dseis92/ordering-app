import { motion } from "framer-motion";
import { Award, TrendingUp, Gift, Star, Crown } from "lucide-react";
import useLoyaltyStore, { REWARDS_CATALOG } from "../store/useLoyaltyStore";
import Button from "../components/ui/Button";

export default function RewardsPage() {
  const points = useLoyaltyStore((s) => s.points);
  const lifetimePoints = useLoyaltyStore((s) => s.lifetimePoints);
  const tier = useLoyaltyStore((s) => s.tier);
  const redeemedRewards = useLoyaltyStore((s) => s.redeemedRewards);
  const redeemReward = useLoyaltyStore((s) => s.redeemReward);
  const getTierInfo = useLoyaltyStore((s) => s.getTierInfo);
  const getPointsToNextTier = useLoyaltyStore((s) => s.getPointsToNextTier);

  const tierInfo = getTierInfo();
  const pointsToNext = getPointsToNextTier();

  const TIER_ICONS = {
    bronze: Award,
    silver: Star,
    gold: Crown,
    platinum: Crown,
  };

  const TierIcon = TIER_ICONS[tier];

  const handleRedeem = (reward) => {
    const success = redeemReward(reward);
    if (success) {
      alert(`🎉 Reward redeemed! Use code: REWARD-${Date.now()} at checkout`);
    } else {
      alert("Not enough points to redeem this reward");
    }
  };

  return (
    <div className="bg-hilltop-bg-light min-h-screen pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-hilltop-green to-emerald-600 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <TierIcon size={48} className="mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-2">
              Hilltop Rewards
            </h1>
            <p className="text-xl text-white/90">
              {tierInfo.name} Member
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-hilltop-gray">Available Points</p>
              <p className="text-4xl font-bold text-hilltop-charcoal">{points.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-hilltop-gray">Lifetime Points</p>
              <p className="text-2xl font-bold text-hilltop-green">{lifetimePoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {pointsToNext > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-hilltop-gray">Progress to next tier</span>
                <span className="font-semibold text-hilltop-charcoal">
                  {pointsToNext.toLocaleString()} points to go
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      100,
                      ((lifetimePoints / (lifetimePoints + pointsToNext)) * 100)
                    )}%`,
                  }}
                  className="h-full bg-gradient-to-r from-hilltop-green to-emerald-500"
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
          )}
          {pointsToNext === 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <p className="text-sm font-semibold text-purple-900">
                🎉 You've reached the highest tier!
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tier Benefits */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-display font-bold text-hilltop-charcoal mb-4">
          Your {tierInfo.name} Benefits
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ul className="space-y-3">
            {tierInfo.perks.map((perk, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-hilltop-green flex-shrink-0" />
                <span className="text-hilltop-gray">{perk}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Available Rewards */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-display font-bold text-hilltop-charcoal mb-4">
          Redeem Points
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {REWARDS_CATALOG.map((reward, index) => {
            const canAfford = points >= reward.pointCost;
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl border-2 p-5 ${
                  canAfford ? "border-hilltop-green" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{reward.icon}</div>
                  <div className="bg-hilltop-green/10 text-hilltop-green px-3 py-1 rounded-full text-sm font-bold">
                    {reward.pointCost} pts
                  </div>
                </div>
                <h3 className="font-bold text-hilltop-charcoal text-lg mb-1">
                  {reward.name}
                </h3>
                <p className="text-sm text-hilltop-gray mb-4">{reward.description}</p>
                <Button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className="w-full py-2 text-sm"
                >
                  {canAfford ? "Redeem" : "Need More Points"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Redeemed Rewards */}
      {redeemedRewards.length > 0 && (
        <section className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-hilltop-charcoal mb-4">
            Your Rewards
          </h2>
          <div className="space-y-3">
            {redeemedRewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{reward.icon}</div>
                  <div>
                    <p className="font-semibold text-hilltop-charcoal">{reward.name}</p>
                    <p className="text-sm text-hilltop-gray">Code: {reward.code}</p>
                  </div>
                </div>
                <Gift size={24} className="text-hilltop-green" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* How to Earn */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-hilltop-green to-emerald-600 rounded-2xl p-6 sm:p-8 text-white text-center">
          <TrendingUp size={40} className="mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">How to Earn Points</h2>
          <p className="text-white/90 mb-4">
            Earn 10 points for every dollar you spend on orders!
          </p>
          <p className="text-sm text-white/80">
            Points are automatically added to your account after each order.
          </p>
        </div>
      </section>
    </div>
  );
}
