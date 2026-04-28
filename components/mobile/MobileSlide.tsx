'use client';

import { useEffect, useRef } from 'react';

interface MobileSlideProps {
  children: React.ReactNode;
  id?: string;
  onInView?: (id: string) => void;
}

export const MobileSlide = ({ children, id, onInView }: MobileSlideProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onInView || !ref.current || !id) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onInView(id);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id, onInView]);

  return (
    <div 
      ref={ref} 
      id={id} 
      className="w-full h-[calc(100dvh-110px)] shrink-0 snap-start snap-always flex items-center justify-center"
    >
      {children}
    </div>
  );
};
