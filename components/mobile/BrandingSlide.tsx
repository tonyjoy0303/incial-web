'use client';

import { motion } from 'framer-motion';
import { MobileArtboard } from './MobileArtboard';
import { MobileSlide } from './MobileSlide';

interface BrandingSlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const BrandingSlide = ({ id, onInView }: BrandingSlideProps) => {
  const brandingTextStyle = {
    fontSize: '23px',
    lineHeight: 1,
    letterSpacing: '0.04em',
  } as const;

  const subTextStyle = {
    fontSize: '10px',
    lineHeight: 1,
    letterSpacing: '0.08em',
  } as const;

  const animatedItems = [
    { label: 'BRANDING', angle: 22, delay: 0.55 },
    { label: 'SOCIAL MEDIA MANAGEMENT', angle: 36, delay: 0.65 },
    { label: 'DIGITAL MARKETING', angle: 50, delay: 0.75 },
    { label: 'SEO & DIGITAL ADS', angle: 64, delay: 0.85 },
  ] as const;

  const INNER_CX = 95;
  const INNER_CY = 440;
  const INNER_R = 120;
  const TEXT_RADIUS = 135;
  const SUBTEXT_RADIUS = 138;

  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="relative h-full w-full overflow-hidden text-white">
        <MobileArtboard baseWidth={390} baseHeight={620}>
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 390 780"
            fill="none"
            aria-hidden="true"
          >

            <motion.circle
              cx={INNER_CX}
              cy={INNER_CY}
              r={INNER_R}
              stroke="#D8E8FF"
              strokeWidth="2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />

            <defs>
              <path 
                id="brandingHeadingPathMobile" 
                d={`M ${INNER_CX - TEXT_RADIUS} ${INNER_CY} A ${TEXT_RADIUS} ${TEXT_RADIUS} 0 1 1 ${INNER_CX + TEXT_RADIUS} ${INNER_CY} A ${TEXT_RADIUS} ${TEXT_RADIUS} 0 1 1 ${INNER_CX - TEXT_RADIUS} ${INNER_CY}`} 
              />
            </defs>

            <text className="font-bold fill-white" style={brandingTextStyle}>
              <textPath href="#brandingHeadingPathMobile" startOffset="25%" textAnchor="middle">
                Branding &amp; Marketing
              </textPath>
            </text>

            <g className="font-medium uppercase fill-[#5EA9FF]" style={{ textAnchor: 'start', dominantBaseline: 'middle' }}>
              {animatedItems.map((item) => {
                const angleRad = (item.angle * Math.PI) / 180;
                const x = INNER_CX + SUBTEXT_RADIUS * Math.cos(angleRad);
                const y = INNER_CY + SUBTEXT_RADIUS * Math.sin(angleRad);
                
                return (
                  <motion.g
                    key={item.label}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.delay, duration: 0.45 }}
                  >
                    <text
                      x={x}
                      y={y}
                      transform={`rotate(${item.angle} ${x} ${y})`}
                      style={subTextStyle}
                    >
                      {item.label}
                    </text>
                  </motion.g>
                );
              })}
            </g>
          </motion.svg>
        </MobileArtboard>
      </div>
    </MobileSlide>
  );
};