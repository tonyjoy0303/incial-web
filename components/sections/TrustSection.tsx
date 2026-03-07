"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Stat {
  id: string;
  value: string;
  label: string;
}

interface TrustApiData {
  title: string;
  stats: Stat[];
}

interface TrustSectionProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export default function TrustSection({
  onBack,
  onComplete,
}: TrustSectionProps) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [title, setTitle] = useState("Why Trust Incial?");

  useEffect(() => {
    fetch("/api/admin/trust")
      .then((r) => r.json())
      .then((d: TrustApiData) => {
        setStats(d.stats || []);
        if (d.title) setTitle(d.title);
      })
      .catch(() => {
        setStats([
          { id: "1", value: "60+", label: "Happy Clients" },
          { id: "2", value: "80+", label: "Projects Completed" },
        ]);
      });
  }, []);

  useEffect(() => {
    let isScrolling = false;
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling) return;
      isScrolling = true;
      if (e.deltaY > 0) {
        if (onComplete) onComplete();
      } else {
        if (onBack) onBack();
      }
      setTimeout(() => {
        isScrolling = false;
      }, 500);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (deltaY > 50) {
        isScrolling = true;
        if (onComplete) onComplete();
        setTimeout(() => {
          isScrolling = false;
        }, 500);
      } else if (deltaY < -50) {
        isScrolling = true;
        if (onBack) onBack();
        setTimeout(() => {
          isScrolling = false;
        }, 500);
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
  }, [onBack, onComplete]);

  return (
    <section className="h-screen w-full bg-black text-white flex flex-col justify-center items-center relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col justify-center items-center">
        <motion.div
          className="flex flex-col justify-center items-center w-full max-w-5xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Title */}
          <div className="text-center mb-24 md:mb-32">
            <h2 className="text-5xl md:text-7xl font-light tracking-tight italic text-white">
              {title}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="flex justify-between w-full text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-7xl md:text-[80px] font-bold text-[#5ba4e6] mb-4 italic tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-xl md:text-2xl text-white font-normal">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
