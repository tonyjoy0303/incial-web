"use client";

import { AnimatePresence, motion } from "framer-motion";

interface RotatingTextProps {
  wordIndex: number;
  words: string[];
}

export default function RotatingText({ wordIndex, words }: RotatingTextProps) {
  return (
    <motion.div
      key="rotating-text-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="flex w-full flex-col items-center justify-center gap-1 px-4 text-center sm:flex-row sm:gap-3"
    >
      <div
        className="font-light text-white/90"
        style={{ fontSize: "clamp(1.25rem, 5.2vw, 6rem)" }}
      >
        We <span className="italic">build</span>
      </div>
      <div
        className="font-bold text-white sm:text-left"
        style={{ fontSize: "clamp(1.25rem, 5.2vw, 6rem)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier for smooth motion
            }}
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
