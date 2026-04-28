'use client';

import { MobileSlide } from './MobileSlide';

interface IntroSlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const IntroSlide = ({ id, onInView }: IntroSlideProps) => {
  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="w-full h-full flex flex-col items-start justify-center px-6 pb-32">
        {/* Main Heading */}
        <div className="space-y-0">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Services
          </h2>
          <h2 className="text-4xl italic text-white leading-tight">
            That Make
          </h2>
          <h2 className="text-4xl italic text-white leading-tight">
            Magic Happen
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-xs italic text-gray-400 mt-4">
          (And Seriously Grow Your Business)
        </p>
      </div>
    </MobileSlide>
  );
};
