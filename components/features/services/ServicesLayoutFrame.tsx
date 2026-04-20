import type { ReactNode } from "react";

interface ServicesLayoutFrameProps {
  children: ReactNode;
  className?: string;
}

export default function ServicesLayoutFrame({
  children,
  className = "",
}: ServicesLayoutFrameProps) {
  return (
    <div
      className={`relative mx-auto box-border h-full w-full max-w-[100rem] px-4 md:px-8 lg:px-12 2xl:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
