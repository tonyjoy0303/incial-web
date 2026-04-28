"use client";

import { motion, AnimatePresence } from "framer-motion";
import { greetings } from "@/lib/constants";

interface GreetingsOverlayProps {
  greetingIndex: number;
}

export default function GreetingsOverlay({
  greetingIndex,
}: GreetingsOverlayProps) {
  return (
    <motion.div
      key="greetings-overlay"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={greetingIndex}
          lang={greetings[greetingIndex].lang}
          className="flex max-w-[92vw] text-2xl font-semibold text-white sm:text-4xl md:text-5xl"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.03 } },
            exit: {
              transition: { staggerChildren: 0.02, staggerDirection: -1 },
            },
          }}
        >
          {Array.from(
            new Intl.Segmenter(greetings[greetingIndex].lang, {
              granularity: "grapheme",
            }).segment(greetings[greetingIndex].text),
          ).map((item, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -8 },
              }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className={item.segment === " " ? "w-2" : ""}
            >
              {item.segment}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
