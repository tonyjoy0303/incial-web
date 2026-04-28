'use client';

import LogoScreen from '@/components/features/home/LogoScreen';
import { MobileSlide } from './MobileSlide';

interface LandingSlideProps {
  onNavigate?: (section: string) => void;
  playLogoAnimation?: boolean;
  id?: string;
  onInView?: (id: string) => void;
}

export const LandingSlide = ({ onNavigate, playLogoAnimation = false, id, onInView }: LandingSlideProps) => {
  const handleCTA = (action: string) => {
    if (onNavigate) {
      onNavigate(action);
    }
    // Add scroll navigation logic here if needed
  };

  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="w-full h-full flex flex-col items-center justify-between px-6 pb-8 pt-8">
        {/* Logo */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative aspect-square w-[min(90vw,340px)]">
            <LogoScreen
              key={playLogoAnimation ? 'logo-animate' : 'logo-static'}
              skipAnimation={!playLogoAnimation}
              sizeMode="mobile"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-[96%] max-w-[370px] mb-[45px] flex flex-col items-center">
          {/* Divider */}
          <div className="h-[1px] w-full bg-white/40" />

          {/* CTA Buttons */}
          <div className="flex w-full items-center justify-between pt-6">
            <button
              onClick={() => handleCTA('about')}
              className="rounded-full border border-white/80 px-[24px] py-[11px] text-[12px] font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              About Us
            </button>
            <a
              href="/pdf/Brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/80 px-[24px] py-[11px] text-[12px] font-medium text-white transition-colors hover:bg-white hover:text-black inline-block text-center"
            >
              Our Works
            </a>
            <button
              onClick={() => handleCTA('products')}
              className="rounded-full border border-white/80 px-[24px] py-[11px] text-[12px] font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              Our Products
            </button>
          </div>
        </div>
      </div>
    </MobileSlide>
  );
};
