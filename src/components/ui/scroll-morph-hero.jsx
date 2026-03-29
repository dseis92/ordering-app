import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// --- Types ---
export const AnimationPhase = {
  SCATTER: "scatter",
  LINE: "line",
  CIRCLE: "circle",
  BOTTOM_STRIP: "bottom-strip"
};

// --- FlipCard Component ---
const IMG_WIDTH = 140;
const IMG_HEIGHT = 200;

function FlipCard({ src, index, total, phase, target }) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
      }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl bg-white border-2 border-amber-200"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`Hilltop dish ${index + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity group-hover:opacity-0" />
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-hilltop-green via-hilltop-green-hover to-hilltop-green flex flex-col items-center justify-center p-3 border-2 border-amber-300"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">Explore</p>
            <p className="text-sm font-semibold text-white">Our Menu</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

// Hilltop Food Images from Unsplash
const IMAGES = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", // Burger
  "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&q=80", // Fish
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", // Salad
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80", // Burger close
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80", // Grilled fish
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80", // Salad bowl
  "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400&q=80", // Wings
  "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400&q=80", // Steak
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", // Pizza/flatbread
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", // Appetizer plate
  "https://images.unsplash.com/photo-1603073595699-85f2d13c6084?w=400&q=80", // Pasta
  "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80", // Ribs
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80", // Burger gourmet
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80", // Seafood
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80", // Cheese appetizer
  "https://images.unsplash.com/photo-1615297928064-24977384d0da?w=400&q=80", // Sandwich
  "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", // Chicken dish
  "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=80", // Soup
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80", // Tacos/wraps
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", // Fried food
];

const lerp = (start, end, t) => start * (1 - t) + end * t;

export default function ScrollMorphHero() {
  const [introPhase, setIntroPhase] = useState("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  // --- Virtual Scroll Logic ---
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  // --- Mouse Parallax ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // --- Intro Sequence ---
  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // --- Random Scatter Positions ---
  const scatterPositions = useMemo(() => {
    return IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  // --- Render Loop ---
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubscribeMorph();
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  // --- Content Opacity ---
  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">
        {/* Intro Text (Fades out) */}
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl font-display font-bold tracking-tight text-hilltop-charcoal"
          >
            Hilltop Pub and Grill
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.6 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-xs font-bold tracking-[0.25em] text-amber-700 uppercase"
          >
            Scroll to Explore
          </motion.p>
        </div>

        {/* Arc Active Content (Fades in) */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <h2 className="text-3xl md:text-6xl font-display font-bold text-hilltop-charcoal tracking-tight mb-4">
            Stevens Point's Favorite
          </h2>
          <p className="text-sm md:text-lg text-hilltop-gray max-w-2xl leading-relaxed font-medium">
            Famous for Kathy Mitchell's fish fry since the early 1980s — served daily!
            <br className="hidden md:block" />
            Explore our handcrafted menu of gastropub classics.
          </p>
        </motion.div>

        {/* Main Container */}
        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 110;
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);

              const circleRadius = Math.min(minDimension * 0.35, 350);
              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;

              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);

              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;

              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.8 : 2.4,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
