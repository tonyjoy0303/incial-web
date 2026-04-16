"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import SocialLinks from "@/components/ui/SocialLinks";
import NavMenu from "@/components/layout/NavMenu";

interface HeaderProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
  variant?: "default" | "pill";
  hidden?: boolean;
}

export default function Header({
  menuOpen,
  onToggleMenu,
  variant = "default",
  hidden = false,
}: HeaderProps) {
  const hiddenY = variant === "pill" ? -120 : -140;

  if (variant === "pill") {
    return (
      <>
        <AnimatePresence>{menuOpen && <NavMenu />}</AnimatePresence>

        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: menuOpen ? 100 : hidden ? hiddenY : 0,
            opacity: 1,
            scale: menuOpen ? 0.95 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 origin-top"
        >
          <div className="flex items-center gap-4 rounded-full border border-white/20 bg-black/60 px-5 py-3 backdrop-blur-md shadow-lg shadow-black/30">
            {/* Logo */}
            <div className="text-sm font-light tracking-wide text-white whitespace-nowrap">
              We Are <span className="font-bold">incial.</span>
            </div>

            <div className="h-4 w-px bg-white/20" />

            {/* Social icons */}
            <SocialLinks />

            <div className="h-4 w-px bg-white/20" />

            {/* Menu toggle */}
            <button
              onClick={onToggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {menuOpen ? "Close" : "Menu"}
              {menuOpen ? (
                <IoCloseOutline className="text-lg" />
              ) : (
                <HiMenuAlt3 className="text-lg" />
              )}
            </button>
          </div>
        </motion.header>
      </>
    );
  }

  return (
    <>
      {/* ── NavMenu — full-screen white overlay slides down ── */}
      <AnimatePresence>{menuOpen && <NavMenu />}</AnimatePresence>

      {/* ── Header bar — pushes down when menu opens ── */}
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: menuOpen ? 100 : hidden ? hiddenY : 0,
          scale: menuOpen ? 0.95 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 flex origin-top items-center justify-between px-10 pb-4 pt-10 md:px-20"
      >
        {/* Logo */}
        <div className="text-xl font-light tracking-wide text-white">
          We Are <span className="font-bold">incial.</span>
        </div>

        {/* Menu toggle */}
        <button
          onClick={onToggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          {menuOpen ? "Close" : "Menu"}
          {menuOpen ? (
            <IoCloseOutline className="text-lg" />
          ) : (
            <HiMenuAlt3 className="text-lg" />
          )}
        </button>

        {/* Social icons */}
        <SocialLinks />
      </motion.header>
    </>
  );
}
