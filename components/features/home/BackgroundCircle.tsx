"use client";

import { motion } from "framer-motion";
import { RefObject } from "react";

import RotatingEarth from "./RotatingEarth";

interface BackgroundCircleProps {
  circleRef?: RefObject<HTMLDivElement | null>;
  wordIndex: number;
  showLogo: boolean;
  totalWords: number;
}

export default function BackgroundCircle({
  circleRef,
  wordIndex,
  showLogo,
  totalWords,
}: BackgroundCircleProps) {
  // Use the last word index as the animation endpoint so the globe reaches
  // its final raised position before transitioning to the logo state.
  const maxWordIndex = Math.max(totalWords - 1, 1);
  const progress = Math.min(wordIndex / maxWordIndex, 1);
  // Lift slightly higher at the end so the earth sits fully up on the text.
  const yOffset = 90 - progress * 102;

  return (
    <motion.div
      ref={circleRef}
      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2"
      initial={{ y: "90%", opacity: 1 }}
      animate={{
        y: showLogo ? "95%" : `${yOffset}%`,
        opacity: showLogo ? 0 : 1,
      }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        bottom: "-5%",
        width: "clamp(16rem, 82vmin, 62.5rem)",
        height: "clamp(16rem, 82vmin, 62.5rem)",
        willChange: "transform, opacity",
      }}
    >
      <RotatingEarth className="w-full h-full" width={1000} height={1000} />
    </motion.div>
  );
}
