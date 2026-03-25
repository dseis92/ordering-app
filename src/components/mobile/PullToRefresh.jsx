import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { RotateCw } from "lucide-react";

export default function PullToRefresh({ onRefresh, children }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const pullDistance = useMotionValue(0);

  const PULL_THRESHOLD = 80; // Distance to trigger refresh
  const MAX_PULL = 120; // Maximum pull distance

  const opacity = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 1]);
  const rotate = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 360]);

  const handleTouchStart = (e) => {
    // Only start if we're at the top of the page
    if (window.scrollY === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      // Apply resistance the further you pull
      const resistance = 1 - (diff / MAX_PULL) * 0.5;
      const newDistance = Math.min(diff * resistance, MAX_PULL);
      pullDistance.set(newDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    const distance = pullDistance.get();

    if (distance >= PULL_THRESHOLD && !isRefreshing) {
      // Trigger refresh
      setIsRefreshing(true);
      animate(pullDistance, PULL_THRESHOLD, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });

      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        // Animate back to 0
        await animate(pullDistance, 0, {
          type: "spring",
          stiffness: 300,
          damping: 30,
        });
        setIsRefreshing(false);
        setIsPulling(false);
      }
    } else {
      // Snap back to 0
      animate(pullDistance, 0, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
      setIsPulling(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPulling, isRefreshing]);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull Indicator */}
      <motion.div
        style={{
          y: pullDistance,
          opacity,
        }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none"
      >
        <div className="bg-white rounded-full shadow-lg p-3 -mt-16">
          <motion.div style={{ rotate }}>
            <RotateCw
              size={24}
              className={`${isRefreshing ? "text-hilltop-green animate-spin" : "text-hilltop-gray"}`}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: pullDistance }}>
        {children}
      </motion.div>
    </div>
  );
}
