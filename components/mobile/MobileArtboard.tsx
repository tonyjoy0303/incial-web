'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface MobileArtboardProps {
  children: ReactNode;
  baseWidth?: number;
  baseHeight?: number;
}

interface ArtboardLayout {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const MobileArtboard = ({
  children,
  baseWidth = 390,
  baseHeight = 780,
}: MobileArtboardProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<ArtboardLayout>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateLayout = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const scale = Math.min(rect.width / baseWidth, rect.height / baseHeight);
      const offsetX = (rect.width - baseWidth * scale) / 2;
      const offsetY = (rect.height - baseHeight * scale) / 2;

      setLayout({ scale, offsetX, offsetY });
    };

    updateLayout();

    const observer = new ResizeObserver(() => {
      updateLayout();
    });
    observer.observe(host);

    return () => observer.disconnect();
  }, [baseWidth, baseHeight]);

  return (
    <div ref={hostRef} className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `translate(${layout.offsetX}px, ${layout.offsetY}px) scale(${layout.scale})`,
          transformOrigin: 'top left',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
