"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { navLinks } from "@/lib/constants";
import type { SectionConfig } from "@/lib/dataLoader";

export default function NavMenu() {
  const [enabledSections, setEnabledSections] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/sections")
      .then((res) => res.json())
      .then((data: { sections: SectionConfig[] }) => {
        const enabled = data.sections.filter((s) => s.enabled).map((s) => s.id);
        setEnabledSections(enabled);
      })
      .catch(() => {
        // Fallback: don't filter anything if API fails
        setEnabledSections([]);
      });
  }, []);

  const visibleLinks = navLinks.filter((link) => {
    // If we haven't loaded config yet, or if the link has no sectionId, show it
    if (!enabledSections || !link.sectionId) return true;
    return enabledSections.includes(link.sectionId);
  });

  return (
    <motion.nav
      initial={{ y: "-5rem", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-5rem", opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 bg-white py-6 sm:py-7 lg:py-8"
    >
      <div className="layout-container flex items-center justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
        {visibleLinks.map((link, i) => (
          <div key={link.label} className="flex items-center">
            <Link
              href={link.href}
              className="px-3 sm:px-4 lg:px-5 text-sm font-medium text-black transition-colors hover:text-black/60"
            >
              {link.label}
            </Link>
            {i < visibleLinks.length - 1 && (
              <div className="h-4 w-px bg-black/20" />
            )}
          </div>
        ))}
      </div>
    </motion.nav>
  );
}
