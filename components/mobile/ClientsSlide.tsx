'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileSlide } from './MobileSlide';

interface Client {
  id: string;
  name: string;
  src: string;
}

interface ClientsData {
  headerText: string;
  clients: Client[];
}

const INITIAL_COUNT = 14;

interface ClientsSlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const ClientsSlide = ({ id, onInView }: ClientsSlideProps) => {
  const [data, setData] = useState<ClientsData | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/admin/clients')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const clients = data?.clients || [];
  const visibleClients = showAll ? clients : clients.slice(0, INITIAL_COUNT);

  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="h-full w-full overflow-y-auto bg-black px-6 pb-16 pt-6 text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-4 text-center text-[14px] font-normal italic text-white/85">
          {data?.headerText || 'Some of Our Awesome Clients:'}
        </div>

        <div className="relative mx-auto w-full max-w-[286px]">
          <div className="grid grid-cols-2 gap-1.5">
            <AnimatePresence>
              {visibleClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.92,
                    transition: {
                      duration: 0.2,
                      delay: index < INITIAL_COUNT ? 0 : (clients.length - 1 - index) * 0.03,
                      ease: [0.22, 1, 0.36, 1],
                    }
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index < INITIAL_COUNT ? 0 : (index - INITIAL_COUNT) * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex h-[58px] items-center justify-center overflow-hidden rounded-[4px] bg-white px-2"
                >
                  <img
                    src={client.src}
                    alt={client.name}
                    className="w-auto max-h-[30px] object-contain"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {clients.length > INITIAL_COUNT && (
            <button
              className="absolute left-1/2 bottom-0 z-10 -translate-x-1/2 translate-y-1/2 rounded-full bg-white px-4 py-1.5 text-[10px] font-medium text-black shadow-[0_1px_8px_rgba(0,0,0,0.22)] active:scale-95 transition-all flex items-center gap-1.5"
              type="button"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  View Less
                  <svg 
                    width="10" 
                    height="6" 
                    viewBox="0 0 10 6" 
                    fill="none" 
                    className="rotate-0 transition-transform duration-300"
                  >
                    <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              ) : (
                <>
                  View All
                  <svg 
                    width="10" 
                    height="6" 
                    viewBox="0 0 10 6" 
                    fill="none" 
                    className="rotate-180 transition-transform duration-300"
                  >
                    <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </MobileSlide>
  );
};