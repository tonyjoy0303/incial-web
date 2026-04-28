'use client';

import { useState, ReactNode } from 'react';
import { MobileMenu } from './MobileMenu';

interface MobileLayoutProps {
  children: ReactNode;
  backgroundLayer?: ReactNode;
}

export const MobileLayout = ({ children, backgroundLayer }: MobileLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-[60] h-[110px] pt-[45px] pb-2 transition-colors duration-300 flex items-center justify-between px-6 ${menuOpen ? 'bg-white' : 'bg-black/95 backdrop-blur-sm'}`}>
        <div className={`text-[15.5px] leading-none tracking-[-0.02em] transition-colors duration-300 ${menuOpen ? 'text-black' : 'text-white'}`}>
          <span className="font-normal">We Are </span>
          <span className="font-extrabold">incial.</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex h-[38px] w-[38px] items-center justify-center rounded-full border transition-colors duration-300 focus:outline-none ${menuOpen ? 'border-black/20 text-black' : 'border-white/90 text-white'}`}
          aria-label="Toggle menu"
        >
          <span className="relative block h-3.5 w-3.5">
            <span className={`absolute left-0 top-0.5 h-[1.2px] w-3.5 transition-colors duration-300 ${menuOpen ? 'bg-black' : 'bg-white/90'}`} />
            <span className={`absolute left-0 top-[6px] h-[1.2px] w-3.5 transition-colors duration-300 ${menuOpen ? 'bg-black' : 'bg-white/90'}`} />
            <span className={`absolute left-0 top-[11px] h-[1.2px] w-3.5 transition-colors duration-300 ${menuOpen ? 'bg-black' : 'bg-white/90'}`} />
          </span>
        </button>
      </header>

      {/* Menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Background Layer */}
      {backgroundLayer && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {backgroundLayer}
        </div>
      )}

      {/* Scroll Snap Container */}
      <div className="relative z-10 mt-[110px] h-[calc(100dvh-110px)] w-full overflow-y-scroll snap-y snap-mandatory">
        {/* Remove scrollbar styling */}
        <style>{`
          .snap-y::-webkit-scrollbar {
            display: none;
          }
          .snap-y {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {children}
      </div>
    </div>
  );
};
