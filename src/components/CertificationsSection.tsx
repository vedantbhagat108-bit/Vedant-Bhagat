import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  ExternalLink,
  Calendar,
  CheckCircle2,
  X,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Certification } from '../types';
import { playClickSound } from '../utils/audio';

export const CertificationsSection: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const certifications = data.certifications || [];

  // Hide completely if no certifications exist
  if (certifications.length === 0) {
    return null;
  }

  const handleCopyCredentialId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    playClickSound(850, 0.05);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="certifications" className="py-24 relative z-10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-lg shadow-emerald-950/40">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>VERIFIED CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Licenses & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Certifications</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Accredited achievements, professional industry certifications, and verified technical milestones.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => {
                playClickSound(700);
                setSelectedCert(cert);
              }}
              className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900/95 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/30 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Certificate Preview Image or Badge Icon */}
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 relative flex items-center justify-center group-hover:border-emerald-500/30 transition-all">
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <FileCheck className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-mono text-slate-400">Verified Certificate</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                    <span className="font-bold uppercase tracking-wider">{cert.issuer || 'Accredited Issuer'}</span>
                    {cert.issueDate && (
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {cert.issueDate}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                    {cert.title}
                  </h3>

                  {cert.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {cert.description}
                    </p>
                  )}
                </div>

                {/* Skills Acquired */}
                {cert.skillsAcquired && cert.skillsAcquired.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skillsAcquired.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400/90 group-hover:text-emerald-300 flex items-center gap-1">
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>

                {cert.credentialId && (
                  <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                    ID: {cert.credentialId}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                      {selectedCert.title}
                    </h3>
                    <p className="text-xs text-emerald-400 font-mono">
                      Issued by {selectedCert.issuer || 'Official Organization'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound(600);
                    setSelectedCert(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
                {/* Certificate Image Banner */}
                {selectedCert.imageUrl ? (
                  <div className="w-full max-h-72 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                    <img
                      src={selectedCert.imageUrl}
                      alt={selectedCert.title}
                      className="w-full h-full object-contain max-h-72"
                    />
                  </div>
                ) : (
                  <div className="w-full py-12 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <FileCheck className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-mono text-slate-300 font-semibold">Verified Certificate Credential</span>
                  </div>
                )}

                {/* Metadata List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Issuing Organization</span>
                    <span className="text-white font-bold">{selectedCert.issuer || 'Verified Authority'}</span>
                  </div>

                  {selectedCert.issueDate && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Issue Date</span>
                      <span className="text-white font-bold">{selectedCert.issueDate}</span>
                    </div>
                  )}

                  {selectedCert.credentialId && (
                    <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Credential / License ID</span>
                        <span className="text-emerald-300 font-mono select-all break-all">{selectedCert.credentialId}</span>
                      </div>
                      <button
                        onClick={(e) => handleCopyCredentialId(selectedCert.credentialId!, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px] transition-all"
                        title="Copy ID"
                      >
                        {copiedId === selectedCert.credentialId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Detailed Description */}
                {selectedCert.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Credential Overview</h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                      {selectedCert.description}
                    </p>
                  </div>
                )}

                {/* Skills Acquired */}
                {selectedCert.skillsAcquired && selectedCert.skillsAcquired.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Skills & Competencies Verified</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skillsAcquired.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono transition-all"
                >
                  Close
                </button>

                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound(800)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/50"
                  >
                    <span>Verify Credential Online</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
