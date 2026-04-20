"use client";

import { motion } from "framer-motion";

export default function BrandingSlide() {
  const circleBorderStyle = {
    borderWidth: "clamp(1px, 0.12vw, 2px)",
  } as const;

  const brandingTextStyle = {
    fontSize: "clamp(0.56rem, 0.72vw, 0.64rem)",
    lineHeight: 1,
  } as const;

  const subTextStyle = {
    fontSize: "clamp(0.2rem, 0.28vw, 0.24rem)",
    lineHeight: 1,
    letterSpacing: "0.05em",
  } as const;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Container for the visual branding elements */}
      <div className="relative flex items-center justify-center">
        {/* Main Circle Group */}
        <div className="relative w-[70vmin] h-[70vmin] md:w-[60vmin] md:h-[60vmin] lg:w-[50vmin] lg:h-[50vmin] flex items-center justify-center" style={{ transform: "translateX(clamp(-60%, -75%, -85%)) translateY(20%)" }}>
          {/* Inner Thin Circle */}
          <div
            className="absolute inset-0 rounded-full border-white"
            style={circleBorderStyle}
          />

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
              <text
                className="font-bold fill-white tracking-tighter"
                style={{ ...brandingTextStyle, transform: "translateY(-4px)" }}
              >
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
                className="uppercase font-medium fill-blue-300"
                style={{ textAnchor: "start", dominantBaseline: "middle" }}
              >
                {/* Branding */}
                <text x="82" y="50" transform="rotate(-18 50 50)" style={subTextStyle}>
                  BRANDING
                </text>

                {/* Social Media */}
                <text x="82" y="50" transform="rotate(-6 50 50)" style={subTextStyle}>
                  SOCIAL MEDIA MANAGEMENT
                </text>

                {/* Digital Marketing */}
                <text x="82" y="50" transform="rotate(6 50 50)" style={subTextStyle}>
                  DIGITAL MARKETING
                </text>

                {/* SEO */}
                <text x="82" y="50" transform="rotate(18 50 50)" style={subTextStyle}>
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
