"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  const [scrollHidden, setScrollHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < 6) return;

      if (currentScrollY <= 24) {
        setScrollHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      setScrollHidden(delta > 0);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuOffsetY = "6.25rem";
  const hiddenY = variant === "pill" ? "-7.5rem" : "-8.75rem";
  const isHidden = hidden || scrollHidden;

  if (variant === "pill") {
    return (
      <>
        <AnimatePresence>{menuOpen && <NavMenu />}</AnimatePresence>

        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: menuOpen ? menuOffsetY : isHidden ? hiddenY : 0,
            opacity: 1,
            scale: menuOpen ? 0.95 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 z-50 -translate-x-1/2 origin-top" style={{ top: "clamp(1.25rem, 1.5vmax, 2.5rem)" }}
        >
          <div className="flex items-center gap-3 sm:gap-4 rounded-full border border-white/20 bg-black/60 px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-md shadow-lg shadow-black/30">
            {/* Logo */}
            <div className="text-xs sm:text-sm font-light tracking-wide text-white whitespace-nowrap">
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
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-white/10"
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
          y: menuOpen ? menuOffsetY : isHidden ? hiddenY : 0,
          scale: menuOpen ? 0.95 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 origin-top"
      >
        <div className="layout-container flex items-center justify-between px-1 pb-4 pt-8 sm:pt-10">
          {/* Logo */}
          <div className="text-lg sm:text-xl font-light tracking-wide text-white">
            We Are <span className="font-bold">incial.</span>
          </div>

          {/* Menu toggle */}
          <button
            onClick={onToggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-white/30 px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
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
        </div>
      </motion.header>
    </>
  );
}
