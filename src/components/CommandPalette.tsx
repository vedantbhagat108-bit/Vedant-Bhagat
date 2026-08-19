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
  Zap,
  Volume2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Keyboard,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound, toggleAmbientSpaceAudio } from '../utils/audio';
import { scrollToElementFast } from '../utils/scroll';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIChat: () => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
  currentTheme: ThemeMode;
  onCycleTheme: () => void;
  onSetTheme: (theme: ThemeMode) => void;
  isWarpSpeed: boolean;
  onToggleWarpSpeed: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenAIChat,
  onOpenResume,
  onOpenAdmin,
  currentTheme,
  onCycleTheme,
  onSetTheme,
  isWarpSpeed,
  onToggleWarpSpeed,
}) => {
  const { data } = usePortfolio();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'actions' | 'navigation' | 'themes'>('all');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allItems = [
    // Global Actions
    {
      id: 'warp',
      name: isWarpSpeed ? 'Disengage 3D Warp Speed' : 'Engage 3D Warp Speed Acceleration',
      category: 'actions',
      shortcut: 'S',
      badge: isWarpSpeed ? 'Active' : 'Speed',
      icon: Zap,
      action: () => onToggleWarpSpeed(),
    },
    {
      id: 'theme-cycle',
      name: `Cycle Color Theme (Current: ${currentTheme.replace('-', ' ')})`,
      category: 'actions',
      shortcut: 'T',
      badge: 'Theme',
      icon: Palette,
      action: () => onCycleTheme(),
    },
    {
      id: 'ai-chat',
      name: 'Ask Cosmo Gemini AI Assistant',
      category: 'actions',
      shortcut: 'A',
      badge: 'AI',
      icon: Bot,
      action: () => onOpenAIChat(),
    },
    {
      id: 'resume',
      name: 'Open & Download Verified Resume',
      category: 'actions',
      shortcut: 'R',
      badge: 'PDF',
      icon: Download,
      action: () => onOpenResume(),
    },
    {
      id: 'audio',
      name: 'Toggle Ambient Deep Space Audio',
      category: 'actions',
      shortcut: 'M',
      badge: 'Audio',
      icon: Volume2,
      action: () => toggleAmbientSpaceAudio(),
    },
    {
      id: 'admin',
      name: 'Open Portfolio Customization Control Panel',
      category: 'actions',
      shortcut: 'Shift + A',
      badge: 'Admin',
      icon: ShieldCheck,
      action: () => onOpenAdmin(),
    },

    // Themes selection
    {
      id: 'theme-deep-space',
      name: 'Theme: Deep Space (Cyan & Stellar Blue)',
      category: 'themes',
      badge: currentTheme === 'deep-space' ? 'Active' : undefined,
      icon: Sparkles,
      action: () => onSetTheme('deep-space'),
    },
    {
      id: 'theme-cyberpunk',
      name: 'Theme: Cyberpunk (Neon Purple & Pink)',
      category: 'themes',
      badge: currentTheme === 'cyberpunk' ? 'Active' : undefined,
      icon: Sparkles,
      action: () => onSetTheme('cyberpunk'),
    },
    {
      id: 'theme-solar-gold',
      name: 'Theme: Solar Flare (Amber & Golden Nebula)',
      category: 'themes',
      badge: currentTheme === 'solar-gold' ? 'Active' : undefined,
      icon: Sparkles,
      action: () => onSetTheme('solar-gold'),
    },
    {
      id: 'theme-minimal-dark',
      name: 'Theme: Monochrome Void (Slate & Silver)',
      category: 'themes',
      badge: currentTheme === 'minimal-dark' ? 'Active' : undefined,
      icon: Sparkles,
      action: () => onSetTheme('minimal-dark'),
    },

    // Navigation Items
    {
      id: 'nav-hero',
      name: 'Jump to Hero & Introduction',
      category: 'navigation',
      shortcut: 'H',
      icon: Compass,
      action: () => scrollToElementFast('portfolio-hero', -70, 380),
    },
    {
      id: 'nav-about',
      name: 'Jump to About Vedant & Academic Bio',
      category: 'navigation',
      shortcut: '1',
      icon: User,
      action: () => scrollToElementFast('about', -70, 380),
    },
    {
      id: 'nav-education',
      name: 'Jump to Education & Academic Timeline',
      category: 'navigation',
      shortcut: 'E',
      icon: GraduationCap,
      action: () => scrollToElementFast('education', -70, 380),
    },
    {
      id: 'nav-skills',
      name: 'Jump to Technical Skills & Proficiency Matrix',
      category: 'navigation',
      shortcut: '2',
      icon: Cpu,
      action: () => scrollToElementFast('skills', -70, 380),
    },
    ...(data.certifications && data.certifications.length > 0
      ? [
          {
            id: 'nav-certifications',
            name: 'Jump to Licenses & Technical Certifications',
            category: 'navigation' as const,
            shortcut: '3',
            icon: Award,
            action: () => scrollToElementFast('certifications', -70, 380),
          },
        ]
      : []),
    {
      id: 'nav-projects',
      name: 'Jump to Academic Projects (Summarizer & Game)',
      category: 'navigation',
      shortcut: 'P',
      icon: Code2,
      action: () => scrollToElementFast('projects', -70, 380),
    },
    {
      id: 'nav-coding-stats',
      name: 'Jump to LeetCode & Coding Stats (200+ Solved)',
      category: 'navigation',
      shortcut: '4',
      icon: Target,
      action: () => scrollToElementFast('coding-stats', -70, 380),
    },
    {
      id: 'nav-contact',
      name: 'Jump to Contact & Connect',
      category: 'navigation',
      shortcut: '5',
      icon: Mail,
      action: () => scrollToElementFast('contact', -70, 380),
    },

    // External Profiles
    {
      id: 'ext-leetcode',
      name: 'Visit LeetCode Profile (@Vedant1205)',
      category: 'navigation',
      icon: ExternalLink,
      action: () => window.open('https://leetcode.com/u/Vedant1205/', '_blank'),
    },
    {
      id: 'ext-github',
      name: 'Visit GitHub Repositories (@vedantbhagat108-bit)',
      category: 'navigation',
      icon: Github,
      action: () => window.open('https://github.com/vedantbhagat108-bit', '_blank'),
    },
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.shortcut && item.shortcut.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, shortcut ('S', 'T', 'A', 'P'), or section name..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-sm outline-none placeholder:text-slate-500"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              playClickSound(500);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
            <Command className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Commands' },
            { id: 'actions', label: '⚡ Cosmic Actions' },
            { id: 'navigation', label: '🧭 Navigation' },
            { id: 'themes', label: '🎨 Themes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound(600);
                setActiveCategory(cat.id as any);
              }}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-slate-500 space-y-2">
              <p>No matching commands found for &ldquo;{query}&rdquo;.</p>
              <p className="text-[11px] text-slate-600">
                Try pressing <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">T</kbd> for themes or{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">S</kbd> for warp speed.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playClickSound(650);
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-800/90 text-slate-300 hover:text-white transition-all text-xs font-mono text-left group border border-transparent hover:border-slate-700/60"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 group-hover:scale-105 transition-all shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono">
                        {item.badge}
                      </span>
                    )}
                    {item.shortcut && (
                      <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 text-[10px] font-mono font-bold shadow-inner">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Global Keyboard Shortcut Cheatsheet Footer */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Keyboard className="w-3.5 h-3.5" /> Quick Global Shortcuts:
            </span>
            <span className="text-[10px] text-slate-500">Press key anytime (outside inputs)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => {
                onToggleWarpSpeed();
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Warp Speed</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">S</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onCycleTheme();
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Toggle Theme</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">T</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenAIChat();
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Cosmo AI</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">A</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenResume();
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Resume PDF</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">R</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                scrollToElementFast('projects', -70, 380);
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Projects</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">P</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                scrollToElementFast('portfolio-hero', -70, 380);
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Hero Intro</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">H</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                toggleAmbientSpaceAudio();
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Space Audio</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">M</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
              className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-all text-left"
            >
              <span>Admin Panel</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800">⇧A</kbd>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
