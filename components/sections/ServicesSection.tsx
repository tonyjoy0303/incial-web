"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandingSlide from "@/components/features/services/BrandingSlide";
import TechnologySlide from "@/components/features/services/TechnologySlide";
import ExperienceSlide from "@/components/features/services/ExperienceSlide";

const SLIDES = ["intro", "branding", "technology", "experience"] as const;

interface ServicesSectionProps {
  onComplete?: () => void;
  onBack?: () => void;
  initialSlide?: number;
}

export default function ServicesSection({
  onComplete,
  onBack,
  initialSlide = 0,
}: ServicesSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [direction, setDirection] = useState(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling.current) return;

      if (e.deltaY > 0) {
        // Scroll Down
        if (currentSlide < SLIDES.length - 1) {
          isScrolling.current = true;
          setDirection(1);
          setCurrentSlide((prev) => prev + 1);
          setTimeout(() => {
            isScrolling.current = false;
          }, 800);
        } else if (onComplete) {
          // End of section, trigger parent transition
          onComplete();
        }
      } else if (e.deltaY < 0) {
        // Scroll Up
        if (currentSlide > 0) {
          isScrolling.current = true;
          setDirection(-1);
          setCurrentSlide((prev) => prev - 1);
          setTimeout(() => {
            isScrolling.current = false;
          }, 800);
        } else if (onBack) {
          onBack();
        }
      }
    };

    // Touch support (Swipe)
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swipe Up / Scroll Down
          if (currentSlide < SLIDES.length - 1) {
            isScrolling.current = true;
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
            setTimeout(() => {
              isScrolling.current = false;
            }, 800);
          } else if (onComplete) {
            onComplete();
          }
        } else {
          // Swipe Down / Scroll Up
          if (currentSlide > 0) {
            isScrolling.current = true;
            setDirection(-1);
            setCurrentSlide((prev) => prev - 1);
            setTimeout(() => {
              isScrolling.current = false;
            }, 800);
          } else if (onBack) {
            onBack();
          }
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [currentSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction >= 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  // Determine direction for animation based on logic if needed,
  // currently simplified to "new slide comes from bottom" for next, "top" for prev logic handling manually or just constant.
  // For a linear sequence, Next = Slide In from Bottom. Prev = Slide In from Top.

  // Actually, standard fullpage.js feel:
  // Down: Current moves up (exit -100%), Next moves in from bottom (enter 100%).
  // Up: Current moves down (exit 100%), Prev moves in from top (enter -100%).
  // We need to know previous slide to determine direction, but AnimatePresence 'custom' is good for this.

  // Simplified for now: just overlap with Z-index or standard fade-up.
  // Let's stick to the prompt's style which was custom controls.
  // But standard framer motion with `custom` direction is better.

  // Simplify positioning: Use fixed center and translate
  // Branding: Center is Right Middle.
  // Technology: Center is Top Middle (for bottom arc/smile).

  return (
    <section className="h-screen w-full bg-black overflow-hidden relative">
      {/* Shared Background Circle */}
      <motion.div
        className="absolute rounded-full border-2 border-white/80 pointer-events-none z-10"
        animate={
          currentSlide === 1
            ? "branding"
            : currentSlide === 2
              ? "technology"
              : currentSlide === 3
                ? "experience"
                : "intro"
        }
        variants={{
          intro: {
            left: "calc(100% - 210vh)",
            top: "50%",
            y: "100vh",
            x: "0%",
            width: "180vh",
            height: "180vh",
            opacity: 0,
          },
          branding: {
            left: "calc(100% - 210vh)",
            top: "50%",
            y: "-50%",
            x: "0%",
            width: "180vh",
            height: "180vh",
            opacity: 1,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          },
          technology: {
            top: "-130vh",
            left: "40%",
            x: "-50%",
            y: "0%",
            width: "180vh",
            height: "180vh",
            opacity: 1,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          },
          experience: {
            top: "50%",
            left: "calc(100% - 25vh)",
            y: "-50%",
            x: "0%",
            width: "160vh",
            height: "160vh",
            opacity: 1,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence custom={direction}>
        {currentSlide === 0 && (
          <motion.div
            key="intro"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10"
          >
            <h2 className="text-4xl font-bold text-white md:text-6xl">
              Services That Make Magic Happen
            </h2>
            <p className="mt-4 text-xl text-white/80 italic md:text-2xl">
              (And Seriously Grow Your Business)
            </p>
          </motion.div>
        )}

        {currentSlide === 1 && (
          <motion.div
            key="branding"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-20"
          >
            <BrandingSlide />
          </motion.div>
        )}

        {currentSlide === 2 && (
          <motion.div
            key="technology"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-30"
          >
            <TechnologySlide />
          </motion.div>
        )}

        {currentSlide === 3 && (
          <motion.div
            key="experience"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-40"
          >
            <ExperienceSlide />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
