"use client";

import { motion } from "framer-motion";

export default function TechnologySlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-6xl flex items-center justify-center">

        {/* ✅ CURVED TEXT (FIXED) */}
        <div
          className="absolute w-full flex items-center justify-center pointer-events-none"
          style={{
            top: "20%",
            left: "-15%",
            height: "55vmin",
          }}
        >
          <svg viewBox="0 0 1000 500" className="w-[120%] h-full">
            <path
              id="techCurve"
              d="M 100,250 Q 500,380 900,250" // smoother curve
              fill="transparent"
            />
            <text
              fontWeight="bold"
              fill="white"
              letterSpacing="-2"
              dominantBaseline="middle"
              style={{ fontSize: "clamp(3rem, 9vmin, 7rem)" }} // ✅ fixed
            >
              <textPath href="#techCurve" startOffset="50%" textAnchor="middle">
                Technology
              </textPath>
            </text>
          </svg>
        </div>

        {/* ✅ SERVICES (FIXED POSITION) */}
        <div
          className="absolute flex flex-col gap-[3vh] -rotate-12"
          style={{
            top: "65%",
            left: "18%",
          }}
        >
          <div className="flex flex-col gap-[3vmin] font-medium tracking-widest text-blue-200">

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ fontSize: "clamp(1rem, 2.5vmin, 2rem)" }}
            >
              WEBSITE BUILDING & DESIGN (UI/UX)
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ fontSize: "clamp(1rem, 2.5vmin, 2rem)" }}
            >
              VFX & CGI
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              style={{ fontSize: "clamp(1rem, 2.5vmin, 2rem)" }}
            >
              PRODUCT DESIGN
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}