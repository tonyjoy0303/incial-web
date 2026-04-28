'use client';

import { useEffect, useState } from 'react';
import LogoScreen from '@/components/features/home/LogoScreen';

interface MobilePreloaderProps {
  onComplete: () => void;
}

export const MobilePreloader = ({ onComplete }: MobilePreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [useReducedMotion, setUseReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setUseReducedMotion(media.matches);

    syncPreference();
    media.addEventListener('change', syncPreference);
    return () => media.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, useReducedMotion ? 1200 : 3200);

    return () => clearTimeout(timer);
  }, [onComplete, useReducedMotion]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black [contain:layout_paint_style]">
      <div className="flex h-full w-full items-center justify-center px-6">
        <div className="relative aspect-square w-[min(78vw,260px)] transform-gpu will-change-transform">
          <LogoScreen skipAnimation={useReducedMotion} sizeMode="mobile" />
        </div>
      </div>
    </div>
  );
};
