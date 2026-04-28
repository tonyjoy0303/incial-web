'use client';

import { MobileSlide } from './MobileSlide';

interface ContactSlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const ContactSlide = ({ id, onInView }: ContactSlideProps) => {
  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="flex h-full w-full flex-col justify-between bg-black px-6 pb-8 pt-16 text-white">
        <section className="mx-auto w-full max-w-[304px]">
          <div className="mb-7 text-left">
            <h2 className="text-[29px] font-semibold italic leading-[1.15] tracking-[-0.04em] text-white">
              Have a question?
            </h2>
            <h2 className="text-[29px] font-semibold italic leading-[1.15] tracking-[-0.04em] text-white">
              Need a quote?
            </h2>
            <p className="mt-2 text-[12px] leading-[1.45] text-white/70">
              We promise to reply within 24 hours, every time.
            </p>
          </div>

          <form className="space-y-2.5">
            {['Full Name', 'Email', 'Phone'].map((placeholder) => (
              <div
                key={placeholder}
                className="h-[36px] rounded-full border border-white/10 bg-[#050505] px-4"
              >
                <input
                  type={placeholder === 'Email' ? 'email' : placeholder === 'Phone' ? 'tel' : 'text'}
                  placeholder={placeholder}
                  className="h-full w-full bg-transparent text-[12px] text-white outline-none placeholder:text-white/28"
                />
              </div>
            ))}

            <div className="relative min-h-[116px] rounded-[18px] border border-white/10 bg-[#050505] px-4 pb-4 pt-3.5">
              <textarea
                placeholder="Message"
                rows={4}
                className="h-[74px] w-full resize-none bg-transparent text-[12px] text-white outline-none placeholder:text-white/28"
              />

              <div className="absolute bottom-3 right-3">
                <button
                  type="submit"
                  className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-black shadow-[0_1px_10px_rgba(255,255,255,0.08)]"
                >
                  Contact
                </button>
              </div>
            </div>
          </form>
        </section>

        <footer className="flex items-end justify-between gap-4 text-white/82">
          <div className="flex flex-col text-[10px] leading-[1.2]">
            <span className="text-white/45">Location:</span>
            <span>Kanjirappally, Kerala, India</span>
          </div>

          <div className="text-[26px] font-semibold tracking-tight text-white">
            incial
          </div>
        </footer>
      </div>
    </MobileSlide>
  );
};