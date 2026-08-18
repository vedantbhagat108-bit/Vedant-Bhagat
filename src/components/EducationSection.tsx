import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { EDUCATION_DATA } from '../data/portfolioData';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>ACADEMIC TRAJECTORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Education <span className="text-purple-400">& Timeline</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Academic achievements from top secondary schools to Delhi Technological University.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Center Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-600 -translate-x-1/2 opacity-30" />

          <div className="space-y-12">
            {EDUCATION_DATA.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={item.degree}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Center Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-20 my-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  {/* Content Card */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8 w-full">
                    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4 group transition-all">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950 text-cyan-400 text-xs font-mono border border-slate-800 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {item.period}
                        </span>
                        <div className="px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 font-bold text-xs border border-cyan-500/40 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.scoreType}: {item.score}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.degree}
                        </h3>
                        <p className="text-sm font-medium text-slate-300 flex items-center gap-1.5 mt-1">
                          <span>{item.institution}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            {item.location}
                          </span>
                        </p>
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-slate-800/60">
                        {item.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-xs text-slate-400 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
