"use client";

export default function Footer() {
  return (
    <footer className="w-full py-8 text-white flex flex-col md:flex-row justify-between items-center text-sm md:text-base opacity-70">
      <div className="flex flex-col text-center md:text-left mb-4 md:mb-0">
        <span className="font-light italic text-gray-400">Location:</span>
        <span>Kanjirappally, Kerala, India</span>
      </div>

      <div className="text-2xl font-bold tracking-tight">incial</div>

      {/* Spacer for centering if needed, or social links again? Keeping it minimal as per design */}
      <div className="hidden md:block md:w-36 lg:w-40 xl:w-44 2xl:w-48 shrink-0"></div>
    </footer>
  );
}
