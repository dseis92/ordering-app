import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Bubble({ x, y, size, color }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.7, 0.3, 0.7],
        scale: [1, 1.2, 1],
        x: x + Math.random() * 100 - 50,
        y: y + Math.random() * 100 - 50,
      }}
      transition={{
        duration: 5 + Math.random() * 10,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
}

function FloatingBubbles() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Warm gold and amber colors for pub atmosphere
    const bubbleColors = [
      "rgba(255, 193, 7, 0.25)",   // Golden amber
      "rgba(255, 152, 0, 0.3)",    // Deep orange
      "rgba(255, 235, 59, 0.2)",   // Light gold
      "rgba(245, 127, 23, 0.25)",  // Burnt orange
      "rgba(255, 213, 79, 0.3)",   // Rich gold
      "rgba(255, 167, 38, 0.2)",   // Warm amber
    ];

    const newBubbles = Array.from({ length: 65 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 5,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        <title>Floating Bubbles</title>
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} {...bubble} />
        ))}
      </svg>
    </div>
  );
}

export default function FloatingBubblesBackground({
  title = "Hilltop Pub and Grill",
  subtitle,
  description,
  children
}) {
  const words = title.split(" ");

  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-hilltop-green via-hilltop-green-hover to-hilltop-green">
      <FloatingBubbles />

      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tight">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-white"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {subtitle && (
            <p className="text-gray-200 text-xl md:text-2xl mb-3 font-light">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="text-gray-300 text-lg md:text-xl mb-10 italic">
              {description}
            </p>
          )}

          {children && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
