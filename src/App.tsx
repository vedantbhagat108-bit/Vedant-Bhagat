import React, { useState } from 'react';
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
import { CommandPalette } from './components/CommandPalette';
import { AIChatDrawer } from './components/AIChatDrawer';
import { ResumeModal } from './components/ResumeModal';
import { AdminModal } from './components/AdminModal';

function PortfolioApp() {
  const [theme, setTheme] = useState<ThemeMode>('deep-space');
  const [isWarpSpeed, setIsWarpSpeed] = useState(false);

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className={`min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-x-hidden ${theme}`}>
      {/* 3D Interactive Space Canvas Background */}
      <SpaceCanvas theme={theme} warpSpeed={isWarpSpeed} />

      {/* Main Top Navigation Bar */}
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
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
          onToggleWarpSpeed={() => setIsWarpSpeed((w) => !w)}
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
