"use client";

import { motion } from "framer-motion";

export default function ExperienceSlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-between px-[clamp(1.5rem,5vw,4rem)] md:px-[clamp(2rem,15vw,6rem)] lg:px-[clamp(3rem,18vw,7rem)] xl:px-[clamp(4rem,20vw,8rem)]">
      {/* Services List - Left Side */}
        <div className="flex gap-[2vw] z-10" style={{ transform: "translateX(clamp(-18vmin, -20vmin, -25vmin))" }}>
        {/* Vertical Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-blue-200 origin-top"
          style={{ width: "clamp(1px, 0.12vw, 2px)" }}
        />

        <div className="flex flex-col gap-[4vmin] font-medium tracking-wide text-blue-200 justify-center" style={{ fontSize: "clamp(0.875rem, 2.5vmin, 2rem)" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Creative Design
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Public Relations
          </motion.div>
        </div>
      </div>

      {/* Main Title - Right Side */}
        <div className="ml-auto flex flex-col items-end text-right z-10 pr-[clamp(0rem,4vw,4rem)]">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[min(100%,14ch)] text-[8vmin] md:text-[10vmin] font-bold text-white leading-tight"
          style={{ fontSize: "clamp(2rem, 9vmin, 5rem)" }}
        >
          Experience
          <br />
          Design
        </motion.h2>
      </div>
    </div>
  );

}
