import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  GraduationCap,
  Target,
  Code2,
  Compass,
  Cpu,
  MapPin,
  Mail,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound } from '../utils/audio';

interface AboutSectionProps {
  onOpenResume: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenResume }) => {
  const { data } = usePortfolio();

  const quickFacts = [
    { label: 'University', value: 'Delhi Technological University (DTU)', icon: GraduationCap, color: 'text-cyan-400' },
    { label: 'Degree & Branch', value: 'B.Tech Information Technology', icon: User, color: 'text-indigo-400' },
    { label: 'Academic Standing', value: `${data.personalInfo.cgpa} CGPA (2024-2028 Batch)`, icon: Award, color: 'text-amber-400' },
    { label: 'Primary Languages', value: 'C++, Python, HTML/CSS', icon: Code2, color: 'text-purple-400' },
    { label: 'LeetCode Milestone', value: `${data.leetcodeSolvedCount || '200+'} Problems Solved in C++`, icon: Target, color: 'text-emerald-400' },
    { label: 'Current Focus', value: 'Backend Systems, APIs, AI Apps', icon: Cpu, color: 'text-sky-400' },
  ];

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>MISSION BRIEFING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About <span className="text-cyan-400">Vedant Bhagat</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            IT Undergraduate at Delhi Technological University combining mathematical rigor, algorithm optimization, and practical software engineering.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Narrative Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden space-y-6 shadow-xl"
          >
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40">
                <Code2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Background & Journey</h3>
                <p className="text-xs text-slate-400 font-mono">DTU Roll: {PERSONAL_INFO.dtuRoll}</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                I am currently pursuing my B.Tech in Information Technology at <strong>Delhi Technological University (DTU)</strong>, maintaining a CGPA of <strong>{data.personalInfo.cgpa}</strong>. My passion lies at the intersection of algorithmic problem-solving and software architecture.
              </p>
              <p>
                Having solved <strong>{data.leetcodeSolvedCount || '200+'} Data Structures & Algorithms problems on LeetCode</strong> in C++, I have built a solid foundation in time/space complexity optimization, recursion, tree structures, and graph traversal algorithms.
              </p>
              <p>
                {data.personalInfo.bio}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Delhi Technological University, New Delhi</span>
              </div>
              <a
                href="#contact"
                onClick={() => playClickSound(750)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-lg transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Connect with Vedant</span>
              </a>
            </div>
          </motion.div>

          {/* Right Quick Facts Grid */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
              Verified Dossier Highlights
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {quickFacts.map((fact, idx) => {
                const Icon = fact.icon;
                return (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-4 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-xl backdrop-blur-md flex items-center gap-4 group transition-all"
                  >
                    <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform ${fact.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-400">{fact.label}</div>
                      <div className="text-sm font-semibold text-slate-100">{fact.value}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => {
                playClickSound(800);
                onOpenResume();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>Inspect Full Verified Resume Modal</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
