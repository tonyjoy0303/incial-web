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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-2xl"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Menu items */}
        <nav className="pt-20 px-6">
          <ul className="space-y-6">
            {visibleLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-white text-lg font-medium hover:text-gray-300 transition-colors block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
