import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Palette, Sparkles, Volume2 } from 'lucide-react';
import { ThemeMode } from './types';
import { PortfolioProvider } from './context/PortfolioContext';
import { SpaceCanvas } from './components/SpaceCanvas';
import { Navbar } from './components/Navbar';
import { CinematicIntro } from './components/CinematicIntro';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CodingStatsSection } from './components/CodingStatsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { scrollToElementFast } from './utils/scroll';
import { playClickSound, toggleAmbientSpaceAudio } from './utils/audio';
import { CommandPalette } from './components/CommandPalette';
import { AIChatDrawer } from './components/AIChatDrawer';
import { ResumeModal } from './components/ResumeModal';
import { AdminModal } from './components/AdminModal';

const THEME_CYCLE_ORDER: ThemeMode[] = ['deep-space', 'cyberpunk', 'solar-gold', 'minimal-dark'];

const THEME_LABELS: Record<ThemeMode, string> = {
  'deep-space': 'Deep Space Cyan',
  cyberpunk: 'Cyberpunk Neon',
  'solar-gold': 'Solar Flare Gold',
  'minimal-dark': 'Monochrome Void',
};

function PortfolioApp() {
  const [theme, setTheme] = useState<ThemeMode>('deep-space');
  const [isWarpSpeed, setIsWarpSpeed] = useState(false);

  // Quick Global HUD Toast
  const [hudNotice, setHudNotice] = useState<{ icon: any; title: string; subtitle: string; color: string } | null>(null);

  const showHudNotice = (icon: any, title: string, subtitle: string, color: string = 'text-cyan-400') => {
    setHudNotice({ icon, title, subtitle, color });
    setTimeout(() => {
      setHudNotice((curr) => (curr?.title === title ? null : curr));
    }, 2200);
  };

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleCycleTheme = () => {
    playClickSound(800);
    setTheme((prev) => {
      const currIdx = THEME_CYCLE_ORDER.indexOf(prev);
      const nextTheme = THEME_CYCLE_ORDER[(currIdx + 1) % THEME_CYCLE_ORDER.length];
      showHudNotice(Palette, `Theme: ${THEME_LABELS[nextTheme]}`, 'Pressed [T] to toggle theme', 'text-fuchsia-400');
      return nextTheme;
    });
  };

  const handleToggleWarpSpeed = () => {
    playClickSound(900);
    setIsWarpSpeed((prev) => {
      const next = !prev;
      showHudNotice(
        Zap,
        next ? '⚡ 3D Warp Speed: ENGAGED' : '🪐 Warp Speed: CRUISE MODE',
        next ? 'Accelerating starfield velocity (Press [S] to toggle)' : 'Returned to normal cosmic speed',
        next ? 'text-amber-400' : 'text-cyan-400'
      );
      return next;
    });
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('.monaco-editor'));

      // Key combinations like Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playClickSound(700);
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Shift + A for Admin Panel
      if (e.shiftKey && e.key.toLowerCase() === 'a' && !isInput) {
        e.preventDefault();
        playClickSound(700);
        setIsAdminOpen((prev) => !prev);
        return;
      }

      // If user is currently typing in an input, ignore single-character shortcuts
      if (isInput) return;

      // Single Key Global Shortcuts
      const key = e.key.toLowerCase();

      if (key === 't') {
        e.preventDefault();
        handleCycleTheme();
      } else if (key === 's' || key === 'w') {
        e.preventDefault();
        handleToggleWarpSpeed();
      } else if (key === 'a' || key === 'c') {
        e.preventDefault();
        playClickSound(700);
        setIsAIChatOpen((prev) => !prev);
      } else if (key === 'r') {
        e.preventDefault();
        playClickSound(700);
        setIsResumeOpen((prev) => !prev);
      } else if (key === 'p') {
        e.preventDefault();
        playClickSound(600);
        scrollToElementFast('projects', -70, 380);
      } else if (key === 'h') {
        e.preventDefault();
        playClickSound(600);
        scrollToElementFast('portfolio-hero', -70, 380);
      } else if (key === 'e') {
        e.preventDefault();
        playClickSound(600);
        scrollToElementFast('education', -70, 380);
      } else if (key === 'm') {
        e.preventDefault();
        toggleAmbientSpaceAudio();
      } else if (key === '/' || key === '?') {
        e.preventDefault();
        playClickSound(700);
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-x-hidden ${theme}`}>
      {/* 3D Interactive Space Canvas Background */}
      <SpaceCanvas theme={theme} warpSpeed={isWarpSpeed} />

      {/* Floating HUD Toast Notification */}
      <AnimatePresence>
        {hudNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs font-mono">
              <div className={`w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${hudNotice.color} shadow-inner`}>
                <hudNotice.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-wide">{hudNotice.title}</span>
                <span className="text-[10px] text-slate-400">{hudNotice.subtitle}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Navigation Bar */}
      <Navbar
        theme={theme}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          showHudNotice(Palette, `Theme: ${THEME_LABELS[newTheme]}`, 'Theme switched via Navbar', 'text-fuchsia-400');
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* SECTION 1 — CINEMATIC VIDEO INTRO (100vh Fullscreen First Viewport) */}
        <CinematicIntro
          onScrollToHero={() => {
            scrollToElementFast('portfolio-hero', 0, 380);
          }}
        />

        {/* SECTION 2 — EXISTING PORTFOLIO HERO */}
        <HeroSection
          id="portfolio-hero"
          onOpenResume={() => setIsResumeOpen(true)}
          onToggleWarpSpeed={handleToggleWarpSpeed}
          isWarpSpeed={isWarpSpeed}
        />
        <AboutSection
          onOpenResume={() => setIsResumeOpen(true)}
        />
        <EducationSection />
        <SkillsSection />
        <CertificationsSection />
        <ProjectsSection />
        <CodingStatsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Interactive Command Palette (Ctrl + K or /) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentTheme={theme}
        onCycleTheme={handleCycleTheme}
        onSetTheme={(newTheme) => {
          setTheme(newTheme);
          showHudNotice(Palette, `Theme: ${THEME_LABELS[newTheme]}`, 'Theme switched', 'text-fuchsia-400');
        }}
        isWarpSpeed={isWarpSpeed}
        onToggleWarpSpeed={handleToggleWarpSpeed}
      />

      {/* Gemini AI Companion Drawer */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Verified Resume Modal Viewer & Downloader */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Owner Customization Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
