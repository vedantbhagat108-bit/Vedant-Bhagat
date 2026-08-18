import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Download,
  Award,
  Code2,
  Zap,
  Rocket,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound, startAmbientSpaceAudio } from '../utils/audio';

interface HeroSectionProps {
  id?: string;
  onOpenResume: () => void;
  onToggleWarpSpeed: () => void;
  isWarpSpeed: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  id = 'portfolio-hero',
  onOpenResume,
  onToggleWarpSpeed,
  isWarpSpeed,
}) => {
  const { data } = usePortfolio();
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    `IT Undergraduate @ DTU (CGPA ${data.personalInfo.cgpa})`,
    `${data.leetcodeSolvedCount || '200+'} LeetCode Solved in C++`,
    'AI & YouTube Transcript Summarizer',
    '2D Pygame Engine & Game Developer',
    'Backend Systems & REST APIs Enthusiast',
  ];

  // Auto-start ambient sound when Hero section is reached
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAmbientSpaceAudio();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 30 : 70;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentPhrase.substring(0, typedText.length + 1));
        if (typedText === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setTypedText(currentPhrase.substring(0, typedText.length - 1));
        if (typedText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex]);

  return (
    <section
      id={id}
      className="relative min-h-screen py-24 sm:py-32 flex items-center justify-center overflow-hidden z-10 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* MAIN PROFILE & HERO CONTENT (Section 2 — Pristine Portfolio Hero) */}
        <div
          id="hero-profile-content"
          className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Main Hero Text (Left Col) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Cosmic Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-mono shadow-lg shadow-indigo-950/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Delhi Technological University • IT &apos;28 • Roll: 2K24/IT/188</span>
            </motion.div>

            {/* Name Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hello, I&apos;m{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                  Vedant Bhagat
                </span>
              </h1>
              <div className="text-lg sm:text-xl font-mono text-cyan-300/90 h-8 flex items-center gap-1">
                <span>{typedText}</span>
                <span className="w-2 h-5 bg-cyan-400 animate-pulse" />
              </div>
            </motion.div>

            {/* Summary Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed"
            >
              {PERSONAL_INFO.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <a
                href="#projects"
                onClick={() => playClickSound(700)}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-medium text-sm shadow-xl shadow-cyan-950/50 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => {
                  playClickSound(750);
                  onOpenResume();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm transition-all hover:border-cyan-500/50"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={() => {
                  playClickSound(900);
                  onToggleWarpSpeed();
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                  isWarpSpeed
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Warp Speed Hyperdrive"
              >
                <Rocket className={`w-4 h-4 ${isWarpSpeed ? 'animate-bounce text-amber-400' : ''}`} />
                <span>{isWarpSpeed ? 'WARP ACTIVE' : 'HYPERDRIVE'}</span>
              </button>
            </motion.div>
          </div>

          {/* Key Metric Cards (Right Col) */}
          <div className="lg:col-span-5 space-y-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-4 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl backdrop-blur-md transition-all shadow-lg shadow-cyan-950/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{data.personalInfo.cgpa} CGPA</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">DTU</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Information Technology Department</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="p-4 bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl backdrop-blur-md transition-all shadow-lg shadow-purple-950/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{data.leetcodeSolvedCount || '200+'} Solved</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">LeetCode</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">C++ Data Structures &amp; Algorithms</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-4 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl backdrop-blur-md transition-all shadow-lg shadow-amber-950/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <span>AI &amp; Game Engineering</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">Projects</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Gemini AI, Streamlit, Pygame 2D Engine</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
