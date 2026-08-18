import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Github, ExternalLink, Code2, Flame, RefreshCw, Calendar } from 'lucide-react';
import { LEETCODE_SKILL_METRICS, LEETCODE_TOPICS, PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound } from '../utils/audio';

interface GitHubContributionDay {
  date: string;
  level: number;
}

export const CodingStatsSection: React.FC = () => {
  const { data } = usePortfolio();
  const [ghDays, setGhDays] = useState<GitHubContributionDay[]>([]);
  const [totalGhContribs, setTotalGhContribs] = useState<string>('14');
  const [loadingGh, setLoadingGh] = useState<boolean>(true);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; level: number } | null>(null);

  // Toggle state for LeetCode topic metric cards
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    Advanced: true,
    Intermediate: true,
    Fundamental: true,
  });

  const toggleTier = (tier: string) => {
    playClickSound(500);
    setExpandedTiers((prev) => ({
      ...prev,
      [tier]: !prev[tier],
    }));
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchGitHubData() {
      try {
        setLoadingGh(true);
        const res = await fetch('/api/github-contributions?username=vedantbhagat108-bit');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.days) && data.days.length > 0) {
          setGhDays(data.days);
          if (data.totalContributions) {
            setTotalGhContribs(data.totalContributions);
          }
        }
      } catch (err) {
        console.error('Failed to load GitHub contributions:', err);
      } finally {
        if (isMounted) setLoadingGh(false);
      }
    }

    fetchGitHubData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to color GitHub matrix levels matching GitHub's official theme
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-cyan-900 border border-cyan-700/60 shadow-sm shadow-cyan-900/50';
      case 2:
        return 'bg-cyan-600 border border-cyan-400/80 shadow-md shadow-cyan-600/40';
      case 3:
        return 'bg-cyan-400 border border-cyan-200 shadow-lg shadow-cyan-400/60 animate-pulse';
      case 4:
        return 'bg-cyan-300 border border-white shadow-xl shadow-cyan-300/80 animate-pulse';
      default:
        return 'bg-slate-900/90 border border-slate-800/80 hover:border-slate-700';
    }
  };

  return (
    <section id="coding-stats" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>DSA & OPEN SOURCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Coding Profiles <span className="text-emerald-400">& Metrics</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Active Data Structures & Algorithms practice in C++ alongside live GitHub open-source activity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LeetCode Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40">
                  <Flame className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">LeetCode Metrics</h3>
                  <a
                    href={PERSONAL_INFO.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playClickSound(600)}
                    className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>leetcode.com/u/Vedant1205/</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">{data.leetcodeSolvedCount || '200+'}</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Solved in C++</div>
              </div>
            </div>

            {/* Categorized Topic Metrics from LeetCode Profile */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-wider">
                <span>LeetCode Topic Skills & Counts</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">
                  {data.leetcodeSolvedCount || '200+'} Solved
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {LEETCODE_SKILL_METRICS.map((tierData) => {
                  const isExpanded = expandedTiers[tierData.tier] ?? true;
                  const visibleTopics = isExpanded ? tierData.topics : tierData.topics.slice(0, 4);

                  return (
                    <div
                      key={tierData.tier}
                      className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/90 space-y-2.5 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${tierData.dotColor} shadow-sm`} />
                          <span className={`font-bold text-xs uppercase font-mono tracking-wider ${tierData.color}`}>
                            {tierData.tier}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleTier(tierData.tier)}
                          className="text-[10px] font-mono text-slate-400 hover:text-amber-300 transition-colors"
                        >
                          {isExpanded ? 'Show less' : `Show all (${tierData.topics.length})`}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {visibleTopics.map((topic) => (
                          <div
                            key={topic.name}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/40 rounded-lg text-xs transition-all hover:scale-105 group"
                          >
                            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                              {topic.name}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px] font-semibold group-hover:text-amber-400 transition-colors">
                              x{topic.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <a
                href={PERSONAL_INFO.leetcode}
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound(700)}
                className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-300 font-medium flex items-center justify-center gap-2 transition-all"
              >
                <span>Visit Live LeetCode Profile (Vedant1205)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Real Live GitHub Contribution Activity Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/40">
                  <Github className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">GitHub Ecosystem</h3>
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playClickSound(600)}
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>github.com/vedantbhagat108-bit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-cyan-400 font-mono">3</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Public Repos</div>
              </div>
            </div>

            {/* Live GitHub Heatmap Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 tracking-wider">
                <span className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub Live Contribution Heatmap</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  {loadingGh ? (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Fetching...
                    </span>
                  ) : (
                    <span>{totalGhContribs} contribs in last year</span>
                  )}
                </span>
              </div>

              {/* GitHub Heatmap Grid Direct from GitHub */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto relative">
                {loadingGh && ghDays.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-cyan-400 text-xs font-mono gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Loading live GitHub calendar graph from github.com...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
                      {(ghDays.length > 0 ? ghDays : Array.from({ length: 364 })).map((dayItem, idx) => {
                        const day = typeof dayItem === 'object' ? dayItem : { date: `Day ${idx}`, level: 0 };
                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-all cursor-pointer ${getLevelColor(
                              day.level
                            )}`}
                            title={`${day.date}: ${day.level > 0 ? `${day.level} contributions` : 'No contributions'}`}
                          />
                        );
                      })}
                    </div>

                    {/* Hover Info Bar */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                      <div>
                        {hoveredDay ? (
                          <span className="text-cyan-300 font-semibold">
                            {hoveredDay.date} — {hoveredDay.level > 0 ? `${hoveredDay.level} contribution(s)` : 'No contributions recorded'}
                          </span>
                        ) : (
                          <span>Hover over any cell to view daily activity</span>
                        )}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-1">
                        <span>Less</span>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-900 border border-slate-800" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-900" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-600" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-400" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-300" />
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Repositories Quick List Direct from GitHub */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Public GitHub Repositories</span>
                <span className="text-[10px] text-cyan-400">vedantbhagat108-bit</span>
              </div>

              <a
                href="https://github.com/vedantbhagat108-bit/ai-project-"
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound(650)}
                className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl flex items-center justify-between text-xs font-mono text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-white">ai-project-</span>
                  <span className="text-slate-400 text-[11px] hidden sm:inline">(YouTube Summarizer AI)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    Python
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </a>

              <a
                href="https://github.com/vedantbhagat108-bit/jumper-game"
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound(650)}
                className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-center justify-between text-xs font-mono text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-white">jumper-game</span>
                  <span className="text-slate-400 text-[11px] hidden sm:inline">(2D Pygame Arcade Engine)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                    Python
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </a>

              <a
                href="https://github.com/vedantbhagat108-bit/leetcode-solutions"
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound(650)}
                className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl flex items-center justify-between text-xs font-mono text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-white">leetcode-solutions</span>
                  <span className="text-slate-400 text-[11px] hidden sm:inline">(C++ DSA Implementations)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                    C++
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
