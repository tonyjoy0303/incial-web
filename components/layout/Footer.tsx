"use client";

export default function Footer() {
  return (
    <footer className="w-full py-8 text-white flex flex-col md:flex-row justify-between items-center text-sm md:text-base opacity-70">
      <div className="flex flex-col text-center md:text-left mb-4 md:mb-0 gap-3">
        <div className="flex flex-col">
          <span className="font-light italic text-gray-400">Email:</span>
          <a href="mailto:hello@incial.in" className="hover:text-blue-400 transition-colors">hello@incial.in</a>
        </div>
        <div className="flex flex-col">
          <span className="font-light italic text-gray-400">Phone:</span>
          <a href="tel:+919074549901" className="hover:text-blue-400 transition-colors">+91 90745 49901</a>
        </div>
        <div className="flex flex-col">
          <span className="font-light italic text-gray-400">Location:</span>
          <span>Kanjirappally, Kerala, India</span>
        </div>
      </div>

      <div className="text-2xl font-bold tracking-tight">incial</div>

      {/* Spacer for centering if needed, or social links again? Keeping it minimal as per design */}
      <div className="hidden md:block md:w-36 lg:w-40 xl:w-44 2xl:w-48 shrink-0"></div>
    </footer>
  );
}
