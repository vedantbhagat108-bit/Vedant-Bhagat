import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Code2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  KeyRound,
  Eye,
  EyeOff,
  Film,
  Upload,
  Award,
  Cpu,
  Layers,
  Terminal,
  Server,
  Database,
  Globe,
  Flame,
  Shield,
  Zap,
  Box,
  Brain,
  Binary,
  Layout,
  GitBranch,
  Image,
  ExternalLink,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory, Certification } from '../types';
import { playClickSound } from '../utils/audio';
import { saveVideoFile, deleteSavedVideo } from '../utils/videoStorage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Code2', label: 'Code', icon: Code2 },
  { name: 'Terminal', label: 'Terminal', icon: Terminal },
  { name: 'Cpu', label: 'Processor', icon: Cpu },
  { name: 'Layout', label: 'Layout/Web', icon: Layout },
  { name: 'GitBranch', label: 'Git/Repo', icon: GitBranch },
  { name: 'Layers', label: 'Layers/Stack', icon: Layers },
  { name: 'Binary', label: 'Binary/DSA', icon: Binary },
  { name: 'Brain', label: 'Brain/AI', icon: Brain },
  { name: 'Box', label: 'Box/OOP', icon: Box },
  { name: 'Server', label: 'Server/Backend', icon: Server },
  { name: 'Database', label: 'Database/SQL', icon: Database },
  { name: 'Network', label: 'Network/API', icon: Server },
  { name: 'Globe', label: 'Cloud/Web', icon: Globe },
  { name: 'Zap', label: 'Fast/API', icon: Zap },
  { name: 'Shield', label: 'Security', icon: Shield },
  { name: 'Flame', label: 'Hot/Trending', icon: Flame },
  { name: 'Sparkles', label: 'AI/GenAI', icon: Sparkles },
];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    data,
    isAdminLoggedIn,
    adminEmail,
    loginAsAdmin,
    logoutAdmin,
    changeAdminPassword,
    updatePortfolioData,
    resetToDefaults,
  } = usePortfolio();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [authMsg, setAuthMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Tab in Admin Panel
  const [activeTab, setActiveTab] = useState<
    'metrics' | 'bio' | 'skills' | 'certifications' | 'projects' | 'video' | 'password'
  >('metrics');

  // Local Form States
  const [leetcodeCount, setLeetcodeCount] = useState(data.leetcodeSolvedCount || '200+');
  const [bioText, setBioText] = useState(data.personalInfo.bio);
  const [cgpaText, setCgpaText] = useState(data.personalInfo.cgpa);
  const [projectsList, setProjectsList] = useState(data.projects);
  const [skillsList, setSkillsList] = useState<SkillCategory[]>(data.skillCategories || []);
  const [certificationsList, setCertificationsList] = useState<Certification[]>(data.certifications || []);

  // Password Change Form State
  const [passForm, setPassForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [showPassFormEye, setShowPassFormEye] = useState(false);

  // New Project Form
  const [newProject, setNewProject] = useState({
    title: '',
    tagline: '',
    description: '',
    techStack: '',
    githubUrl: '',
    category: 'Full-Stack / Web' as const,
  });
  const [showAddProject, setShowAddProject] = useState(false);

  // New Skill Form
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [newSkillCategoryName, setNewSkillCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newSkillForm, setNewSkillForm] = useState({
    name: '',
    level: 85,
    iconName: 'Code2',
    description: '',
  });

  // New Certificate Form
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertForm, setNewCertForm] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    skillsAcquired: '',
    description: '',
  });
  const [certImagePreview, setCertImagePreview] = useState<string>('');

  // Handle Certificate Image Upload
  const handleCertImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setCertImagePreview(base64);
        setNewCertForm((prev) => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Certificate
  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertForm.title.trim() || !newCertForm.issuer.trim()) {
      setAuthMsg({ type: 'error', text: 'Certificate Title and Issuing Organization are required!' });
      return;
    }

    playClickSound(800);
    const createdCert: Certification = {
      id: `cert-${Date.now()}`,
      title: newCertForm.title.trim(),
      issuer: newCertForm.issuer.trim(),
      issueDate: newCertForm.issueDate.trim() || undefined,
      credentialId: newCertForm.credentialId.trim() || undefined,
      credentialUrl: newCertForm.credentialUrl.trim() || undefined,
      imageUrl: newCertForm.imageUrl || certImagePreview || undefined,
      skillsAcquired: newCertForm.skillsAcquired
        ? newCertForm.skillsAcquired.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
      description: newCertForm.description.trim() || undefined,
    };

    const updated = [createdCert, ...certificationsList];
    setCertificationsList(updated);
    updatePortfolioData({ certifications: updated });

    setNewCertForm({
      title: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: '',
      imageUrl: '',
      skillsAcquired: '',
      description: '',
    });
    setCertImagePreview('');
    setShowAddCert(false);
    setAuthMsg({
      type: 'success',
      text: `Certificate "${createdCert.title}" added successfully! The Certifications section is now live on your portfolio.`,
    });
  };

  // Delete Certificate
  const handleDeleteCertification = (id: string) => {
    playClickSound(600);
    const updated = certificationsList.filter((c) => c.id !== id);
    setCertificationsList(updated);
    updatePortfolioData({ certifications: updated });
    setAuthMsg({
      type: 'success',
      text: updated.length === 0
        ? 'Certificate removed. Certifications section is now hidden.'
        : 'Certificate deleted.',
    });
  };

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillForm.name.trim() || skillsList.length === 0) return;

    playClickSound(800);
    const updatedCategories = [...skillsList];
    const cat = updatedCategories[selectedCategoryIndex] || updatedCategories[0];

    const newSkill = {
      name: newSkillForm.name.trim(),
      level: Number(newSkillForm.level) || 85,
      iconName: newSkillForm.iconName,
      description: newSkillForm.description.trim() || `Proficient in ${newSkillForm.name}`,
    };

    cat.skills = [...cat.skills, newSkill];
    setSkillsList(updatedCategories);
    updatePortfolioData({ skillCategories: updatedCategories });

    setNewSkillForm({
      name: '',
      level: 85,
      iconName: 'Code2',
      description: '',
    });
    setShowAddSkill(false);
    setAuthMsg({ type: 'success', text: `Skill "${newSkill.name}" added to ${cat.title}!` });
  };

  // Delete Skill
  const handleDeleteSkill = (catIdx: number, skillName: string) => {
    playClickSound(600);
    const updatedCategories = [...skillsList];
    updatedCategories[catIdx].skills = updatedCategories[catIdx].skills.filter((s) => s.name !== skillName);
    setSkillsList(updatedCategories);
    updatePortfolioData({ skillCategories: updatedCategories });
  };

  // Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillCategoryName.trim()) return;

    playClickSound(800);
    const updated = [...skillsList, { title: newSkillCategoryName.trim(), skills: [] }];
    setSkillsList(updated);
    updatePortfolioData({ skillCategories: updated });
    setNewSkillCategoryName('');
    setShowAddCategory(false);
    setSelectedCategoryIndex(updated.length - 1);
    setAuthMsg({ type: 'success', text: `Skill category "${newSkillCategoryName}" created!` });
  };

  // Delete Category
  const handleDeleteCategory = (catIdx: number) => {
    playClickSound(600);
    const updated = skillsList.filter((_, idx) => idx !== catIdx);
    setSkillsList(updated);
    updatePortfolioData({ skillCategories: updated });
    setSelectedCategoryIndex(0);
  };

  // Handle Owner Login with Email + Password
  const handleOwnerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(700);
    setIsAuthenticating(true);
    setAuthMsg({ type: null, text: '' });

    const result = await loginAsAdmin(emailInput, passwordInput);
    setIsAuthenticating(false);

    if (result.success) {
      setAuthMsg({ type: 'success', text: result.message });
    } else {
      setAuthMsg({ type: 'error', text: result.message });
    }
  };

  // Handle Password Update
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(700);

    if (passForm.newPass !== passForm.confirmPass) {
      setAuthMsg({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    const res = await changeAdminPassword(passForm.currentPass, passForm.newPass);
    if (res.success) {
      setAuthMsg({ type: 'success', text: res.message });
      setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
      setPasswordInput(passForm.newPass);
    } else {
      setAuthMsg({ type: 'error', text: res.message });
    }
  };

  // Save changes to PortfolioContext
  const handleSaveAll = () => {
    playClickSound(900);
    updatePortfolioData({
      leetcodeSolvedCount: leetcodeCount,
      personalInfo: {
        ...data.personalInfo,
        bio: bioText,
        cgpa: cgpaText,
      },
      projects: projectsList,
      skillCategories: skillsList,
      certifications: certificationsList,
    });
    setAuthMsg({ type: 'success', text: 'Portfolio changes saved and published live!' });
    setTimeout(() => setAuthMsg({ type: null, text: '' }), 4000);
  };

  // Add new custom project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    playClickSound(800);
    const createdProject = {
      id: `custom-${Date.now()}`,
      title: newProject.title,
      subtitle: newProject.tagline || 'Custom Engineering Project',
      description: [newProject.description || 'Built and deployed by Vedant Bhagat.'],
      techStack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      github: newProject.githubUrl || 'https://github.com/vedantbhagat108-bit',
      highlights: ['Custom Owner Verified Project'],
      category: 'Backend Systems' as const,
      featured: true,
      demoType: 'summarizer' as const,
    };

    const updated = [createdProject, ...projectsList];
    setProjectsList(updated);
    updatePortfolioData({ projects: updated });

    setNewProject({
      title: '',
      tagline: '',
      description: '',
      techStack: '',
      githubUrl: '',
      category: 'Full-Stack / Web',
    });
    setShowAddProject(false);
    setAuthMsg({ type: 'success', text: `Project "${createdProject.title}" added successfully!` });
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    playClickSound(600);
    const updated = projectsList.filter((p) => p.id !== id);
    setProjectsList(updated);
    updatePortfolioData({ projects: updated });
  };

  // Reset to original defaults
  const handleReset = () => {
    playClickSound(500);
    resetToDefaults();
    setLeetcodeCount('200+');
    setBioText(data.personalInfo.bio);
    setCgpaText(data.personalInfo.cgpa);
    setProjectsList(data.projects);
    setSkillsList(data.skillCategories || []);
    setCertificationsList([]);
    setAuthMsg({ type: 'success', text: 'Portfolio reset to default verified data.' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Owner Portfolio Customization Panel
                  {isAdminLoggedIn && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Authorized
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {isAdminLoggedIn
                    ? 'Logged in as Verified Owner'
                    : 'Owner Security Authorization Required'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound(600);
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
            {/* Status Notifications */}
            {authMsg.text && (
              <div
                className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-2.5 border ${
                  authMsg.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}
              >
                {authMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{authMsg.text}</span>
              </div>
            )}

            {!isAdminLoggedIn ? (
              /* Google Owner Auth Gate */
              <div className="py-6 space-y-6 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Owner Authorization Required</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Customization is restricted exclusively to the verified portfolio owner account.
                  </p>
                </div>

                <form onSubmit={handleOwnerAuth} className="space-y-4 text-left bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Owner Google Account / Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                        placeholder="Enter authorized owner email"
                      />
                      <UserCheck className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Admin Owner Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                        placeholder="Enter owner password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      Authorized owner password required to unlock settings
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
                  >
                    {isAuthenticating ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Log In & Unlock Customizations</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[11px] text-slate-500 font-mono">
                  Protected Owner Verification Portal
                </p>
              </div>
            ) : (
              /* Authorized Owner Customization Controls */
              <div className="space-y-6">
                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-800 gap-1.5 pb-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'metrics'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>LeetCode</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bio')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'bio'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Bio & CGPA</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'skills'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Skills & Tech</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('certifications')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'certifications'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Certifications ({certificationsList.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'projects'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Projects ({projectsList.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'video'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Hero Video</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('password')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'password'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Password</span>
                  </button>
                </div>

                {/* Tab 1: LeetCode & Coding Metrics */}
                {activeTab === 'metrics' && (
                  <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      <span>LeetCode Solved Questions Metrics</span>
                    </h3>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-400">
                        Total Solved Questions Display Label
                      </label>
                      <input
                        type="text"
                        value={leetcodeCount}
                        onChange={(e) => setLeetcodeCount(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                        placeholder="e.g. 200+ or 210+"
                      />
                      <p className="text-[11px] text-slate-500 font-mono">
                        This updates all LeetCode solved metric counters across the Hero, About, Coding Stats, Resume, and Terminal components.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Bio & CGPA */}
                {activeTab === 'bio' && (
                  <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      <span>Edit Personal Bio & Academic Scores</span>
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          Current CGPA
                        </label>
                        <input
                          type="text"
                          value={cgpaText}
                          onChange={(e) => setCgpaText(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          Bio Summary Text
                        </label>
                        <textarea
                          rows={4}
                          value={bioText}
                          onChange={(e) => setBioText(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Skills & Competencies Customization */}
                {activeTab === 'skills' && (
                  <div className="space-y-5">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                          <span>Manage Skills & Competencies</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Add, customize, or remove skills and categories displayed in the Technical Arsenal.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAddCategory(!showAddCategory)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{showAddCategory ? 'Cancel' : 'New Category'}</span>
                        </button>

                        <button
                          onClick={() => setShowAddSkill(!showAddSkill)}
                          className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAddSkill ? 'Cancel' : 'Add Skill'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Add Category Form */}
                    {showAddCategory && (
                      <form onSubmit={handleAddCategory} className="p-4 bg-slate-950/90 rounded-xl border border-cyan-500/30 space-y-3">
                        <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono">Create New Skill Category</h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Cloud & DevOps, AI Frameworks, Databases"
                            value={newSkillCategoryName}
                            onChange={(e) => setNewSkillCategoryName(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                            required
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono rounded-xl transition-all"
                          >
                            Add Category
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Add Skill Form */}
                    {showAddSkill && (
                      <form onSubmit={handleAddSkill} className="p-4 bg-slate-950/90 rounded-xl border border-cyan-500/30 space-y-3">
                        <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono">Add New Skill</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Select Target Category</label>
                            <select
                              value={selectedCategoryIndex}
                              onChange={(e) => setSelectedCategoryIndex(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                            >
                              {skillsList.map((cat, idx) => (
                                <option key={cat.title} value={idx}>
                                  {cat.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Skill Name</label>
                            <input
                              type="text"
                              placeholder="e.g. TypeScript, Docker, PyTorch"
                              value={newSkillForm.name}
                              onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              Proficiency Level: <span className="text-cyan-400 font-bold">{newSkillForm.level}%</span>
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={newSkillForm.level}
                              onChange={(e) => setNewSkillForm({ ...newSkillForm, level: Number(e.target.value) })}
                              className="w-full accent-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Icon Representation</label>
                            <select
                              value={newSkillForm.iconName}
                              onChange={(e) => setNewSkillForm({ ...newSkillForm, iconName: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                            >
                              {AVAILABLE_ICONS.map((ic) => (
                                <option key={ic.name} value={ic.name}>
                                  {ic.label} ({ic.name})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Skill Description / Usage</label>
                          <input
                            type="text"
                            placeholder="e.g. Building full-stack web applications and scalable APIs"
                            value={newSkillForm.description}
                            onChange={(e) => setNewSkillForm({ ...newSkillForm, description: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono rounded-xl transition-all"
                        >
                          Save Skill to Category
                        </button>
                      </form>
                    )}

                    {/* Categories & Skills List */}
                    <div className="space-y-4">
                      {skillsList.map((cat, catIdx) => (
                        <div key={cat.title} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{cat.title}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-cyan-400 rounded-md border border-slate-800">
                                {cat.skills.length} skills
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteCategory(catIdx)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-all"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {cat.skills.map((skill) => (
                              <div
                                key={skill.name}
                                className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80 flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-200 truncate">{skill.name}</span>
                                    <span className="text-cyan-400 font-mono text-[11px]">{skill.level}%</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate">{skill.description}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteSkill(catIdx, skill.name)}
                                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-all shrink-0"
                                  title="Remove skill"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Certifications Manager & Upload */}
                {activeTab === 'certifications' && (
                  <div className="space-y-5">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-400" />
                          <span>Certificates & Credentials Management</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Upload certificate images, titles, and verification URLs. The portfolio Certifications section is automatically shown when certificates are added.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowAddCert(!showAddCert)}
                        className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{showAddCert ? 'Cancel' : 'Upload / Add Certificate'}</span>
                      </button>
                    </div>

                    {/* Add Certificate Form */}
                    {showAddCert && (
                      <form onSubmit={handleAddCertification} className="p-4 sm:p-5 bg-slate-950/95 rounded-2xl border border-emerald-500/40 space-y-4">
                        <h4 className="text-xs font-bold text-emerald-300 uppercase font-mono flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <span>Add New Verified Credential</span>
                        </h4>

                        {/* Certificate Image Upload Dropzone */}
                        <div className="space-y-2">
                          <label className="block text-xs font-mono text-slate-300">Certificate Image / Badge / PDF Screenshot</label>
                          <div className="p-4 bg-slate-900/80 border border-dashed border-emerald-500/40 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                            {certImagePreview ? (
                              <div className="relative w-full max-h-48 rounded-lg overflow-hidden border border-slate-800">
                                <img
                                  src={certImagePreview}
                                  alt="Preview"
                                  className="w-full h-44 object-contain bg-slate-950"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCertImagePreview('');
                                    setNewCertForm({ ...newCertForm, imageUrl: '' });
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-rose-900/80 hover:bg-rose-800 text-white rounded-lg text-xs"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                                  <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-xs text-slate-300">
                                  <label
                                    htmlFor="cert-file-upload"
                                    className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer underline underline-offset-2"
                                  >
                                    Click to upload certificate image
                                  </label>
                                  <span className="text-slate-400"> or drag and drop (.png, .jpg, .webp)</span>
                                </div>
                                <input
                                  id="cert-file-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleCertImageUpload}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              Certificate Title *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. AWS Certified Solutions Architect"
                              value={newCertForm.title}
                              onChange={(e) => setNewCertForm({ ...newCertForm, title: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              Issuing Authority / Organization *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Amazon Web Services, Google, Coursera, DTU"
                              value={newCertForm.issuer}
                              onChange={(e) => setNewCertForm({ ...newCertForm, issuer: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              Issue Date
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Aug 2026 or 2025"
                              value={newCertForm.issueDate}
                              onChange={(e) => setNewCertForm({ ...newCertForm, issueDate: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              Credential / License ID
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. AWS-10293847"
                              value={newCertForm.credentialId}
                              onChange={(e) => setNewCertForm({ ...newCertForm, credentialId: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              Verification URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://coursera.org/verify/..."
                              value={newCertForm.credentialUrl}
                              onChange={(e) => setNewCertForm({ ...newCertForm, credentialUrl: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Skills Acquired (comma separated)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Cloud Architecture, Python, Security, APIs"
                            value={newCertForm.skillsAcquired}
                            onChange={(e) => setNewCertForm({ ...newCertForm, skillsAcquired: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Description / Summary
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Brief description of coursework and verified competencies..."
                            value={newCertForm.description}
                            onChange={(e) => setNewCertForm({ ...newCertForm, description: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono rounded-xl transition-all shadow-lg shadow-emerald-950/40"
                        >
                          Save & Publish Certificate
                        </button>
                      </form>
                    )}

                    {/* Existing Certifications List */}
                    <div className="space-y-3">
                      {certificationsList.length === 0 ? (
                        <div className="p-8 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center space-y-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">No Certifications Added Yet</h4>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                              As soon as you upload and save a certificate above, the Certifications section will automatically appear on your portfolio.
                            </p>
                          </div>
                        </div>
                      ) : (
                        certificationsList.map((cert) => (
                          <div
                            key={cert.id}
                            className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4 text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {cert.imageUrl ? (
                                <img
                                  src={cert.imageUrl}
                                  alt={cert.title}
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-800 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                  <FileCheck className="w-6 h-6" />
                                </div>
                              )}

                              <div className="min-w-0">
                                <span className="font-bold text-white block truncate">{cert.title}</span>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                                  <span className="text-emerald-400">{cert.issuer}</span>
                                  {cert.issueDate && <span>• {cert.issueDate}</span>}
                                  {cert.credentialId && <span>• ID: {cert.credentialId}</span>}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteCertification(cert.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-all shrink-0"
                              title="Delete Certificate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 5: Projects Manager */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white">Manage & Add Projects</h3>
                      <button
                        onClick={() => setShowAddProject(!showAddProject)}
                        className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-xl text-xs font-mono text-purple-300 flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{showAddProject ? 'Cancel' : 'Add New Project'}</span>
                      </button>
                    </div>

                    {showAddProject && (
                      <form onSubmit={handleAddProject} className="p-4 bg-slate-950/90 rounded-xl border border-purple-500/30 space-y-3">
                        <h4 className="text-xs font-bold text-purple-300 uppercase font-mono">Create New Project</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Project Title"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Tagline / Short Subtitle"
                            value={newProject.tagline}
                            onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Project Description"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Tech Stack (comma separated e.g. C++, Python, OpenCV)"
                            value={newProject.techStack}
                            onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                          <input
                            type="url"
                            placeholder="GitHub Repository URL"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono rounded-xl transition-all"
                        >
                          Save New Project
                        </button>
                      </form>
                    )}

                    <div className="space-y-2">
                      {projectsList.map((project) => (
                        <div
                          key={project.id}
                          className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{project.title}</span>
                            <span className="text-slate-400 text-[11px]">{project.subtitle}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-all"
                            title="Remove project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 6: Hero Video Management */}
                {activeTab === 'video' && (
                  <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-sky-400" />
                      <span>Hero Intro Video Management</span>
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Upload or replace your personal intro video displayed in the first section of your space portfolio.
                    </p>

                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center space-y-3">
                      <input
                        type="file"
                        id="admin-video-upload"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            playClickSound(800);
                            await saveVideoFile(file);
                            window.dispatchEvent(new Event('portfolio-video-updated'));
                            setAuthMsg({ type: 'success', text: `Successfully uploaded ${file.name}! Video is now active in the hero section.` });
                          }
                        }}
                      />

                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <label
                          htmlFor="admin-video-upload"
                          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs font-mono rounded-xl cursor-pointer flex items-center gap-2 transition-all shadow-md"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload / Change Video (.mp4 / .webm)</span>
                        </label>

                        <button
                          type="button"
                          onClick={async () => {
                            playClickSound(600);
                            await deleteSavedVideo();
                            window.dispatchEvent(new Event('portfolio-video-updated'));
                            setAuthMsg({ type: 'success', text: 'Custom video removed. Reset to default holographic cosmic portal.' });
                          }}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-mono rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete / Clear Video</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 7: Security & Password Management */}
                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span>Update Owner Security Password</span>
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          Current Admin Password
                        </label>
                        <input
                          type={showPassFormEye ? 'text' : 'password'}
                          required
                          value={passForm.currentPass}
                          onChange={(e) => setPassForm({ ...passForm, currentPass: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                          placeholder="Current password"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">
                            New Admin Password
                          </label>
                          <input
                            type={showPassFormEye ? 'text' : 'password'}
                            required
                            value={passForm.newPass}
                            onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type={showPassFormEye ? 'text' : 'password'}
                            required
                            value={passForm.confirmPass}
                            onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setShowPassFormEye(!showPassFormEye)}
                          className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {showPassFormEye ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPassFormEye ? 'Hide Characters' : 'Show Characters'}</span>
                        </button>

                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Update Password</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
            {isAdminLoggedIn ? (
              <>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={logoutAdmin}
                    className="px-3.5 py-2 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock / Logout</span>
                  </button>

                  <button
                    onClick={handleSaveAll}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full text-right text-[11px] font-mono text-slate-500">
                Visitor View Mode • Sign in with Google as Vedant Bhagat to edit
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
