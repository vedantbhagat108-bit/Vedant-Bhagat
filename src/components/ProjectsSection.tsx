import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  ExternalLink,
  Sparkles,
  Gamepad2,
  Code2,
  Play,
  X,
  CheckCircle2,
  ListVideo,
  Bot,
  Terminal,
  Volume2,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { playClickSound } from '../utils/audio';

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const [activeDemoProject, setActiveDemoProject] = useState<Project | null>(null);

  // Summarizer Simulator State
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=k1D8gW_x_AI');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  // Jumper Game Simulator State
  const [gameScore, setGameScore] = useState(0);
  const [gamePlaying, setGamePlaying] = useState(false);

  const handleRunSummarizerDemo = () => {
    if (!youtubeUrl) return;
    playClickSound(700);
    setIsSummarizing(true);
    setSummaryResult(null);

    setTimeout(() => {
      setIsSummarizing(false);
      setSummaryResult(`
📌 **Key Video Highlights & Summary**:
1. **Introduction to System Architecture**: Overview of modern backend service designs and RESTful API contracts.
2. **Algorithmic Efficiency**: Analyzing runtime complexity from O(N^2) down to O(N log N) using memoization and dynamic programming.
3. **AI Integration**: Harnessing LLM models (Google Gemini API) to automate transcript extraction and automated categorization.
4. **Conclusion**: Best practices for scalable software engineering and production error handling.
      `);
    }, 1200);
  };

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>FEATURED WORK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Academic <span className="text-cyan-400">Projects</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Hands-on projects built with Python, Gemini AI, Streamlit, and Pygame. Includes interactive live engine preview demos.
          </p>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group transition-all"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5">
                    {project.demoType === 'summarizer' ? (
                      <ListVideo className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {project.category}
                  </span>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playClickSound(600)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono transition-all hover:text-white"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Repo</span>
                  </a>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400/90 mt-1">{project.subtitle}</p>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Description Bullets */}
                <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                  {project.description.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    playClickSound(800);
                    setActiveDemoProject(project);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 rounded-xl text-xs font-mono font-medium text-cyan-200 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/40"
                >
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  <span>Launch Interactive Live Demo Preview</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Project Demo Modal */}
      <AnimatePresence>
        {activeDemoProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{activeDemoProject.title}</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400">Interactive Preview Sandbox</p>
                </div>
                <button
                  onClick={() => {
                    playClickSound(500);
                    setActiveDemoProject(null);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DEMO CONTENT: SUMMARIZER */}
              {activeDemoProject.demoType === 'summarizer' && (
                <div className="space-y-4 text-left">
                  <p className="text-xs text-slate-300">
                    Paste a YouTube Video URL to test how Gemini API + Streamlit generates an automated transcript summary:
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 outline-none"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <button
                      onClick={handleRunSummarizerDemo}
                      disabled={isSummarizing}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isSummarizing ? (
                        <>
                          <Bot className="w-4 h-4 animate-spin" />
                          <span>Summarizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Summarize</span>
                        </>
                      )}
                    </button>
                  </div>

                  {summaryResult && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 space-y-2 whitespace-pre-wrap animate-fadeIn">
                      <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 flex items-center gap-1.5">
                        <Bot className="w-4 h-4" />
                        <span>Gemini AI Output</span>
                      </div>
                      {summaryResult}
                    </div>
                  )}
                </div>
              )}

              {/* DEMO CONTENT: JUMPER PYGAME */}
              {activeDemoProject.demoType === 'game' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-300">
                    2D Pygame Arcade Engine Sandbox. Jump over obstacles and collect coins!
                  </p>

                  <div className="relative w-full h-48 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center font-mono text-xs text-slate-400">
                      <span>LIVES: ❤️❤️❤️</span>
                      <span className="text-amber-400 font-bold">COINS: {gameScore}</span>
                      <span>STAGE 1-1</span>
                    </div>

                    <div className="flex items-center justify-center space-x-12 my-auto">
                      {/* Player Sprite Mock */}
                      <motion.div
                        animate={{ y: [0, -30, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                        className="w-8 h-10 bg-cyan-400 rounded-lg border-2 border-white flex flex-col items-center justify-center font-extrabold text-[10px] text-slate-950 shadow-lg shadow-cyan-400/50"
                      >
                        🏃
                      </motion.div>

                      {/* Coin */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-xs font-bold text-slate-950 shadow-md shadow-amber-400/50"
                      >
                        🪙
                      </motion.div>

                      {/* Castle Flagpole */}
                      <div className="w-6 h-16 border-l-2 border-slate-500 relative flex flex-col items-start">
                        <div className="w-6 h-4 bg-rose-500 border border-rose-300 text-[8px] text-white flex items-center justify-center">
                          🚩
                        </div>
                        <div className="w-8 h-4 bg-slate-700 mt-auto rounded-sm" />
                      </div>
                    </div>

                    <div className="w-full h-3 bg-slate-800 rounded-full border-t border-slate-700" />
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        playClickSound(900);
                        setGameScore((s) => s + 10);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <span>Jump & Collect Coin (+10 Score)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <a
                  href={activeDemoProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View Source Code on GitHub</span>
                </a>
                <button
                  onClick={() => setActiveDemoProject(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg"
                >
                  Close Sandbox
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
