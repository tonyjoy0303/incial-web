"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { rotatingWords } from "@/lib/constants";

// Components
import RotatingText from "@/components/features/home/RotatingText";
import LogoScreen from "@/components/features/home/LogoScreen";
import BackgroundCircle from "@/components/features/home/BackgroundCircle";
import ServicesSection from "@/components/sections/ServicesSection";

interface ScrollSectionProps {
  onScrollComplete?: () => void;
  onBack?: () => void;
  startAtEnd?: boolean;
  skipAnimation?: boolean;
}

export default function ScrollSection({
  onScrollComplete,
  onBack,
  startAtEnd = false,
  skipAnimation = false,
}: ScrollSectionProps) {
  const [wordIndex, setWordIndex] = useState(
    startAtEnd ? rotatingWords.length - 1 : 0,
  );
  const [showLogo, setShowLogo] = useState(startAtEnd);
  const [showServices, setShowServices] = useState(startAtEnd);
  const [returnFromServices, setReturnFromServices] = useState(false);

  const isScrolling = useRef(false);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto flow: keep advancing wordIndex until we reach the end, then showLogo.
    // If startAtEnd is true, this won't run because showLogo is true or wordIndex is at max.
    if (!showLogo && !showServices) {
      const timer = setTimeout(() => {
        if (wordIndex < rotatingWords.length - 1) {
          setWordIndex((prev) => prev + 1);
        } else {
          setShowLogo(true);
        }
      }, 1500); // Increased from 700ms to 1500ms per word
      return () => clearTimeout(timer);
    }
  }, [wordIndex, showLogo, showServices]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling.current) return;

      if (e.deltaY > 0) {
        // Scroll Down
        isScrolling.current = true;

        if (!showLogo) {
          // If the user scrolls down during the introductory text rotation,
          // instantly jump to the finished LogoScreen state.
          setReturnFromServices(true);
          setShowLogo(true);
        } else if (showLogo && !showServices) {
          setShowServices(true);
        }

        setTimeout(() => {
          isScrolling.current = false;
        }, 1500); // Debounce
      } else if (e.deltaY < 0) {
        // Scroll Up
        isScrolling.current = true;
        if (showServices) {
          // Handled by ServicesSection going back
        } else if (showLogo && onBack) {
          onBack();
        } else if (!showLogo && onBack) {
          // Allow backing out even while auto-animating
          onBack();
        }
        setTimeout(() => {
          isScrolling.current = false;
        }, 1500); // Debounce
      }
    };

    // Touch support (basic Swipe)
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scrolling when inside scroll section
      if (typeof window !== "undefined" && window.scrollY === 0) {
        e.preventDefault();
      }

      if (isScrolling.current) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swipe Up / Scroll Down
          isScrolling.current = true;

          if (!showLogo) {
            setReturnFromServices(true);
            setShowLogo(true);
          } else if (showLogo && !showServices) {
            setShowServices(true);
          }
        } else {
          // Swipe Down / Scroll Up
          isScrolling.current = true;
          if (showServices) {
            // Handled by ServicesSection
          } else if (showLogo && onBack) {
            onBack();
          } else if (!showLogo && onBack) {
            onBack();
          }
        }
        setTimeout(() => {
          isScrolling.current = false;
        }, 1500);
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
  }, [showLogo, showServices, onBack]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Main Interaction Area */}
        <main className="relative z-20 flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {showServices ? (
              <ServicesSection
                initialSlide={startAtEnd ? 3 : 0}
                onComplete={onScrollComplete}
                onBack={() => {
                  setReturnFromServices(true);
                  setShowServices(false);
                }}
              />
            ) : !showLogo ? (
              <RotatingText wordIndex={wordIndex} words={rotatingWords} />
            ) : (
              <LogoScreen
                skipAnimation={
                  startAtEnd || returnFromServices || skipAnimation
                }
                onNextClick={() => setShowServices(true)}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Animated Background - Only shown before services */}
        {!showServices && (
          <BackgroundCircle
            circleRef={circleRef}
            wordIndex={wordIndex}
            showLogo={showLogo}
            totalWords={rotatingWords.length}
          />
        )}
      </div>
    </div>
  );
}
