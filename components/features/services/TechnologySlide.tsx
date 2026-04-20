"use client";

import { motion } from "framer-motion";

export default function TechnologySlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-6xl flex flex-col items-center justify-center">
        {/* Curved Technology Text */}
        <div className="absolute w-full flex items-center justify-center pointer-events-none" style={{ top: "clamp(15%, 18%, 22%)", left: "clamp(-20%, -14%, -8%)", height: "clamp(50vmin, 55vmin, 65vmin)", transform: "translateY(-1vmin) translateX(-2vmin)" }}>
          <svg viewBox="0 0 1000 500" className="w-[120%] h-full">
            <path
              id="techCurve"
              d="M 100,240 Q 500,460 900,240"
              fill="transparent"
            />
            <text
              style={{ fontSize: "calc(11.7vmin + 0.5cm)" }}
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
        <div className="absolute top-[73%] flex flex-col gap-[3vh] -rotate-12" style={{ transform: `translateX(clamp(-30vw, calc(-23vw - 8vmin), -40vw)) translateY(calc(-8vmin - 2cm))` }}>
          <div className="flex gap-[2vw]">
            <div className="flex flex-col gap-[3vmin] font-medium tracking-widest text-blue-200" style={{ fontSize: "clamp(0.875rem, 2.5vmin, 2rem)" }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-[2.85vmin]"
                style={{ fontSize: "clamp(0.875rem, 2.85vmin, 2.25rem)" }}
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
                className="text-[2.85vmin]"
                style={{ fontSize: "clamp(0.875rem, 2.85vmin, 2.25rem)" }}
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
                className="text-[2.85vmin]"
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












