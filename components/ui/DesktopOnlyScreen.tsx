import React from "react";
import { Monitor } from "lucide-react";

export default function DesktopOnlyScreen() {
  return (
    <div className="mobile-experience-screen fixed inset-0 z-9999 h-dvh w-full flex-col items-center justify-center bg-black text-white p-6 text-center">
      <div className="flex flex-col items-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
          <Monitor className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-3 tracking-tight">
          Desktop Experience Required
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Please open this on desktop or computer for the full Incial
          experience. Our immersive portfolio is optimized for larger screens.
        </p>
      </div>
    </div>
  );
}
