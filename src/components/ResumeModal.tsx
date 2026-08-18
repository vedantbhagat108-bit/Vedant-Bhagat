import React from 'react';
import { motion } from 'motion/react';
import { X, Printer, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { playClickSound } from '../utils/audio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();

  if (!isOpen) return null;

  const handlePrint = () => {
    playClickSound(700);
    window.print();
  };

  const personalInfo = data.personalInfo;
  const educationData = data.education;
  const projectsData = data.projects;
  const skillCategories = data.skillCategories || [];
  const certifications = data.certifications || [];
  const leetcodeCount = data.leetcodeSolvedCount || '200+';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Control Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <CheckCircle className="w-4 h-4" />
            <span>Verified Resume Document • {personalInfo.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Content Container */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 font-sans print:p-0 print:bg-white print:text-black">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-900">
                {personalInfo.name}
              </h1>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                {personalInfo.phone} • Roll No: {personalInfo.dtuRoll}
              </p>
            </div>

            <div className="text-xs font-medium text-slate-800 space-y-0.5 text-left sm:text-right mt-3 sm:mt-0">
              <p>Email: <a href={`mailto:${personalInfo.email}`} className="text-blue-700 underline">{personalInfo.email}</a></p>
              <p>GitHub: <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-700 underline">{personalInfo.github}</a></p>
              <p>LeetCode: <a href={personalInfo.leetcode} target="_blank" rel="noreferrer" className="text-blue-700 underline">{personalInfo.leetcode}</a></p>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-900 px-2 py-1 mb-2 border-l-4 border-slate-900">
              Summary
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed font-normal">
              {personalInfo.bio}
            </p>
          </div>

          {/* Education Section */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-900 px-2 py-1 mb-2 border-l-4 border-slate-900">
              Education
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-2 border border-slate-300">Degree / Qualification</th>
                    <th className="p-2 border border-slate-300">Year</th>
                    <th className="p-2 border border-slate-300">Institution</th>
                    <th className="p-2 border border-slate-300">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {educationData.map((e) => (
                    <tr key={e.degree} className="border-b border-slate-200">
                      <td className="p-2 font-semibold border border-slate-300">{e.degree}</td>
                      <td className="p-2 border border-slate-300">{e.period}</td>
                      <td className="p-2 border border-slate-300">{e.institution}</td>
                      <td className="p-2 font-bold border border-slate-300">{e.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Projects Section */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-900 px-2 py-1 mb-2 border-l-4 border-slate-900">
              Academic Projects
            </h2>
            <div className="space-y-4">
              {projectsData.map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">
                      {p.title} {p.github && <span className="font-normal italic">({p.github.replace('https://github.com/', '')})</span>}
                    </h3>
                  </div>
                  {p.techStack && p.techStack.length > 0 && (
                    <p className="text-[11px] font-semibold text-slate-700">
                      Tech: {p.techStack.join(', ')}
                    </p>
                  )}
                  <ul className="list-disc list-inside text-xs text-slate-800 space-y-0.5">
                    {p.description.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Licenses & Certifications Section (Rendered dynamically when present) */}
          {certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-900 px-2 py-1 mb-2 border-l-4 border-slate-900">
                Licenses & Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((c) => (
                  <div key={c.id} className="text-xs text-slate-800">
                    <div className="flex justify-between font-bold">
                      <span>{c.title} — <span className="text-slate-600 font-medium">{c.issuer}</span></span>
                      {c.issueDate && <span className="text-slate-500 font-mono">{c.issueDate}</span>}
                    </div>
                    {c.credentialId && (
                      <p className="text-[11px] text-slate-600 font-mono">Credential ID: {c.credentialId}</p>
                    )}
                    {c.description && (
                      <p className="text-[11px] text-slate-700">{c.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Achievements */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-900 px-2 py-1 mb-2 border-l-4 border-slate-900">
              Academic Achievements and Awards
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-800 space-y-1">
              <li>Regularly practicing Data Structures and Algorithms in C++ and solved {leetcodeCount} problems on LeetCode.</li>
              <li>Academic distinction and high performance at Delhi Technological University (DTU).</li>
            </ul>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-900 px-2 py-1 mb-2 border-l-4 border-slate-900">
              Technical Skills & Competencies
            </h2>
            <div className="text-xs text-slate-800 space-y-1">
              {skillCategories.map((cat) => (
                <p key={cat.title}>
                  <strong>{cat.title}:</strong> {cat.skills.map((s) => s.name).join(', ')}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
