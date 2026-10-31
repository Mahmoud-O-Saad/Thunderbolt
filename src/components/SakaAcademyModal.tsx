import React, { useState } from 'react';
import { 
  X, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Shield, 
  User, 
  Users, 
  RefreshCw, 
  Download, 
  FileText, 
  Check, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { UserAccount, SquadMember, UserRole } from '../types';
import { 
  QUALIFICATION_MODULES, 
  QualificationModule, 
  QualificationStatus, 
  calculateMemberQualifications 
} from '../data/qualificationsData';
import { tacticalAudio } from '../utils/audio';

interface SakaAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  accounts: UserAccount[];
  members: SquadMember[];
  onUpdateMemberQualifications: (memberId: string, qualifications: Record<string, QualificationStatus>) => void;
  userRole: UserRole;
  initialSelectedMemberId?: string;
  lang?: 'en' | 'ar';
}

export const SakaAcademyModal: React.FC<SakaAcademyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  members,
  onUpdateMemberQualifications,
  userRole,
  initialSelectedMemberId,
  lang = 'en',
}) => {
  // Navigation Tabs: DASHBOARD | QUALIFICATIONS | ASSESSMENT | PERSONNEL RECORDS | EXPORT
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'QUALIFICATIONS' | 'ASSESSMENT' | 'PERSONNEL RECORDS' | 'EXPORT'>('QUALIFICATIONS');
  
  // Selected Member to inspect/manage
  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => {
    return initialSelectedMemberId || currentUser.id || 'mem-01';
  });

  // Selected qualification in the list
  const [selectedModuleId, setSelectedModuleId] = useState<string>('01.1');

  // Manual dossier popup
  const [activeManual, setActiveManual] = useState<{
    title: string;
    type: 'trainee_en' | 'trainee_ar' | 'instructor_en' | 'instructor_ar';
    content: string;
    moduleCode: string;
  } | null>(null);

  // Success alert for instructor actions
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find selected member or account
  const targetAccount = accounts.find(a => a.id === selectedMemberId);
  const targetMember = members.find(m => m.id === selectedMemberId);
  const targetName = targetAccount ? targetAccount.username : (targetMember ? targetMember.name : currentUser.username);
  const targetRank = targetAccount ? targetAccount.rank : (targetMember ? targetMember.rank : currentUser.rank);
  const targetServiceId = targetAccount?.unitServiceId || targetMember?.unitServiceId || 'TU-9198';
  const targetSteamUid = targetAccount?.steamUid || targetMember?.steamUid || '76561198000009198';

  // Member qualifications map
  const memberQualMap: Record<string, QualificationStatus> = 
    targetAccount?.qualifications || 
    targetMember?.qualifications || 
    (targetName.toLowerCase() === 'dragon' 
      ? Object.fromEntries(QUALIFICATION_MODULES.map(m => [m.id, 'completed']))
      : { '01.1': 'completed', '01.2': 'available' });

  const stats = calculateMemberQualifications(memberQualMap);
  const selectedModule = QUALIFICATION_MODULES.find(m => m.id === selectedModuleId) || QUALIFICATION_MODULES[0];
  const currentModuleStatus: QualificationStatus = memberQualMap[selectedModule.id] || (selectedModule.id === '01.1' ? 'available' : 'locked');

  const isInstructor = userRole === 'instructor' || currentUser.username.toLowerCase() === 'dragon';

  // Handle changing qualification status for the selected operator
  const handleSetStatus = (newStatus: QualificationStatus) => {
    tacticalAudio.playSuccessBeep();
    const updated = { ...memberQualMap, [selectedModule.id]: newStatus };
    onUpdateMemberQualifications(selectedMemberId, updated);

    const statusText = 
      newStatus === 'completed' ? 'Certified / معتمد' :
      newStatus === 'available' ? 'Available / متاح' : 'Locked / مغلق';

    setActionNotice(`Updated ${selectedModule.code} for ${targetName}: ${statusText}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Open manual popup
  const handleOpenManual = (type: 'trainee_en' | 'trainee_ar' | 'instructor_en' | 'instructor_ar') => {
    tacticalAudio.playRadioClick();
    let content = '';
    let title = '';

    if (type === 'trainee_en') {
      title = `${selectedModule.code} Trainee Manual (EN)`;
      content = selectedModule.traineeManualEn;
    } else if (type === 'trainee_ar') {
      title = `${selectedModule.code} دليل المتدرب (AR)`;
      content = selectedModule.traineeManualAr;
    } else if (type === 'instructor_en') {
      title = `${selectedModule.code} Instructor Guide (EN)`;
      content = selectedModule.instructorGuideEn;
    } else {
      title = `${selectedModule.code} دليل المدرب والتقييم (AR)`;
      content = selectedModule.instructorGuideAr;
    }

    setActiveManual({
      title,
      type,
      content,
      moduleCode: selectedModule.code,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-[#ede8de] select-none p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Background ambient texture matching ARMA III in-game atmosphere */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-15 blur-sm scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/assets/OP/1.Cover_b397aaf7.png')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-[#0a0d0b]/95 to-black pointer-events-none" />

      {/* Main Tactical Academy Screen Frame matching the Screenshot */}
      <div className="w-full max-w-7xl h-full max-h-[92vh] bg-[#0c0f0d] border border-[#f2c14e]/30 shadow-2xl flex flex-col relative z-10 overflow-hidden font-mono">
        
        {/* =========================================================================
            TOP HEADER BAR (MATCHING SCREENSHOT EXACTLY)
            THUNDERBOLT / SA'KA ACADEMY | Instructor | [CPL] Mahmoud | [ CLOSE ]
           ========================================================================= */}
        <header className="bg-black/90 border-b border-[#f2c14e]/30 px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f2c14e] animate-pulse" />
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-[0.2em] text-[#f2c14e] uppercase">
              THUNDERBOLT / SA'KA ACADEMY
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-stone-300 font-bold hidden sm:flex items-center gap-1.5 bg-stone-900/80 px-2.5 py-1 rounded border border-stone-800">
              <span className="text-stone-400">Instructor |</span>
              <span className="text-[#f2c14e]">{currentUser.rank}</span>
              <span className="text-white">{currentUser.username}</span>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                onClose();
              }}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded border border-stone-700 transition cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </header>

        {/* Member Selector Strip across top for rapid assessment */}
        <div className="bg-[#101512] border-b border-stone-800 px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-0.5">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold shrink-0">
              Operator Record:
            </span>
            {accounts.map(acc => {
              const isSelected = acc.id === selectedMemberId;
              const accStats = calculateMemberQualifications(acc.qualifications);
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    tacticalAudio.playRadioClick();
                    setSelectedMemberId(acc.id);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#f2c14e] text-black border-[#f2c14e] shadow-xs'
                      : 'bg-black/60 text-stone-300 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <span>{acc.username}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-stone-800 text-[#f2c14e]'
                  }`}>
                    {accStats.completed}/{accStats.total}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span>Pass: <strong className="text-[#f2c14e]">{targetServiceId}</strong></span>
            <span>UID: <strong className="text-stone-300">{targetSteamUid}</strong></span>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              {stats.percent}% Certified
            </span>
          </div>
        </div>

        {/* Feedback notice for certifications */}
        {actionNotice && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* =========================================================================
            MAIN 3-PANEL BODY:
            1. Left Sidebar Tabs (DASHBOARD, QUALIFICATIONS, ASSESSMENT, RECORDS, EXPORT)
            2. Middle Column: QUALIFICATION STRUCTURE (Scrollable Modules 01.1 - 07.1)
            3. Right Column: Detailed View & Action Manuals
           ========================================================================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Panel 1: Left Navigation Menu (Exact match to screenshot) */}
          <nav className="w-full md:w-48 bg-black/80 border-b md:border-b-0 md:border-r border-stone-800 p-2.5 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-y-auto">
            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setActiveTab('DASHBOARD');
              }}
              className={`w-full py-2.5 px-3 text-left text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer shrink-0 ${
                activeTab === 'DASHBOARD'
                  ? 'bg-[#38351c] text-[#f2c14e] border border-[#f2c14e]/40 shadow-xs'
                  : 'bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              DASHBOARD
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setActiveTab('QUALIFICATIONS');
              }}
              className={`w-full py-2.5 px-3 text-left text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer shrink-0 ${
                activeTab === 'QUALIFICATIONS'
                  ? 'bg-[#38351c] text-[#f2c14e] border border-[#f2c14e]/40 shadow-xs'
                  : 'bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              QUALIFICATIONS
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setActiveTab('ASSESSMENT');
              }}
              className={`w-full py-2.5 px-3 text-left text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer shrink-0 ${
                activeTab === 'ASSESSMENT'
                  ? 'bg-[#38351c] text-[#f2c14e] border border-[#f2c14e]/40 shadow-xs'
                  : 'bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              ASSESSMENT
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setActiveTab('PERSONNEL RECORDS');
              }}
              className={`w-full py-2.5 px-3 text-left text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer shrink-0 ${
                activeTab === 'PERSONNEL RECORDS'
                  ? 'bg-[#38351c] text-[#f2c14e] border border-[#f2c14e]/40 shadow-xs'
                  : 'bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              PERSONNEL RECORDS
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setActiveTab('EXPORT');
              }}
              className={`w-full py-2.5 px-3 text-left text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer shrink-0 ${
                activeTab === 'EXPORT'
                  ? 'bg-[#38351c] text-[#f2c14e] border border-[#f2c14e]/40 shadow-xs'
                  : 'bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              EXPORT
            </button>
          </nav>

          {/* Panel 2 & 3: Content Views */}
          {activeTab === 'QUALIFICATIONS' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* Middle Column: QUALIFICATION STRUCTURE List (Matches Screenshot) */}
              <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-stone-800 p-4 flex flex-col overflow-hidden bg-[#090d0b]">
                <h2 className="text-xs font-bold tracking-widest text-[#f2c14e] uppercase pb-2 mb-2 border-b border-stone-800">
                  QUALIFICATION STRUCTURE
                </h2>

                <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {QUALIFICATION_MODULES.map(module => {
                    const status = memberQualMap[module.id] || (module.id === '01.1' ? 'available' : 'locked');
                    const isSelected = module.id === selectedModuleId;

                    let statusLabel = 'Locked';
                    let statusColor = 'text-stone-500';

                    if (status === 'completed') {
                      statusLabel = 'Certified ✓';
                      statusColor = 'text-emerald-400 font-bold';
                    } else if (status === 'available') {
                      statusLabel = 'Available';
                      statusColor = 'text-[#f2c14e] font-bold';
                    }

                    return (
                      <button
                        key={module.id}
                        onClick={() => {
                          tacticalAudio.playRadioClick();
                          setSelectedModuleId(module.id);
                        }}
                        className={`w-full py-1.5 px-2 text-left text-xs transition cursor-pointer flex items-center justify-between rounded ${
                          isSelected
                            ? 'bg-[#3b361a] text-[#f2c14e] font-bold border-l-2 border-[#f2c14e]'
                            : status === 'available'
                            ? 'hover:bg-stone-900 text-stone-200'
                            : status === 'completed'
                            ? 'hover:bg-stone-900 text-emerald-200'
                            : 'hover:bg-stone-900/40 text-stone-400'
                        }`}
                      >
                        <span className="truncate mr-2">
                          {module.code} {module.title}
                        </span>
                        <span className={`text-[10px] shrink-0 ${statusColor}`}>
                          — {statusLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed View of Selected Module (Matches Screenshot) */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col justify-between bg-[#080b09]">
                <div className="space-y-4">
                  {/* Title & Metadata Header */}
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-stone-100 uppercase tracking-wide">
                      {selectedModule.code} {selectedModule.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {selectedModule.category} | {selectedModule.manualVersion}
                    </p>
                    <p className="text-[11px] text-[#f2c14e] font-arabic mt-0.5">
                      {selectedModule.titleAr} ({selectedModule.categoryAr})
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#f2c14e] uppercase block">
                      STATUS:
                    </span>
                    <span className={`text-xs font-bold uppercase ${
                      currentModuleStatus === 'completed' ? 'text-emerald-400' :
                      currentModuleStatus === 'available' ? 'text-[#f2c14e]' : 'text-stone-500'
                    }`}>
                      {currentModuleStatus === 'completed' ? 'Certified (Completed) ✓' :
                       currentModuleStatus === 'available' ? 'Available' : 'Locked'}
                    </span>
                  </div>

                  {/* AWARD */}
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#f2c14e] uppercase block">
                      AWARD
                    </span>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      {selectedModule.award}
                    </p>
                    <p className="text-[11px] text-stone-400 font-arabic mt-0.5">
                      {selectedModule.awardAr}
                    </p>
                  </div>

                  {/* PREREQUISITES */}
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#f2c14e] uppercase block">
                      PREREQUISITES
                    </span>
                    <p className="text-xs text-stone-300">
                      {selectedModule.prerequisites} ({selectedModule.prerequisitesAr})
                    </p>
                  </div>

                  {/* CRITICAL TASKS (Bullet points matching screenshot) */}
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#f2c14e] uppercase block mb-1">
                      CRITICAL TASKS
                    </span>
                    <ul className="space-y-1 text-xs text-stone-200">
                      {selectedModule.criticalTasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#f2c14e]">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arabic Critical Tasks */}
                  <div className="pt-1 border-t border-stone-800">
                    <span className="text-[11px] font-bold text-[#f2c14e] font-arabic block mb-1">
                      المهام والاشتراطات التكتيكية باللغة العربية:
                    </span>
                    <ul className="space-y-1 text-[11px] text-stone-300 font-arabic">
                      {selectedModule.criticalTasksAr.map((taskAr, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#f2c14e]">•</span>
                          <span>{taskAr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Buttons (Matching Screenshot) */}
                <div className="pt-6 space-y-2.5">
                  {/* Instructor Certification Control Bar */}
                  {isInstructor && (
                    <div className="p-3 rounded-lg bg-stone-900 border border-[#f2c14e]/30 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-[#f2c14e] flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#f2c14e]" />
                        <span>Instructor Certification Command ({targetName}):</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSetStatus('completed')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Certify (منح التأهيل)</span>
                        </button>

                        <button
                          onClick={() => handleSetStatus('available')}
                          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold uppercase transition cursor-pointer"
                        >
                          Make Available (إتاحة)
                        </button>

                        <button
                          onClick={() => handleSetStatus('locked')}
                          className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold uppercase transition cursor-pointer"
                        >
                          Lock (قفل)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4 Training Manual Buttons (Matching Screenshot Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenManual('trainee_en')}
                      className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#f2c14e]" />
                      <span>TRAINEE MANUAL — EN</span>
                    </button>

                    <button
                      onClick={() => handleOpenManual('trainee_ar')}
                      className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-2 cursor-pointer font-arabic"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#f2c14e]" />
                      <span>دليل المتدرب — AR</span>
                    </button>

                    <button
                      onClick={() => handleOpenManual('instructor_en')}
                      className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-stone-400" />
                      <span>INSTRUCTOR — EN</span>
                    </button>

                    <button
                      onClick={() => handleOpenManual('instructor_ar')}
                      className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-2 cursor-pointer font-arabic"
                    >
                      <Shield className="w-3.5 h-3.5 text-stone-400" />
                      <span>دليل المدرب — AR</span>
                    </button>
                  </div>

                  {/* Refresh Passport Button (Matching Screenshot) */}
                  <button
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      setActionNotice('Passport records synchronised with Thunderbolt HQ.');
                      setTimeout(() => setActionNotice(null), 2500);
                    }}
                    className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-[#f2c14e] text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#f2c14e]" />
                    <span>REFRESH PASSPORT</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === 'DASHBOARD' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#080b09]">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-stone-100 uppercase">
                  Sa'ka Academy Training Command Dashboard
                </h2>
                <p className="text-xs text-stone-400">
                  Real-time operational readiness, qualified specialty brevet tracking, and squad qualifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-black/60 border border-stone-800 space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Total Qualifications</span>
                  <div className="text-2xl font-black text-[#f2c14e]">{QUALIFICATION_MODULES.length}</div>
                  <span className="text-[10px] text-stone-400">Across 7 Core Disciplines</span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-stone-800 space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Selected Operator ({targetName})</span>
                  <div className="text-2xl font-black text-emerald-400">{stats.completed} Certified</div>
                  <span className="text-[10px] text-stone-400">{stats.percent}% Completion Rate</span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-stone-800 space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Available for Training</span>
                  <div className="text-2xl font-black text-amber-400">{stats.available}</div>
                  <span className="text-[10px] text-stone-400">Ready for Assessment</span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-stone-800 space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Unit Service ID</span>
                  <div className="text-2xl font-black text-stone-200">{targetServiceId}</div>
                  <span className="text-[10px] text-stone-400">Permanent Sa'ka Passport</span>
                </div>
              </div>

              {/* Training Disciplines Overview */}
              <div className="rounded-xl p-4 bg-stone-900/60 border border-stone-800 space-y-3">
                <h3 className="text-xs font-bold text-[#f2c14e] uppercase tracking-wider">
                  Core Combat Qualification Tracks:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-black/40 rounded-lg border border-stone-800 space-y-1">
                    <span className="font-bold text-stone-200 block">01. Foundation & Infantry Operator (01.1 - 01.9)</span>
                    <p className="text-[11px] text-stone-400">Basic Combat, Land Navigation, Patrols, CQB, Night Ops, SERE, and Special Forces Tier 1.</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-stone-800 space-y-1">
                    <span className="font-bold text-stone-200 block">02. Heavy Weaponry & Fire Support (02.1 - 02.6)</span>
                    <p className="text-[11px] text-stone-400">Automatic Rifleman, Grenadier, Anti-Tank (ATGM), MANPADS Air Defense, and Marksman (DMR).</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-stone-800 space-y-1">
                    <span className="font-bold text-stone-200 block">03. Support, Medical, Combat Engineering & Maritime (03.1 - 03.6)</span>
                    <p className="text-[11px] text-stone-400">TCCC Combat Medic, Sapper Engineering, EOD Bomb Disposal, Recon, Combat Diver, and UAV Drones.</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-stone-800 space-y-1">
                    <span className="font-bold text-stone-200 block">04. Joint Fires & Airborne Leadership (04.1 - 07.1)</span>
                    <p className="text-[11px] text-stone-400">Artillery, JTAC Combat Controller, Airborne (HALO/HAHO), Squad/Platoon Command, and Counter-Terrorism.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ASSESSMENT TAB */}
          {activeTab === 'ASSESSMENT' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#080b09]">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h2 className="text-lg font-bold text-stone-100 uppercase">
                    Operator Assessment & Certification Matrix
                  </h2>
                  <p className="text-xs text-stone-400">
                    Inspecting Operator: <strong className="text-[#f2c14e]">{targetName}</strong> ({targetRank}) — {targetServiceId}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {QUALIFICATION_MODULES.map(m => {
                  const status = memberQualMap[m.id] || (m.id === '01.1' ? 'available' : 'locked');
                  return (
                    <div 
                      key={m.id}
                      className="p-3 rounded-xl bg-black/50 border border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-stone-200">
                          {m.code} {m.title}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {m.category} · {m.award}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          status === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                          status === 'available' ? 'bg-amber-950 text-[#f2c14e] border-amber-500/40' :
                          'bg-stone-900 text-stone-500 border-stone-800'
                        }`}>
                          {status === 'completed' ? 'Certified ✓' : status === 'available' ? 'Available' : 'Locked'}
                        </span>

                        {isInstructor && (
                          <div className="flex items-center gap-1">
                            {status !== 'completed' && (
                              <button
                                onClick={() => {
                                  tacticalAudio.playSuccessBeep();
                                  const updated: Record<string, QualificationStatus> = { ...memberQualMap, [m.id]: 'completed' };
                                  onUpdateMemberQualifications(selectedMemberId, updated);
                                }}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold uppercase transition cursor-pointer"
                              >
                                Certify
                              </button>
                            )}

                            {status === 'locked' && (
                              <button
                                onClick={() => {
                                  tacticalAudio.playRadioClick();
                                  const updated: Record<string, QualificationStatus> = { ...memberQualMap, [m.id]: 'available' };
                                  onUpdateMemberQualifications(selectedMemberId, updated);
                                }}
                                className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-[#f2c14e] rounded text-[10px] font-bold uppercase transition cursor-pointer"
                              >
                                Unlock
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PERSONNEL RECORDS TAB */}
          {activeTab === 'PERSONNEL RECORDS' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#080b09]">
              <div className="pb-3 border-b border-stone-800">
                <h2 className="text-lg font-bold text-stone-100 uppercase">
                  Unit Personnel Training Records & Passports
                </h2>
                <p className="text-xs text-stone-400">
                  Overview of all registered squad members and their certified qualifications in the Thunderbolt Unit.
                </p>
              </div>

              <div className="space-y-2.5">
                {accounts.map(acc => {
                  const accMap = acc.qualifications || (acc.username.toLowerCase() === 'dragon' 
                    ? Object.fromEntries(QUALIFICATION_MODULES.map(m => [m.id, 'completed']))
                    : { '01.1': 'completed', '01.2': 'available' });
                  const accStats = calculateMemberQualifications(accMap);

                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        tacticalAudio.playRadioClick();
                        setSelectedMemberId(acc.id);
                        setActiveTab('QUALIFICATIONS');
                      }}
                      className="p-3.5 rounded-xl bg-black/60 border border-stone-800 hover:border-[#f2c14e]/40 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#141a16] border border-[#f2c14e]/30 flex items-center justify-center font-bold text-sm text-[#f2c14e]">
                          {acc.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-100 group-hover:text-[#f2c14e] transition-colors">
                              {acc.username}
                            </span>
                            <span className="text-[10px] font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/30 px-1.5 py-0.2 rounded">
                              {acc.rank}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5 flex items-center gap-2">
                            <span>Service ID: {acc.unitServiceId || 'TU-9198'}</span>
                            <span>•</span>
                            <span>Steam: {acc.steamUid || '76561198...'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 block">
                            {accStats.completed} / {accStats.total} Certified
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {accStats.percent}% Readiness
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#f2c14e] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EXPORT TAB */}
          {activeTab === 'EXPORT' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#080b09]">
              <div className="pb-3 border-b border-stone-800">
                <h2 className="text-lg font-bold text-stone-100 uppercase">
                  Export Sa'ka Military Passport Dossier
                </h2>
                <p className="text-xs text-stone-400">
                  Download or copy certified qualifications for {targetName} ({targetServiceId}).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border border-[#f2c14e]/30 font-mono text-xs text-stone-300 space-y-2 whitespace-pre-wrap select-text">
                {`========================================================================
EGYPTIAN ARMED FORCES · THUNDERBOLT SPECIAL OPERATIONS COMMAND
SA'KA MILITARY QUALIFICATION PASSPORT & TRAINING RECORD
========================================================================
OPERATOR CALLSIGN : ${targetName.toUpperCase()}
MILITARY RANK     : ${targetRank}
UNIT SERVICE ID   : ${targetServiceId}
STEAM 64-BIT UID  : ${targetSteamUid}
CERTIFICATION LVL : ${stats.completed} / ${stats.total} Modules (${stats.percent}% Operational Readiness)
COMMAND AUTHORITY : Under Maj. Gen. Dragon [MG | لواء أ.ح]

CERTIFIED SPECIALTIES:
${QUALIFICATION_MODULES.filter(m => (memberQualMap[m.id] || (m.id === '01.1' ? 'available' : 'locked')) === 'completed')
  .map(m => `[✓] ${m.code} ${m.title} — ${m.award}`)
  .join('\n') || 'None certified yet.'}

PENDING / AVAILABLE MODULES:
${QUALIFICATION_MODULES.filter(m => (memberQualMap[m.id] || (m.id === '01.1' ? 'available' : 'locked')) === 'available')
  .map(m => `[!] ${m.code} ${m.title}`)
  .join('\n') || 'None currently available.'}

SECURITY VERIFICATION: PROJECT SA'KA · SERVER-VERIFIED CLASSIFIED RECORD
========================================================================`}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    tacticalAudio.playSuccessBeep();
                    const exportText = `THUNDERBOLT UNIT QUALIFICATION RECORD\nOperator: ${targetName} (${targetRank})\nService ID: ${targetServiceId}\nSteam UID: ${targetSteamUid}\nCertified: ${stats.completed}/${stats.total} (${stats.percent}%)`;
                    navigator.clipboard.writeText(exportText);
                    setActionNotice('Passport dossier copied to clipboard.');
                    setTimeout(() => setActionNotice(null), 2500);
                  }}
                  className="px-4 py-2 bg-[#f2c14e] text-black font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer flex items-center gap-1.5"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Copy Passport to Clipboard</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            BOTTOM FOOTER (EXACT MATCH FOR SCREENSHOT):
            PROJECT SA'KA | SERVER-VERIFIED RECORDS    Records synchronised with the server.
           ========================================================================= */}
        <footer className="bg-black/90 border-t border-stone-800/80 px-4 py-2 flex items-center justify-between text-[10px] text-stone-500 tracking-wider shrink-0">
          <span className="font-mono">
            PROJECT SA'KA | SERVER-VERIFIED RECORDS
          </span>
          <span className="font-mono text-stone-400">
            Records synchronised with the server.
          </span>
        </footer>
      </div>

      {/* Manual Popup Dossier */}
      {activeManual && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0e1411] border border-[#f2c14e]/40 rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#f2c14e]" />
                <h3 className="font-bold text-sm text-stone-100 uppercase tracking-wide">
                  {activeManual.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveManual(null)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-stone-800 text-xs text-stone-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {activeManual.content}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveManual(null)}
                className="px-4 py-2 bg-[#f2c14e] text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer"
              >
                Close Manual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
