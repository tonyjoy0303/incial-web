"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowDown } from "react-icons/fi";

interface LogoScreenProps {
  onNextClick?: () => void;
}

export default function LogoScreen({ onNextClick }: LogoScreenProps) {
  return (
    <motion.div
      key="logo-screen"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex h-full w-full items-center justify-center"
    >
      {/* Left Button */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute left-[10%] hidden md:block"
      >
        <button className="rounded-full border border-white/30 px-8 py-3 text-sm text-white transition hover:bg-white hover:text-black">
          About Us
        </button>
      </motion.div>

      {/* Center Logo Area */}
      <div className="relative flex h-64 w-64 items-center justify-center md:h-96 md:w-96">
        <Image
          src="/logo/Logoo-white.svg"
          alt="Incial Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Right Button */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute right-[10%] hidden md:block"
      >
        <button className="rounded-full border border-white/30 px-8 py-3 text-sm text-white transition hover:bg-white hover:text-black">
          Our Works
        </button>
      </motion.div>
    </motion.div>
  );
}
