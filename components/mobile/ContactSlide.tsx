import { useState } from 'react';
import { MobileSlide } from './MobileSlide';

interface ContactSlideProps {
  id?: string;
  onInView?: (id: string) => void;
}

export const ContactSlide = ({ id, onInView }: ContactSlideProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Required: Name, Email, Message');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit');

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error occurred');
      setStatus('error');
    }
  };

  return (
    <MobileSlide id={id} onInView={onInView}>
      <div className="flex h-full w-full flex-col justify-between bg-black px-6 pb-8 pt-16 text-white overflow-y-auto">
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

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="h-[36px] rounded-full border border-white/10 bg-[#050505] px-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="h-full w-full bg-transparent text-[12px] text-white outline-none placeholder:text-white/28"
              />
            </div>
            <div className="h-[36px] rounded-full border border-white/10 bg-[#050505] px-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="h-full w-full bg-transparent text-[12px] text-white outline-none placeholder:text-white/28"
              />
            </div>
            <div className="h-[36px] rounded-full border border-white/10 bg-[#050505] px-4">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="h-full w-full bg-transparent text-[12px] text-white outline-none placeholder:text-white/28"
              />
            </div>

            <div className="relative min-h-[116px] rounded-[18px] border border-white/10 bg-[#050505] px-4 pb-4 pt-3.5">
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="h-[74px] w-full resize-none bg-transparent text-[12px] text-white outline-none placeholder:text-white/28"
              />

              <div className="flex items-center justify-between mt-1">
                <div className="flex-1">
                  {status === 'success' && <p className="text-green-400 text-[10px]">Message sent!</p>}
                  {status === 'error' && <p className="text-red-500 text-[10px] truncate pr-2">{errorMessage}</p>}
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="rounded-full bg-white px-5 py-1.5 text-[12px] font-semibold text-black shadow-[0_1px_10px_rgba(255,255,255,0.08)] disabled:opacity-50"
                >
                  {status === 'loading' ? '...' : 'Contact'}
                </button>
              </div>
            </div>
          </form>
        </section>

        <footer className="flex items-end justify-between gap-4 mt-8">
          <div className="flex flex-col text-[10px] gap-2 text-white/80">
            <div className="flex flex-col leading-[1.2]">
              <span className="text-white/45">Email:</span>
              <a href="mailto:hello@incial.in" className="hover:text-blue-400 transition-colors">hello@incial.in</a>
            </div>
            <div className="flex flex-col leading-[1.2]">
              <span className="text-white/45">Phone:</span>
              <a href="tel:+919074549901" className="hover:text-blue-400 transition-colors">+91 90745 49901</a>
            </div>
            <div className="flex flex-col leading-[1.2]">
              <span className="text-white/45">Location:</span>
              <span>Kanjirappally, Kerala, India</span>
            </div>
          </div>

          <div className="text-[26px] font-semibold tracking-tight text-white pb-2">
            incial
          </div>
        </footer>
      </div>
    </MobileSlide>
  );
};