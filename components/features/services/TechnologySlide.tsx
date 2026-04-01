"use client";

import { motion } from "framer-motion";

export default function TechnologySlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-6xl flex flex-col items-center justify-center">
        {/* Curved Technology Text */}
        <div className="absolute top-[3%] left-[-20%] w-full h-[50vmin] lg:h-[60vmin] flex items-center justify-center pointer-events-none -translate-y-[38px] translate-x-[38px]">
          <svg viewBox="0 0 1000 500" className="w-[120%] h-full">
            <path
              id="techCurve"
              d="M 100,280 Q 500,520 900,280"
              fill="transparent"
            />
            <text
              fontSize="96"
              fontWeight="bold"
              fill="white"
              letterSpacing="-2"
            >
              <textPath href="#techCurve" startOffset="50%" textAnchor="middle">
                Technology
              </textPath>
            </text>
          </svg>
        </div>

        {/* Services List */}
        <div className="absolute top-[68%] flex flex-col gap-[3vh] -rotate-12 -translate-x-[calc(15vw+113px)] -translate-y-[76px]">
          <div className="flex gap-[2vw]">
            {/* Vertical Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-[2px] bg-blue-200 origin-top"
            />

            <div className="flex flex-col gap-6 text-xl md:text-2xl font-medium tracking-widest text-blue-200">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                WEBSITE BUILDING & DESIGN (UI/UX)
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.9,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                VFX & CGI
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 1.0,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                PRODUCT DESIGN
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
