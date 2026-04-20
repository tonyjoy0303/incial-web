"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ClientsData, Client, Testimonial } from "@/lib/dataLoader";

interface ClientSectionProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export default function ClientSection({
  onBack,
  onComplete,
}: ClientSectionProps) {
  const [data, setData] = useState<ClientsData | null>(null);
  const [sectionsConfig, setSectionsConfig] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);

    fetch("/api/admin/sections")
      .then((res) => res.json())
      .then((d) => {
        if (d?.sections) {
          const configMap: Record<string, boolean> = {};
          d.sections.forEach((s: any) => {
            configMap[s.id] = s.enabled;
          });
          setSectionsConfig(configMap);
        }
      })
      .catch(console.error);
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
      }, 1500);
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
        }, 1500);
      } else if (deltaY < -50) {
        isScrolling = true;
        if (onBack) onBack();
        setTimeout(() => {
          isScrolling = false;
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
  }, [onBack, onComplete]);

  return (
    <section className="h-screen w-full bg-black text-white flex flex-col justify-center items-center relative overflow-hidden">
      <div className="layout-container relative z-10 h-full flex flex-col justify-center items-center">
        <motion.div
          className="flex flex-col items-center w-full max-w-7xl"
          initial={{ opacity: 0, y: "3.125rem" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xl md:text-2xl italic font-light tracking-wide text-white font-[Poppins]">
              {data?.headerText || "Some of Our Awesome Clients:"}
            </p>
          </div>

          {/* Client Logo Grid */}
          {sectionsConfig["client-logos"] !== false && (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-2.5 2xl:gap-3 mb-10 md:mb-14 w-full">
              {(data?.clients || []).map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.025,
                    ease: "easeOut",
                  }}
                  className="bg-white rounded-[5px] flex items-center justify-center p-2 aspect-[3/2] relative overflow-hidden group transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  <Image
                    src={client.src}
                    alt={client.name}
                    fill
                    className="object-contain p-2 pointer-events-none"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12.5vw"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Testimonials */}
          {sectionsConfig["client-testimonials"] !== false && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 w-full max-w-5xl px-4">
              {(data?.testimonials || []).map((test) => (
                <div key={test.id} className="flex flex-col">
                  <p className="text-base md:text-lg italic text-white/80 mb-4 font-light leading-relaxed font-[Poppins]">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                  <p className="text-right text-white/60 font-light text-sm italic tracking-wide">
                    ~ {test.author}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
