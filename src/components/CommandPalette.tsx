import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Command,
  Search,
  X,
  User,
  GraduationCap,
  Cpu,
  Award,
  Code2,
  Target,
  Mail,
  Bot,
  Download,
  Github,
  Palette,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound } from '../utils/audio';
import { scrollToElementFast } from '../utils/scroll';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIChat: () => void;
  onOpenResume: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenAIChat,
  onOpenResume,
}) => {
  const { data } = usePortfolio();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        playClickSound(700);
        if (isOpen) onClose();
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        playClickSound(700);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { name: 'Jump to About Section', icon: User, action: () => scrollToElementFast('about', -70, 380) },
    { name: 'Jump to Education & Timeline', icon: GraduationCap, action: () => scrollToElementFast('education', -70, 380) },
    { name: 'Jump to Technical Skills', icon: Cpu, action: () => scrollToElementFast('skills', -70, 380) },
    ...(data.certifications && data.certifications.length > 0
      ? [{ name: 'Jump to Licenses & Certifications', icon: Award, action: () => scrollToElementFast('certifications', -70, 380) }]
      : []),
    { name: 'Jump to Academic Projects', icon: Code2, action: () => scrollToElementFast('projects', -70, 380) },
    { name: 'Jump to LeetCode & Coding Stats', icon: Target, action: () => scrollToElementFast('coding-stats', -70, 380) },
    { name: 'Jump to Contact Section', icon: Mail, action: () => scrollToElementFast('contact', -70, 380) },
    { name: 'Ask Cosmo AI Assistant', icon: Bot, action: onOpenAIChat },
    { name: 'View & Print Resume', icon: Download, action: onOpenResume },
    { name: 'Visit LeetCode Profile (200+ Solved)', icon: Target, action: () => window.open('https://leetcode.com/u/Vedant1205/', '_blank') },
    { name: 'Visit GitHub Repositories', icon: Github, action: () => window.open('https://github.com/vedantbhagat108-bit', '_blank') },
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-sm outline-none placeholder:text-slate-500"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center font-mono text-xs text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    playClickSound(650);
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-mono text-left group"
                >
                  <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-2.5 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between px-4">
          <span>Navigate with mouse or click</span>
          <span>ESC to close</span>
        </div>
      </motion.div>
    </div>
  );
};
