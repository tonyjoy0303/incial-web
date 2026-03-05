"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { greetings } from "@/lib/constants";
import { Header, NavMenu } from "@/components/layout";
import {
  GreetingsOverlay,
  HeroSection,
  ScrollSection,
  TrustSection,
  ContactSection,
} from "@/components/sections";

type Phase = "greetings" | "hero" | "scrolling" | "trust" | "about" | "contact";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("greetings");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── Greeting sequence ──────────────────────────── */
  useEffect(() => {
    if (phase !== "greetings") return;

    if (greetingIndex < greetings.length - 1) {
      const timer = setTimeout(() => setGreetingIndex((prev) => prev + 1), 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("hero"), 500);
      return () => clearTimeout(timer);
    }
  }, [greetingIndex, phase]);

  const handleStart = useCallback(() => setPhase("scrolling"), []);
  const handleToggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  return (
    <>
      {/* Greetings overlay */}
      <AnimatePresence>
        {phase === "greetings" && (
          <GreetingsOverlay greetingIndex={greetingIndex} />
        )}
      </AnimatePresence>

      {/* Main page */}
      <div className="relative bg-white">
        {/* Header — hidden during greetings */}
        {phase !== "greetings" && (
          <Header menuOpen={menuOpen} onToggleMenu={handleToggleMenu} />
        )}

        {/* Navigation dropdown */}
        <AnimatePresence>{menuOpen && <NavMenu />}</AnimatePresence>

        {/* Content area — shifts down when menu is open */}
        <motion.div
          animate={{
            y: menuOpen ? 100 : 0,
            scale: menuOpen ? 0.95 : 1,
            borderTopLeftRadius: menuOpen ? 24 : 0,
            borderTopRightRadius: menuOpen ? 24 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative origin-top overflow-hidden bg-black text-white"
          style={{ zIndex: 30 }}
        >
          <AnimatePresence mode="wait">
            {phase === "hero" && (
              <motion.div
                key="hero"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HeroSection onStart={handleStart} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "scrolling" && (
              <motion.div
                key="scroll"
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100vh", opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <ScrollSection
                  initialServicesSlide={0}
                  onScrollComplete={() => {
                    setPhase("trust");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "trust" && (
              <motion.div
                key="trust"
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100vh", opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <TrustSection
                  onBack={() => {
                    // Since services is inside scrolling now,
                    // we go back to scrolling phase.
                    // The ScrollSection itself takes `initialServicesSlide = 3` internally to jump to the last slide
                    // Let's modify phase handler for that if you want, but sticking to "scrolling" works
                    setPhase("scrolling");
                  }}
                  onComplete={() => setPhase("contact")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "contact" && (
              <motion.div
                key="contact"
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <ContactSection onBack={() => setPhase("trust")} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
