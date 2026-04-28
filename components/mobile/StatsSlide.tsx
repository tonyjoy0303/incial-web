'use client';

import { MobileSlide } from './MobileSlide';

const stats = [
  { value: '50+', label: 'Happy Clients' },
  { value: '10+', label: 'Projects Completed' },
];

interface StatsSlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const StatsSlide = ({ id, onInView }: StatsSlideProps) => {
  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="flex h-full w-full flex-col items-center justify-center bg-black px-6 pb-32 text-white">
        <h2 className="mb-20 text-[28px] font-light tracking-[-0.02em] text-white">
          <span className="italic">Why Trust </span>
          <span className="font-semibold text-[#56A6FF]">Incial?</span>
        </h2>

        <div className="flex flex-col items-center text-center">
          {/* Happy Clients - Stays in place */}
          <div className="flex flex-col items-center leading-none">
            <div className="text-[30px] font-semibold italic leading-none text-[#56A6FF]">
              50+
            </div>
            <div className="mt-1 text-[13px] font-normal leading-none text-white/90">
              Happy Clients
            </div>
          </div>

          {/* Projects Completed - Moves downwards */}
          <div className="mt-16 flex flex-col items-center leading-none">
            <div className="text-[30px] font-semibold italic leading-none text-[#56A6FF]">
              10+
            </div>
            <div className="mt-1 text-[13px] font-normal leading-none text-white/90">
              Projects Completed
            </div>
          </div>
        </div>
      </div>
    </MobileSlide>
  );
};