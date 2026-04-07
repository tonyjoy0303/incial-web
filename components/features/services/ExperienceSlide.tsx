"use client";

import { motion } from "framer-motion";

export default function ExperienceSlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-between px-[5vw] md:px-[15vw]">
      {/* Services List - Left Side */}
      <div className="flex gap-[2vw] z-10 -translate-x-[20vmin]">
        {/* Vertical Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[2px] bg-blue-200 origin-top"
        />

        <div className="flex flex-col gap-[4vmin] text-[2.5vmin] font-medium tracking-wide text-blue-200 justify-center">
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
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Social Media Management
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
      <div className="flex flex-col items-end text-right z-10 translate-x-[2vmin]">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[8vmin] md:text-[10vmin] font-bold text-white leading-tight"
        >
          Experience
          <br />
          Design
        </motion.h2>
      </div>
    </div>
  );
}
