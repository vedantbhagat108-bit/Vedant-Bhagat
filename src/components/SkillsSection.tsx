import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Terminal,
  Layout,
  GitBranch,
  Cpu,
  Layers,
  Sparkles,
  Binary,
  Box,
  Brain,
  Server,
  Network,
  Database,
  Globe,
  Flame,
  Shield,
  Zap,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound } from '../utils/audio';

export const SkillsSection: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2;
      case 'Terminal':
        return Terminal;
      case 'Layout':
        return Layout;
      case 'GitBranch':
        return GitBranch;
      case 'Cpu':
        return Cpu;
      case 'Layers':
        return Layers;
      case 'Sparkles':
        return Sparkles;
      case 'Binary':
        return Binary;
      case 'Box':
        return Box;
      case 'Brain':
        return Brain;
      case 'Server':
        return Server;
      case 'Network':
        return Network;
      case 'Database':
        return Database;
      case 'Globe':
        return Globe;
      case 'Flame':
        return Flame;
      case 'Shield':
        return Shield;
      case 'Zap':
        return Zap;
      default:
        return Code2;
    }
  };

  const skillCategories = data.skillCategories || [];
  const categories = ['All', ...skillCategories.map((c) => c.title)];

  const filteredCategories =
    selectedCategory === 'All'
      ? skillCategories
      : skillCategories.filter((c) => c.title === selectedCategory);

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>TECHNICAL ARSENAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Skills & <span className="text-cyan-400">Competencies</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Verified technical stack across programming languages, developer tools, algorithms, and backend systems.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClickSound(650);
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6 shadow-xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-lg text-white tracking-wide">{cat.title}</h3>
                <span className="text-xs font-mono px-2.5 py-1 bg-slate-950 border border-slate-800 text-cyan-400 rounded-md">
                  {cat.skills.length} Items
                </span>
              </div>

              <div className="space-y-4">
                {cat.skills.map((skill) => {
                  const Icon = getIcon(skill.iconName);
                  return (
                    <div key={skill.name} className="space-y-1.5 group">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 text-slate-200 group-hover:text-cyan-300 transition-colors">
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-sm">{skill.name}</span>
                        </div>
                        <span className="text-slate-400">{skill.level}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"
                        />
                      </div>

                      <p className="text-[11px] text-slate-400 font-sans pl-6">
                        {skill.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
