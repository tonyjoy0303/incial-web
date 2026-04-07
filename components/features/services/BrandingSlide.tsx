"use client";

import { motion } from "framer-motion";

export default function BrandingSlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Container for the visual branding elements */}
      <div className="relative flex items-center justify-center">
        {/* Main Circle Group */}
        <div className="relative w-[70vmin] h-[70vmin] md:w-[60vmin] md:h-[60vmin] lg:w-[50vmin] lg:h-[50vmin] flex items-center justify-center -translate-x-[85%] translate-y-[20%]">
          {/* Inner Thin Circle */}
          <div className="absolute inset-0 rounded-full border-2 border-white" />

          <motion.div className="absolute inset-[-15vmin]">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              overflow="visible"
            >
              <defs>
                <path
                  id="textPath"
                  d="M 14, 50 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  transform="rotate(-90 50 50)"
                />
              </defs>
              <text className="text-[8.5px] font-bold fill-white tracking-tighter">
                <textPath
                  href="#textPath"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  Branding & Marketing
                </textPath>
              </text>

              {/* Sub-content Text Group - Horizontal Text Anchored to Circle */}
              <g
                className="uppercase tracking-[0.6em] text-[3px] font-medium fill-blue-300"
                style={{ textAnchor: "start", dominantBaseline: "middle" }}
              >
                {/* Branding */}
                <text x="92" y="50" transform="rotate(-18 50 50)">
                  BRANDING
                </text>

                {/* Social Media */}
                <text x="92" y="50" transform="rotate(-6 50 50)">
                  SOCIAL MEDIA MANAGEMENT
                </text>

                {/* Digital Marketing */}
                <text x="92" y="50" transform="rotate(6 50 50)">
                  DIGITAL MARKETING
                </text>

                {/* SEO */}
                <text x="92" y="50" transform="rotate(18 50 50)">
                  SEO & DIGITAL ADS
                </text>
              </g>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
