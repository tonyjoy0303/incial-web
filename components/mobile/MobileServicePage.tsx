'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MobileLayout } from './MobileLayout';
import { MobilePreloader } from './MobilePreloader';
import { LandingSlide } from './LandingSlide';
import { IntroSlide } from './IntroSlide';
import { BrandingSlide } from './BrandingSlide';
import { TechnologySlide } from './TechnologySlide';
import { ExperienceSlide } from './ExperienceSlide';
import { StatsSlide } from './StatsSlide';
import { ClientsSlide } from './ClientsSlide';
import { ContactSlide } from './ContactSlide';
import { MobileArtboard } from './MobileArtboard';

interface MobileServicePageProps {
  skipPreloader?: boolean;
}

export const MobileServicePage = ({ skipPreloader = false }: MobileServicePageProps) => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [activeSlide, setActiveSlide] = useState("landing");
  const shouldShowPreloader = !skipPreloader && isPreloading;

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloading(false);
  }, []);

  const slideProps = (id: string) => ({
    id,
    onInView: setActiveSlide,
  });

  if (shouldShowPreloader) {
    return <MobilePreloader onComplete={handlePreloaderComplete} />;
  }

  const backgroundLayer = (
    <div className="absolute inset-0 h-[calc(100dvh-110px)] top-[110px]">
      <MobileArtboard baseWidth={390} baseHeight={620}>
        <motion.svg viewBox="0 0 390 780" className="absolute inset-0 h-full w-full pointer-events-none">
          <motion.circle
            cx={0}
            cy={0}
            r={100}
            stroke="#D8E8FF"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ willChange: 'transform, opacity' }}
            animate={activeSlide}
            initial="landing"
            variants={{
              landing: { opacity: 0, x: 159, y: 430, scale: 3.95, transition: { duration: 0 } },
              intro: { opacity: 0, x: 159, y: 430, scale: 3.95, transition: { duration: 0 } },
              branding: { opacity: 1, x: 159, y: 430, scale: 3.95, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
              technology: { opacity: 1, x: 195, y: 76, scale: 3.14 },
              experience: { opacity: 1, x: 690, y: 390, scale: 4.00 },
              stats: { opacity: 0, x: 690, y: 390, scale: 4.00 },
              clients: { opacity: 0, x: 690, y: 390, scale: 4.00 },
              contact: { opacity: 0, x: 690, y: 390, scale: 4.00 },
            }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          />
        </motion.svg>
      </MobileArtboard>
    </div>
  );

  return (
    <>
      <MobileLayout backgroundLayer={backgroundLayer}>
        {/* Landing Slide */}
        <LandingSlide playLogoAnimation {...slideProps("landing")} />

        {/* Intro Slide */}
        <IntroSlide {...slideProps("intro")} />

        {/* Branding Slide */}
        <BrandingSlide {...slideProps("branding")} />

        {/* Technology Slide */}
        <TechnologySlide {...slideProps("technology")} />

        {/* Experience Slide */}
        <ExperienceSlide {...slideProps("experience")} />

        {/* Stats Slide */}
        <StatsSlide {...slideProps("stats")} />

        {/* Clients Slide */}
        <ClientsSlide {...slideProps("clients")} />

        {/* Contact Slide */}
        <ContactSlide {...slideProps("contact")} />
      </MobileLayout>
    </>
  );
};
