import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Command,
  Volume2,
  VolumeX,
  Palette,
  Bot,
  Menu,
  X,
  Code2,
  Check,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound, toggleAmbientSpaceAudio, isAudioPlaying } from '../utils/audio';
import { scrollToElementFast } from '../utils/scroll';

interface NavbarProps {
  theme: ThemeMode;
  onThemeChange: (newTheme: ThemeMode) => void;
  onOpenCommandPalette: () => void;
  onOpenAIChat: () => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  onOpenCommandPalette,
  onOpenAIChat,
  onOpenResume,
  onOpenAdmin,
}) => {
  const { data, isAdminLoggedIn } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Sync ambient sound active state
    const handleAudioEvent = (e: any) => {
      if (e.detail && typeof e.detail.isPlaying === 'boolean') {
        setIsAudioOn(e.detail.isPlaying);
      } else {
        setIsAudioOn(isAudioPlaying());
      }
    };
    window.addEventListener('portfolio-ambient-audio-changed', handleAudioEvent);
    setIsAudioOn(isAudioPlaying());

    // Live Clock IST
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('portfolio-ambient-audio-changed', handleAudioEvent);
      clearInterval(timer);
    };
  }, []);

  const handleSoundToggle = () => {
    playClickSound(800, 0.04);
    const active = toggleAmbientSpaceAudio();
    setIsAudioOn(active);
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    playClickSound(650, 0.03);
    const targetId = href.replace('#', '');
    if (targetId) {
      scrollToElementFast(targetId, -70, 380);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Skills', href: '#skills' },
    ...(data.certifications && data.certifications.length > 0
      ? [{ name: 'Certifications', href: '#certifications' }]
      : []),
    { name: 'Projects', href: '#projects' },
    { name: 'Coding Stats', href: '#coding-stats' },
    { name: 'Contact', href: '#contact' },
  ];

  const themeOptions: { id: ThemeMode; label: string; color: string }[] = [
    { id: 'deep-space', label: 'Deep Space', color: 'bg-cyan-500' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', color: 'bg-fuchsia-500' },
    { id: 'solar-gold', label: 'Solar Gold', color: 'bg-amber-500' },
    { id: 'minimal-dark', label: 'Obsidian Dark', color: 'bg-slate-400' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 shadow-lg shadow-cyan-950/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            playClickSound(500);
            window.dispatchEvent(new CustomEvent('portfolio-scroll-to-intro'));
          }}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              VEDANT BHAGAT
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </span>
            <span className="text-xs text-slate-400 font-mono block -mt-0.5">
              DTU IT &apos;28 • {currentTime}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800/80 text-sm shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3 py-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-full transition-all text-xs font-medium tracking-wide whitespace-nowrap shrink-0"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              playClickSound(700);
              onOpenCommandPalette();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-all shadow-sm group"
            title="Open Command Palette (Ctrl + K)"
          >
            <Command className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="hidden xl:inline">Search / Commands</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-950 rounded border border-slate-700 text-slate-300">
              Ctrl+K
            </kbd>
          </button>

          {/* AI Chatbot Launcher */}
          <button
            onClick={() => {
              playClickSound(800);
              onOpenAIChat();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 rounded-lg text-xs font-medium text-cyan-300 transition-all shadow-lg shadow-cyan-950/40"
            title="Ask Cosmo AI Assistant"
          >
            <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Ask AI</span>
          </button>

          {/* Resume Modal Trigger */}
          <button
            onClick={() => {
              playClickSound(850);
              onOpenResume();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-medium text-slate-200 transition-all"
            title="View & Download Resume"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Resume</span>
          </button>

          {/* Owner Customization Admin Panel Launcher */}
          <button
            onClick={() => {
              playClickSound(900);
              onOpenAdmin();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shadow-sm ${
              isAdminLoggedIn
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shadow-emerald-900/30'
                : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300'
            }`}
            title="Owner Customization Panel (Google Account Authorized)"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'}`} />
            <span>{isAdminLoggedIn ? 'Owner Admin' : 'Customize'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-lg border transition-all ${
              isAudioOn
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isAudioOn ? 'Mute Space Ambient Sound' : 'Play Space Ambient Sound'}
          >
            {isAudioOn ? (
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                playClickSound(600);
                setThemeDropdownOpen(!themeDropdownOpen);
              }}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-slate-300 transition-all"
              title="Change Theme"
            >
              <Palette className="w-4 h-4 text-amber-400" />
            </button>

            <AnimatePresence>
              {themeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl"
                >
                  <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Select Cosmic Theme
                  </div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        playClickSound(700);
                        onThemeChange(opt.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        theme === opt.id
                          ? 'bg-slate-800 text-white font-medium'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                        <span>{opt.label}</span>
                      </div>
                      {theme === opt.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            playClickSound(600);
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden p-2 text-slate-300 bg-slate-900 border border-slate-800 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-3 backdrop-blur-xl"
          >
            <div className="pb-2 border-b border-slate-800">
              <button
                onClick={() => {
                  onOpenAIChat();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-xs font-medium text-cyan-300"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Ask Cosmo AI</span>
              </button>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setMobileMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-900 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenResume();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-200"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Resume</span>
              </button>
              <button
                onClick={handleSoundToggle}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-200"
              >
                {isAudioOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isAudioOn ? 'Mute Sound' : 'Ambient Sound'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
