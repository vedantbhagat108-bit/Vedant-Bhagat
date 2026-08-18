import React from 'react';
import { Rocket, Heart, Code2, ArrowUp, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound } from '../utils/audio';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { isAdminLoggedIn } = usePortfolio();

  const scrollToTop = () => {
    playClickSound(800);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-200 font-bold text-sm">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>VEDANT RAJU BHAGAT</span>
          </div>
          <p className="text-slate-500">
            Delhi Technological University (DTU) • Information Technology &apos;28
          </p>
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} Vedant Bhagat. Crafted with React, Tailwind CSS, & Framer Motion.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
          {onOpenAdmin && (
            <button
              onClick={() => {
                playClickSound(800);
                onOpenAdmin();
              }}
              className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 flex items-center gap-1.5 transition-all"
              title="Owner Customization Panel"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span>{isAdminLoggedIn ? 'Owner Admin' : 'Owner Customization'}</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all group"
            title="Launch Back to Top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
