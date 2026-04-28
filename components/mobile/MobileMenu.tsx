'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { navLinks } from '@/lib/constants';
import type { SectionConfig } from '@/lib/dataLoader';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [enabledSections, setEnabledSections] = useState<string[] | null>(null);

  useEffect(() => {
    fetch('/api/admin/sections')
      .then((res) => res.json())
      .then((data: { sections: SectionConfig[] }) => {
        const enabled = data.sections.filter((s) => s.enabled).map((s) => s.id);
        setEnabledSections(enabled);
      })
      .catch(() => {
        setEnabledSections([]);
      });
  }, []);

  const visibleLinks = navLinks.filter((link) => {
    if (!enabledSections || !link.sectionId) return true;
    return enabledSections.includes(link.sectionId);
  });

  return (
    <>
      {/* Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white z-50 transform transition-transform duration-400 ease-in-out flex flex-col items-center justify-center ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu items */}
        <nav className="w-full px-6 flex flex-col items-center">
          <ul className="w-full flex flex-col items-center max-w-[240px]">
            {visibleLinks.map((link, index) => (
              <li key={link.label} className="w-full flex flex-col items-center">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-black text-[18px] font-medium py-[18px] hover:text-gray-600 transition-colors block text-center"
                >
                  {link.label}
                </Link>
                {index < visibleLinks.length - 1 && (
                  <div className="w-full h-[1px] bg-black/10" />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="mt-8 flex items-center justify-center w-[32px] h-[32px] rounded-full border-[1.5px] border-black hover:bg-black/5 transition-all duration-300"
          aria-label="Go back"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </>
  );
};
