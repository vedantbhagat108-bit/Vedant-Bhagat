import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Copy, Check, Send, Github, Target, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound } from '../utils/audio';

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleCopyEmail = () => {
    playClickSound(700);
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    playClickSound(800);
    setSentSuccess(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSentSuccess(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>TRANSMISSION LINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Get In <span className="text-cyan-400">Touch</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Open for internships, project collaborations, software engineering discussions, and DSA networking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl"
          >
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white text-xl">Direct Coordinates</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Delhi Technological University, New Delhi</p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Email */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Primary DTU Email</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="truncate pr-2 font-semibold">{PERSONAL_INFO.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all shrink-0"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>Contact Phone</span>
                </div>
                <div className="text-slate-200 font-semibold">{PERSONAL_INFO.phone}</div>
              </div>

              {/* Profiles */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playClickSound(600)}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition-all"
                >
                  <Github className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-[11px] truncate">
                    <div className="font-bold">GitHub</div>
                    <div className="text-[9px] text-slate-400 truncate">@vedantbhagat108-bit</div>
                  </div>
                </a>

                <a
                  href={PERSONAL_INFO.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playClickSound(600)}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-all shadow-sm"
                >
                  <Target className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-[11px] truncate">
                    <div className="font-bold flex items-center gap-1">
                      <span>LeetCode</span>
                    </div>
                    <div className="text-[9px] text-amber-400/90 font-semibold truncate">
                      {data.leetcodeSolvedCount || '200+'} Solved
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl"
          >
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white text-xl">Transmit Signal</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Send a direct message or feedback</p>
            </div>

            {sentSuccess ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center space-y-2 text-emerald-300 font-mono animate-fadeIn">
                <Sparkles className="w-8 h-8 mx-auto text-emerald-400 animate-bounce" />
                <p className="font-bold text-sm">Transmission Successfully Sent!</p>
                <p className="text-xs text-slate-300">
                  Thank you! Your message has been dispatched. Vedant will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Smith"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Your Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Message Payload</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello Vedant, I reviewed your space portfolio and would love to connect..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3.5 text-xs font-mono text-slate-100 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Cosmic Message</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
