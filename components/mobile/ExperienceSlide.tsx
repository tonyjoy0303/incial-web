'use client';

import { motion } from 'framer-motion';
import { MobileArtboard } from './MobileArtboard';
import { MobileSlide } from './MobileSlide';

const experienceItems = [
  'Creative Design',
  'Social Media Management',
  'Public Relations',
];

interface ExperienceSlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const ExperienceSlide = ({ id, onInView }: ExperienceSlideProps) => {
  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="relative h-full w-full overflow-hidden">
        <MobileArtboard baseWidth={390} baseHeight={620}>
          <div className="relative h-full w-full text-white">

          {/* Title - "Experience Design" positioned center-right */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="absolute text-white font-semibold leading-[0.95]"
            style={{
              left: '62px',
              top: '290px',
              fontSize: '36px',
              letterSpacing: '-0.01em',
            }}
          >
            Experience
            <br />
            Design
          </motion.h2>

          {/* Service items - left side, blue text */}
          <div
            className="absolute flex flex-col text-[#4FA0FF] font-medium"
            style={{
              left: '52px',
              top: '480px',
              fontSize: '12px',
              letterSpacing: '0.02em',
            }}
          >
            {experienceItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.4 + index * 0.12,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ marginTop: index === 0 ? 0 : '20px' }}
              >
                {item}
              </motion.div>
            ))}
          </div>
          </div>
        </MobileArtboard>
        </div>
    </MobileSlide>
  );
};