'use client';

import { motion } from 'framer-motion';
import { MobileArtboard } from './MobileArtboard';
import { MobileSlide } from './MobileSlide';

const technologyItems = [
  'Website Building & Design (UI/UX)',
  'VFX & CGI',
  'Product Design',
];

interface TechnologySlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const TechnologySlide = ({ id, onInView }: TechnologySlideProps) => {
  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="relative h-full w-full overflow-hidden">
        <MobileArtboard baseWidth={390} baseHeight={620}>
          <div className="relative h-full w-full text-white">
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 390 780"
            fill="none"
            aria-hidden="true"
          >

            <defs>
              <path id="techCurveMobile" d="M 195 -223 A 299 299 0 0 0 195 375 A 299 299 0 0 0 195 -223" />
            </defs>

            <motion.text
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              fill="white"
              fontSize="24"
              fontWeight="700"
              letterSpacing="2"
            >
              <textPath href="#techCurveMobile" startOffset="50%" textAnchor="middle">
                Technology
              </textPath>
            </motion.text>
          </motion.svg>

          <div className="absolute top-[450px] w-full flex flex-col items-center">
            <div className="flex flex-col items-center text-[#58A9FF] -rotate-[12deg]">
              {technologyItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 + index * 0.12, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                  className={index === 0 ? 'text-[10.5px] font-medium uppercase tracking-[0.14em]' : 'mt-5 text-[10.5px] font-medium uppercase tracking-[0.14em]'}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
          </div>
        </MobileArtboard>
        </div>
    </MobileSlide>
  );
};