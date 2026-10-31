import React, { useState } from 'react';
import { Mission, SquadMember, BroadcastNotification, UserRole, UserAccount, MissionAttendanceStatus } from '../types';
import { 
  Radio, 
  Archive as ArchiveIcon, 
  User as UserIcon, 
  Bell, 
  CheckCircle, 
  CheckCircle2,
  ChevronRight, 
  ArrowLeft, 
  Play, 
  Square, 
  Users, 
  Plus, 
  Shield, 
  Zap, 
  Volume2, 
  VolumeX, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  Info, 
  ExternalLink,
  Lock,
  Award,
  UserPlus,
  BadgeCheck,
  UserX,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Upload,
  Image as ImageIcon,
  FileAudio,
  Trash2,
  Crosshair,
  Copy,
  ChevronsUpDown,
  RotateCw,
  LogOut,
  BookOpen
} from 'lucide-react';
import { tacticalAudio, speakBriefing, stopBriefing, stopAllAudio, playAudioUrl, sendBrowserNotification } from '../utils/audio';
import { SignUpModal } from './SignUpModal';
import { AccountSwitcherModal } from './AccountSwitcherModal';
import { LeaderApprovalModal } from './LeaderApprovalModal';
import { DiscordMemberHub } from './DiscordMemberHub';
import { SakaAcademyModal } from './SakaAcademyModal';
import { calculateMemberQualifications, QualificationStatus } from '../data/qualificationsData';
import { AVAILABLE_RANKS, isCommandRank, isStaffRank, getRoleTitle } from '../data/initialData';

interface ThunderboltAppProps {
  missions: Mission[];
  members: SquadMember[];
  notifications: BroadcastNotification[];
  onDispatchMission: (newMission: Mission) => void;
  onBroadcastAlert: (mission: Mission) => void;
  onToggleAcknowledge: (missionId: string) => void;
  onUpdateAttendance?: (missionId: string, memberId: string, status: MissionAttendanceStatus) => void;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onShowSplash: () => void;
  userRole: UserRole;
  onSetUserRole: (role: UserRole) => void;
  currentUser: UserAccount;
  onUpdateUserAccount: (account: UserAccount) => void;
  accounts?: UserAccount[];
  onAddAccount?: (account: UserAccount, autoSwitch?: boolean) => void;
  onSwitchAccount?: (account: UserAccount) => void;
  onDeleteAccount?: (accountId: string) => void;
  onApproveAccount?: (accountId: string, assignedRank: string) => void;
  onRejectAccount?: (accountId: string) => void;
  onUpdateMemberRank?: (accountId: string, newRank: string) => void;
  onLogout?: () => void;
  onUpdateMemberQualifications?: (memberId: string, qualifications: Record<string, QualificationStatus>) => void;
}

export type WhackaThunderboltAppProps = ThunderboltAppProps;

export const ThunderboltApp: React.FC<ThunderboltAppProps> = ({
  missions,
  members,
  notifications,
  onDispatchMission,
  onBroadcastAlert,
  onToggleAcknowledge,
  onUpdateAttendance,
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
  onShowSplash,
  userRole,
  onSetUserRole,
  currentUser,
  onUpdateUserAccount,
  accounts = [],
  onAddAccount,
  onSwitchAccount,
  onDeleteAccount,
  onApproveAccount,
  onRejectAccount,
  onUpdateMemberRank,
  onLogout,
  onUpdateMemberQualifications,
}) => {
  // Navigation tabs: 'missions' | 'archive' | 'command' | 'account'
  const [activeTab, setActiveTab] = useState<'missions' | 'archive' | 'command' | 'account'>('missions');
  const [viewingMissionId, setViewingMissionId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  
  // Command Room States (Screenshot 2_a1e58b5b.PNG)
  const [selfSignUpEnabled, setSelfSignUpEnabled] = useState<boolean>(true);
  const [copiedJoinLink, setCopiedJoinLink] = useState<boolean>(false);
  const [copiedServiceId, setCopiedServiceId] = useState<boolean>(false);
  const [testNotifSent, setTestNotifSent] = useState<boolean>(false);
  const [isEditingSteamUid, setIsEditingSteamUid] = useState<boolean>(false);
  const [steamUidInput, setSteamUidInput] = useState<string>(currentUser.steamUid || '76561198000009198');
  const [showRankChangeDropdown, setShowRankChangeDropdown] = useState<boolean>(false);

  // Toggle between showing the featured mission vs empty state (to allow testing both)
  const [forceEmptyState, setForceEmptyState] = useState<boolean>(false);
  const [showCoverModal, setShowCoverModal] = useState<boolean>(false);

  // Sign up modal & Multi-Account Switcher states
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [signUpInitialRole, setSignUpInitialRole] = useState<UserRole>('member');
  const [showAccountSwitcher, setShowAccountSwitcher] = useState<boolean>(false);
  const [signUpSuccessNotice, setSignUpSuccessNotice] = useState<string | null>(null);
  const [copiedDiscord, setCopiedDiscord] = useState<boolean>(false);

  // Leader Clearance & Rank Management modal states
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [preselectedEditMemberId, setPreselectedEditMemberId] = useState<string | undefined>(undefined);

  const pendingAccounts = accounts.filter(a => a.approvalStatus === 'pending');

  // New mission form fields
  const [newTitle, setNewTitle] = useState('Operation Flash Thunder');
  const [newDate, setNewDate] = useState('2026-10-22');
  const [newDay, setNewDay] = useState('Thursday');
  const [newTime, setNewTime] = useState('06:00 UTC+2');
  const [newLocation, setNewLocation] = useState('Sector G14-H18 (Northern Ridge Outpost)');
  const [newDiscordLink, setNewDiscordLink] = useState('https://discord.gg/thunderbolt-ops');
  const [newBriefing, setNewBriefing] = useState(
    'Attention Thunderbolt Unit operators. Under direct command of Maj. Gen. dragon, Operation Flash Thunder commences Thursday, 22/10/2026. Infiltrate observation point Echo-4 before dawn, neutralize rogue radar surveillance, and secure supply corridor Bravo.'
  );
  const [newImageUrl, setNewImageUrl] = useState<string>('/src/assets/images/tactical_operations_map_1792663265618.jpg');
  const [newImageFileName, setNewImageFileName] = useState<string>('sat_recon_map.jpg');
  const [newAudioUrl, setNewAudioUrl] = useState<string>('');
  const [newAudioFileName, setNewAudioFileName] = useState<string>('');
  const [modalAudioPlaying, setModalAudioPlaying] = useState<boolean>(false);
  const [accountRankFilter, setAccountRankFilter] = useState<'all' | 'command' | 'staff'>('all');
  const stopAudioRef = React.useRef<(() => void) | null>(null);

  // Sa'ka Academy Modal state
  const [showAcademyModal, setShowAcademyModal] = useState<boolean>(false);
  const [academySelectedMemberId, setAcademySelectedMemberId] = useState<string | undefined>(undefined);

  const handleOpenAcademy = (memberId?: string) => {
    tacticalAudio.playRadioClick();
    setAcademySelectedMemberId(memberId || currentUser.id);
    setShowAcademyModal(true);
  };

  const handleUpdateQualifications = (memberId: string, quals: Record<string, QualificationStatus>) => {
    if (onUpdateMemberQualifications) {
      onUpdateMemberQualifications(memberId, quals);
    } else {
      const targetAcc = accounts.find(a => a.id === memberId);
      if (targetAcc) {
        onUpdateUserAccount({ ...targetAcc, qualifications: quals });
      }
    }
  };

  const userAcademyStats = calculateMemberQualifications(currentUser.qualifications);

  const handleSignUpComplete = (newAccount: UserAccount) => {
    if (onAddAccount) {
      onAddAccount(newAccount, true);
    } else {
      onUpdateUserAccount(newAccount);
    }
    const roleLabel = newAccount.role === 'instructor' ? 'Leader (Commander)' : 'Member (Squad Operator)';
    if (newAccount.approvalStatus === 'pending') {
      setSignUpSuccessNotice(`Recruit application for "${newAccount.username}" has been submitted to Maj. Gen. Dragon for verification and rank commissioning.`);
    } else {
      setSignUpSuccessNotice(`Account commissioned successfully! Operator: "${newAccount.username}" — Rank: "${newAccount.rank}" (${roleLabel})`);
    }
    setTimeout(() => {
      setSignUpSuccessNotice(null);
    }, 6000);
  };

  const featuredMission = missions.find(m => m.date === '2026-10-22') || missions[0];
  const activeMission = viewingMissionId ? missions.find(m => m.id === viewingMissionId) : featuredMission;

  const handleAudioToggle = () => {
    if (!activeMission) return;
    if (isPlayingAudio) {
      if (stopAudioRef.current) {
        stopAudioRef.current();
        stopAudioRef.current = null;
      }
      stopAllAudio();
      setIsPlayingAudio(false);
    } else {
      tacticalAudio.playRadioClick();
      setIsPlayingAudio(true);
      if (activeMission.audioUrl) {
        const stopFn = playAudioUrl(activeMission.audioUrl, () => {
          setIsPlayingAudio(false);
          stopAudioRef.current = null;
        });
        stopAudioRef.current = stopFn;
      } else {
        const textToRead = `${activeMission.title}. Under the command of Maj. Gen. dragon. Date of operation: ${activeMission.dayName}, ${activeMission.date} at ${activeMission.time}. Location: ${activeMission.targetSector}. ${activeMission.briefingOverview || activeMission.summary}`;
        speakBriefing(textToRead, () => setIsPlayingAudio(false));
      }
    }
  };

  const handleCreateMissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'instructor') {
      tacticalAudio.playRadioClick();
      alert('Access Restricted: Only authorized Thunderbolt Unit Instructors can dispatch missions.');
      return;
    }
    if (!newTitle.trim()) return;

    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    stopAllAudio();

    const created: Mission = {
      id: `msn-${Date.now()}`,
      codeName: newTitle.toUpperCase(),
      title: newTitle,
      date: newDate,
      dayName: newDay,
      time: newTime,
      targetSector: newLocation,
      coordinates: "32°14'08\"N 31°22'45\"E",
      priority: 'CRITICAL',
      status: 'ACTIVE',
      commander: 'Maj. Gen. dragon',
      summary: newBriefing.slice(0, 140) + '...',
      briefingOverview: newBriefing,
      rulesOfEngagement: 'ROE Level 2: Strict target identification authorized.',
      weatherConditions: 'Clear early morning conditions, wind NE 10 knots.',
      assignedSquad: members.map(m => m.id),
      equipmentList: ['Night-Vision Goggles Gen IV', 'Tactical Radios', 'Suppressed Carbines'],
      imageUrl: newImageUrl || undefined,
      imageFileName: newImageFileName || undefined,
      audioUrl: newAudioUrl || undefined,
      audioFileName: newAudioFileName || undefined,
      objectives: [
        { id: 'obj-1', text: 'Secure perimeter before 06:15 hours', completed: false },
        { id: 'obj-2', text: 'Transmit encrypted verification back to Dragon command', completed: false },
      ],
      broadcastCount: 1,
      lastBroadcastTime: 'Just now',
      discordUrl: newDiscordLink.trim() || 'https://discord.gg/thunderbolt-ops',
    };

    onDispatchMission(created);
    setShowPostModal(false);
    setViewingMissionId(created.id);
  };

  const handleSendTestNotification = () => {
    tacticalAudio.playTacticalAlert();
    setTestNotifSent(true);
    sendBrowserNotification('⚡ Thunderbolt Unit: Test Mission Alert', {
      body: 'Mission dispatch active. Under the command of Maj. Gen. dragon.',
    });
    if (featuredMission) {
      onBroadcastAlert(featuredMission);
    }
    setTimeout(() => {
      setTestNotifSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#060807] text-[#ede8de] flex justify-center selection:bg-[#f2c14e] selection:text-black font-sans relative overflow-x-hidden">
      {/* Outer ambient desktop cover background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-25 blur-md scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/assets/OP/1.Cover_b397aaf7.png')` }}
      />
      <div className="fixed inset-0 bg-black/60 pointer-events-none" />

      {/* Phone Canvas Container matching screenshots exactly with Cover Background */}
      <div className="w-full max-w-[420px] min-h-screen border-x border-[#1a221d] flex flex-col justify-between relative shadow-2xl z-10 overflow-hidden">
        
        {/* Cover image embedded inside phone container */}
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none opacity-20"
          style={{ backgroundImage: `url('/assets/OP/1.Cover_b397aaf7.png')` }}
        />
        {/* Tactical dark gradient overlay for optimal legibility and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d0b]/92 via-[#0a0d0b]/90 to-[#0a0d0b]/96 pointer-events-none" />
        <div className="absolute inset-0 tb-grid opacity-20 pointer-events-none" />

        {/* TOP BAR (EXACT MATCH FOR SCREENSHOTS 1, 2, 4) */}
        <header className="sticky top-0 z-40 bg-[#0a0d0b]/95 backdrop-blur border-b border-[#f2c14e]/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Eagle Emblem Ring */}
            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                onShowSplash();
              }}
              title="Show Splash Screen"
              className="relative w-9 h-9 rounded-full overflow-hidden border border-[#f2c14e]/40 shadow-inner p-0.5 bg-black cursor-pointer hover:border-[#f2c14e] transition-colors"
            >
              <img
                src="/assets/OP/3.Logo_9d28ba9d.png"
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </button>

            {/* Title & Commander Subtitle */}
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-[0.06em] text-stone-100 uppercase leading-none">
                THUNDERBOLT UNIT
              </span>
              <span className="text-[11px] text-[#b09753] font-mono mt-0.5 leading-none">
                Under the command of Maj. Gen. dragon
              </span>
            </div>
          </div>

          {/* Right Controls: LIVE badge, Sound, & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-1 text-stone-500 hover:text-[#f2c14e] transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#f2c14e]" />}
            </button>

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f2c14e]/10 border border-[#f2c14e]/25 text-[10px] font-bold text-[#f2c14e] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2c14e] animate-pulse" />
              <span>LIVE</span>
            </div>

            {onLogout && (
              <button
                onClick={() => {
                  tacticalAudio.playRadioClick();
                  onLogout();
                }}
                className="p-1 rounded text-stone-400 hover:text-red-400 hover:bg-stone-900 transition-colors cursor-pointer"
                title="Log Out / تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </header>

        {/* Operator Identity Ribbon & Quick Client / Account Switcher Access */}
        <div className="bg-[#0f1411]/90 backdrop-blur-xs border-b border-[#f2c14e]/15 px-3 py-1.5 flex items-center justify-between text-xs z-30">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-xs shadow-emerald-400" />
            <span className="text-[#f2c14e] font-bold font-mono text-[11px] truncate">
              {currentUser.rank}
            </span>
            <span className="text-stone-100 font-sans font-bold text-[11px] truncate">
              {currentUser.username}
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 border ${
              isCommandRank(currentUser.rank)
                ? 'bg-[#f2c14e]/20 text-[#f2c14e] border-[#f2c14e]/40' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {isCommandRank(currentUser.rank) ? 'Command' : (userRole === 'instructor' ? 'Unit Lead' : 'Member (Operator)')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {userRole === 'instructor' && pendingAccounts.length > 0 && (
              <button
                onClick={() => {
                  tacticalAudio.playTacticalAlert();
                  setPreselectedEditMemberId(undefined);
                  setShowApprovalModal(true);
                }}
                className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-black bg-gradient-to-r from-amber-400 to-[#f2c14e] px-2 py-0.5 rounded-lg border border-[#f2c14e] shadow-sm shadow-[#f2c14e]/30 transition cursor-pointer shrink-0 animate-pulse active:scale-95"
                title="Pending recruit applications awaiting Commander commissioning"
              >
                <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                <span>{pendingAccounts.length} Pending</span>
              </button>
            )}

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setSignUpInitialRole('member');
                setShowSignUpModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black text-black bg-gradient-to-r from-amber-400 to-[#f2c14e] hover:from-[#f2c14e] hover:to-[#ffe285] px-2.5 py-1 rounded-lg border border-[#f2c14e] shadow-sm shadow-[#f2c14e]/30 transition cursor-pointer shrink-0 active:scale-95"
              title="Sign Up with Gmail or Discord"
            >
              <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sign Up / انضمام</span>
            </button>

            <button
              onClick={() => handleOpenAcademy()}
              className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#f2c14e] bg-[#f2c14e]/10 hover:bg-[#f2c14e]/20 px-2 py-0.5 rounded-lg border border-[#f2c14e]/30 transition cursor-pointer shrink-0 active:scale-95"
              title="Sa'ka Academy Qualification Record"
            >
              <Award className="w-3 h-3 text-[#f2c14e]" />
              <span>Academy</span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setShowAccountSwitcher(true);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-700 transition cursor-pointer shrink-0 active:scale-95"
              title="Switch Accounts"
            >
              <Users className="w-3 h-3 text-[#f2c14e]" />
              <span>Accounts ({accounts.length})</span>
            </button>
          </div>
        </div>

        {/* Sign up success flash banner */}
        {signUpSuccessNotice && (
          <div className="mx-3 mt-2 p-2.5 rounded-xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1 z-30 shadow-lg">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-sans text-[11px] font-medium">{signUpSuccessNotice}</span>
            </div>
            <button
              onClick={() => setSignUpSuccessNotice(null)}
              className="text-emerald-400 hover:text-white cursor-pointer px-1 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 p-4 pb-20 space-y-4 overflow-y-auto">

          {/* PERSISTENT GUEST / RECRUIT ONBOARDING BANNER */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-r from-[#171e19] via-[#1a221c] to-[#171e19] border border-[#f2c14e]/30 shadow-md flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#f2c14e]/10 border border-[#f2c14e]/30 flex items-center justify-center text-[#f2c14e] shrink-0">
                <Zap className="w-4 h-4 text-[#f2c14e]" />
              </div>
              <div>
                <span className="font-display font-bold text-xs text-stone-100 flex items-center gap-1.5">
                  <span>New Recruit? Join Thunderbolt Unit</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-[#f2c14e] font-mono font-bold">Sign Up</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono block">
                  Link with Gmail or Discord for instant radio briefings and tactical dispatch alerts
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                setSignUpInitialRole('member');
                setShowSignUpModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-mono font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sign Up with Gmail/Discord</span>
            </button>
          </div>

          {/* =========================================================================
              PENDING LEADER APPROVAL NOTICE (WHEN CURRENT USER IS PENDING CLEARANCE)
             ========================================================================= */}
          {currentUser.approvalStatus === 'pending' && (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1a1c12] via-[#242111] to-[#1a1c12] border-2 border-amber-500/60 shadow-xl space-y-3 relative overflow-hidden animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      CLEARANCE STATUS · PENDING COMMAND VERIFICATION
                    </span>
                    <h3 className="font-display text-sm font-bold text-stone-100">
                      Your Application is Pending Clearance by Maj. Gen. Dragon
                    </h3>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/40 shrink-0">
                  Pending
                </span>
              </div>

              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Your profile is registered as <strong>"{currentUser.username}"</strong>. In accordance with military chain of command, rank commissioning and access clearance are granted exclusively by Commander Maj. Gen. Dragon.
              </p>

              <div className="pt-1">
                <button
                  onClick={() => {
                    tacticalAudio.playTacticalAlert();
                    const leaderAcc = accounts.find(a => a.role === 'instructor') || accounts[0];
                    if (onSwitchAccount) onSwitchAccount(leaderAcc);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-mono font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Switch to Commander (Dragon) Profile to Approve & Commission Rank</span>
                </button>
              </div>
            </div>
          )}

          {/* REJECTED NOTICE (IF APPLICANT WAS REJECTED BY LEADER) */}
          {currentUser.approvalStatus === 'rejected' && (
            <div className="rounded-2xl p-4 bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-mono font-bold text-rose-400">
                <UserX className="w-4 h-4" />
                <span>Application Rejected by Command</span>
              </div>
              <p className="text-[11px] text-stone-300 font-sans">
                Your application to join Thunderbolt Unit was not approved for this operational rotation. You may switch to another account or contact command.
              </p>
              <button
                onClick={() => {
                  tacticalAudio.playRadioClick();
                  const leaderAcc = accounts.find(a => a.role === 'instructor') || accounts[0];
                  if (onSwitchAccount) onSwitchAccount(leaderAcc);
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 hover:text-white font-mono text-[10px]"
              >
                Switch to Commander Profile
              </button>
            </div>
          )}
          
          {/* =========================================================================
              MEMBER PERMISSION GATEWAY: DISCORD ONLY ACCESS
              Anyone who signs up (Member) has NO permission to view internal missions/archive.
              They ONLY see the official Discord Hub to register and join.
             ========================================================================= */}
          {userRole !== 'instructor' && activeTab !== 'account' && (
            <DiscordMemberHub
              currentUser={currentUser}
              activeMission={featuredMission}
              onSwitchToLeader={() => {
                const leaderAcc = accounts.find(a => a.role === 'instructor') || accounts[0];
                if (onSwitchAccount) onSwitchAccount(leaderAcc);
              }}
              onOpenAccountModal={() => setShowAccountSwitcher(true)}
            />
          )}

          {/* =========================================================================
              VIEW: DEDICATED MISSION PAGE (INSTRUCTOR / LEADER ONLY)
             ========================================================================= */}
          {userRole === 'instructor' && viewingMissionId && activeMission ? (
            <div className="space-y-4 tb-rise">
              {/* Back to Missions Button */}
              <button
                onClick={() => {
                  tacticalAudio.playRadioClick();
                  stopBriefing();
                  setViewingMissionId(null);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f2c14e] hover:bg-[#f2c14e]/90 text-black font-bold text-xs transition cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to missions</span>
              </button>

              {/* Mission Card Header */}
              <div className="rounded-2xl p-4 tb-card border border-[#f2c14e]/20 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#f2c14e] font-bold tracking-wider uppercase block">
                      {activeMission.priority} PRIORITY · {activeMission.status}
                    </span>
                    <h2 className="font-display text-xl font-bold text-stone-100 leading-snug">
                      {activeMission.title}
                    </h2>
                    <p className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                      <span>📍</span>
                      <span className="text-stone-300">{activeMission.targetSector}</span>
                    </p>
                  </div>

                  {/* Square Date Badge */}
                  <div className="shrink-0 text-center rounded-xl bg-[#f2c14e]/10 border border-[#f2c14e]/30 px-3 py-2 min-w-[58px]">
                    <span className="text-[10px] font-bold text-[#f2c14e] uppercase block">OCT</span>
                    <span className="font-display text-2xl font-black text-stone-100 tabular-nums">22</span>
                    <span className="text-[9px] text-stone-400 font-bold uppercase block">{activeMission.dayName.slice(0, 3)}</span>
                  </div>
                </div>

                {/* Mission Cover Image / Recon Photo if present */}
                {activeMission.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-[#f2c14e]/30 aspect-[16/9] w-full bg-black">
                    <img
                      src={activeMission.imageUrl}
                      alt="Mission Recon"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#f2c14e] border border-[#f2c14e]/30">
                      {activeMission.imageFileName || 'TACTICAL RECON PHOTO'}
                    </div>
                  </div>
                )}

                {/* Spoken Audio Player */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileAudio className="w-3.5 h-3.5 text-[#f2c14e] shrink-0" />
                    <span className="text-[11px] font-mono text-stone-300 truncate max-w-[200px]">
                      {activeMission.audioUrl 
                        ? (activeMission.audioFileName || 'Uploaded Vocal Briefing') 
                        : 'Audio Briefing:'}
                    </span>
                  </div>
                  <button
                    onClick={handleAudioToggle}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isPlayingAudio
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-[#f2c14e] text-black hover:bg-[#f2c14e]/90'
                    }`}
                  >
                    {isPlayingAudio ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isPlayingAudio ? 'Stop Audio' : (activeMission.audioUrl ? 'Play File' : 'Play Brief')}</span>
                  </button>
                </div>
              </div>

              {/* What this mission is (Explanation) */}
              <div className="rounded-2xl p-4 tb-card border border-[#f2c14e]/20 space-y-2">
                <span className="text-[11px] font-display uppercase tracking-widest text-[#f2c14e] font-bold block">
                  What this mission is
                </span>
                <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line font-sans">
                  {activeMission.briefingOverview || activeMission.summary}
                </p>
              </div>

              {/* Rules of Engagement */}
              <div className="rounded-2xl p-3.5 bg-black/40 border border-stone-800 text-xs font-mono space-y-1">
                <span className="text-[#f2c14e] font-bold block text-[11px]">RULES OF ENGAGEMENT:</span>
                <p className="text-stone-300 text-[11px] leading-relaxed">{activeMission.rulesOfEngagement}</p>
              </div>

              {/* =========================================================================
                  DISCORD MISSION REGISTRATION & BRIEFING HUB (NO YES & ABSENCE)
                 ========================================================================= */}
              <div className="rounded-2xl p-4 tb-card border-2 border-[#5865F2]/40 bg-[#0c101d]/90 shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5865F2]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-md shadow-[#5865F2]/30">
                      {/* Discord Logo SVG */}
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-[#5865F2] uppercase tracking-wider block">
                        DISCORD REGISTRATION LINK
                      </span>
                      <span className="text-[11px] text-stone-300 font-sans font-medium">
                        Official Mission Discord Gateway
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-[10px] font-mono font-bold text-[#5865F2]">
                    OFFICIAL
                  </span>
                </div>

                <p className="text-xs text-stone-300 font-sans leading-relaxed relative z-10">
                  Commander Dragon has assigned the official Discord channel for this mission. Join below to register and receive voice frequencies.
                </p>

                {/* Discord Link Box */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-[#5865F2]/30 flex items-center justify-between gap-2 text-xs font-mono relative z-10">
                  <div className="flex items-center gap-2 overflow-hidden text-stone-300">
                    <span className="text-[#5865F2] font-bold">LINK:</span>
                    <span className="truncate text-stone-200 underline">
                      {activeMission.discordUrl || 'https://discord.gg/thunderbolt-ops'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      navigator.clipboard.writeText(activeMission.discordUrl || 'https://discord.gg/thunderbolt-ops');
                      setCopiedDiscord(true);
                      setTimeout(() => setCopiedDiscord(false), 2500);
                    }}
                    className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-[#5865F2] hover:text-white border border-stone-700 text-stone-300 text-[10px] font-mono font-bold transition cursor-pointer shrink-0"
                  >
                    {copiedDiscord ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                {/* Primary Discord Action Button */}
                <div className="pt-1 relative z-10">
                  <a
                    href={activeMission.discordUrl || 'https://discord.gg/thunderbolt-ops'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => tacticalAudio.playSuccessBeep()}
                    className="w-full py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#5865F2]/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    {/* Discord Icon */}
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>Join & Register on Discord</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* =========================================================================
                  SQUAD OPERATORS ROSTER (Clean list without voting)
                 ========================================================================= */}
              <div className="rounded-2xl p-4 tb-card border border-[#f2c14e]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#f2c14e]" />
                    <span className="text-[11px] font-display uppercase tracking-widest text-[#f2c14e] font-bold block">
                      ASSIGNED SQUAD OPERATORS
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {members.length} Operators
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 pt-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {members.map(member => {
                    const isCurrentUser = member.id === currentUser.id || member.name.toLowerCase() === currentUser.username.toLowerCase();
                    const rankFormatted = member.rank ? member.rank.replace(/\s*I\s*/g, ' | ') : '[PFC | جندي أول]';

                    return (
                      <div
                        key={member.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                          isCurrentUser
                            ? 'bg-[#152319] border-emerald-500/50 text-stone-100 ring-1 ring-emerald-500/30'
                            : 'bg-black/40 border-stone-800 text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="font-mono text-[10px] font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/25 px-1.5 py-0.5 rounded shrink-0">
                            {rankFormatted}
                          </span>
                          <span className="font-sans font-bold text-stone-100 text-xs truncate">
                            {member.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold shrink-0">
                              YOU
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded shrink-0">
                          DEPLOYED
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leader Actions */}
              {userRole === 'instructor' && (
                <div className="pt-2">
                  <button
                    onClick={() => onBroadcastAlert(activeMission)}
                    className="w-full py-2.5 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black text-xs font-bold font-display uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#f2c14e]/20"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Broadcast Tactical Alert to Squad</span>
                  </button>
                </div>
              )}

              {/* Unit Lockup footer */}
              <div className="text-center py-4 border-t border-stone-800/80 space-y-1">
                <p className="font-display text-[11px] tracking-[0.2em] text-[#f2c14e]/80 uppercase font-bold">
                  Thunderbolt Unit · Special Operations
                </p>
                <p className="text-[11px] text-stone-400">
                  Under the command of Maj. Gen. dragon
                </p>
              </div>
            </div>
          ) : null}

          {/* =========================================================================
              TAB 1: MISSIONS (INSTRUCTOR / LEADER ONLY)
             ========================================================================= */}
          {userRole === 'instructor' && !viewingMissionId && activeTab === 'missions' && (
            <div className="space-y-4 tb-rise">
              
              {/* THE EXACT MATCH FOR SCREENSHOT 1 */}
              {!forceEmptyState && featuredMission ? (
                /* Active Mission Card with Direct Click to Mission Page */
                <div className="space-y-3">
                  <div
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      setViewingMissionId(featuredMission.id);
                    }}
                    className="relative rounded-3xl p-6 tb-card border border-[#f2c14e]/25 text-left cursor-pointer hover:border-[#f2c14e]/50 transition group space-y-3"
                  >
                    {/* Glowing Circular Eagle Emblem matching Screenshot 1 */}
                    <div className="flex justify-center mb-1">
                      <div className="relative w-16 h-16 rounded-full p-0.5 border border-[#f2c14e]/30 bg-black/60 shadow-xl shadow-[#f2c14e]/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img
                          src="/assets/OP/3.Logo_9d28ba9d.png"
                          alt="Emblem"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f2c14e] text-black uppercase tracking-wider">
                          THURSDAY 22/10/2026
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-stone-100 group-hover:text-[#f2c14e] transition-colors">
                        {featuredMission.title}
                      </h3>
                      <p className="text-xs text-stone-400 font-mono">
                        📍 {featuredMission.targetSector}
                      </p>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed text-center line-clamp-2 font-sans pt-1">
                      {featuredMission.summary}
                    </p>

                    {/* Actions: Open mission page + Direct Discord registration */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          tacticalAudio.playTacticalAlert();
                          setViewingMissionId(featuredMission.id);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-[#f2c14e] hover:bg-[#f2c14e]/90 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-black" />
                        <span>Open Mission Page</span>
                      </button>

                      <a
                        href={featuredMission.discordUrl || 'https://discord.gg/thunderbolt-ops'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          tacticalAudio.playRadioClick();
                        }}
                        className="py-2.5 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-[#5865F2]/20 cursor-pointer text-center"
                      >
                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        <span>Join on Discord</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty state identical to Screenshot 1 */
                <div className="rounded-3xl p-8 tb-card border border-[#f2c14e]/20 text-center space-y-4 relative overflow-hidden">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full p-0.5 border border-[#f2c14e]/30 bg-black/60 shadow-xl shadow-[#f2c14e]/10 flex items-center justify-center">
                      <img
                        src="/assets/OP/3.Logo_9d28ba9d.png"
                        alt="Emblem"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-stone-100">
                      No upcoming missions
                    </h2>
                    <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                      The moment a new mission is posted it shows up here and every member gets a notification.
                    </p>
                  </div>

                  {/* Button to load Thursday 22/10 Mission */}
                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalAlert();
                      setForceEmptyState(false);
                      setViewingMissionId(featuredMission.id);
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#f2c14e] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#f2c14e]/90 transition cursor-pointer"
                  >
                    View Thursday 22/10 Mission
                  </button>
                </div>
              )}

              {/* Subtitle below card matching Screenshot 1 */}
              <p className="text-center text-[11px] text-stone-500 font-mono pt-2">
                All dates shown in your device's local time.
              </p>

              {/* Switch to test empty state vs active mission */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setForceEmptyState(!forceEmptyState)}
                  className="text-[10px] text-stone-500 hover:text-stone-300 underline font-mono cursor-pointer"
                >
                  {forceEmptyState ? "Show active Thursday 22/10 mission" : "Toggle empty state (Screenshot 1 preview)"}
                </button>
              </div>

              {/* Quick Post Mission CTA - ONLY INSTRUCTORS CAN POST */}
              <div className="pt-2">
                {userRole === 'instructor' ? (
                  <button
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      setShowPostModal(true);
                    }}
                    className="w-full py-2.5 rounded-xl border border-[#f2c14e]/40 bg-gradient-to-r from-[#1c180e] via-[#241f11] to-[#1c180e] hover:border-[#f2c14e] text-[#f2c14e] hover:text-white text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#f2c14e]/10 group"
                  >
                    <Award className="w-3.5 h-3.5 text-[#f2c14e] group-hover:scale-110 transition-transform" />
                    <span>Post New Mission (Instructor Only)</span>
                    <span className="text-[10px] text-stone-400 font-mono">LEADER</span>
                  </button>
                ) : (
                  <div className="rounded-xl border border-stone-800/80 bg-black/40 p-3 text-center space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 font-mono">
                      <Lock className="w-3.5 h-3.5 text-[#f2c14e]" />
                      <span>Posting missions is restricted to Unit Instructors</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-sans">
                      Organizing, dispatching missions, and setting operational timelines are restricted to commanders.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          tacticalAudio.playRadioClick();
                          onSetUserRole('instructor');
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-[#f2c14e] hover:underline font-mono pt-0.5 cursor-pointer"
                      >
                        <span>Switch to Leader Role</span>
                      </button>
                      <span className="text-stone-600">·</span>
                      <button
                        onClick={() => {
                          tacticalAudio.playRadioClick();
                          setShowSignUpModal(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-[#f2c14e] hover:underline font-mono pt-0.5 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Sign Up New Member</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: ARCHIVE
             ========================================================================= */}
          {!viewingMissionId && activeTab === 'archive' && (
            <div className="space-y-4 tb-rise">
              {/* Header section matching Screenshot 2 */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-100">
                    Mission Archive
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Every completed mission, with date and full brief
                  </p>
                </div>

                <div className="shrink-0 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-center text-xs font-mono text-stone-400">
                  <span className="block font-bold">0</span>
                  <span className="text-[10px]">missions</span>
                </div>
              </div>

              {/* Big Card matching Screenshot 2 */}
              <div className="rounded-3xl p-8 tb-card border border-[#f2c14e]/15 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-center text-stone-500">
                    <ArchiveIcon className="w-6 h-6 text-stone-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-stone-100">
                    Archive is empty
                  </h3>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                    Missions move here automatically once their date has passed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: COMMAND ROOM (MATCHING SCREENSHOT 2_a1e58b5b.PNG EXACTLY)
             ========================================================================= */}
          {!viewingMissionId && activeTab === 'command' && (
            <div className="space-y-4 tb-rise">
              {/* Header section matching Screenshot 2 */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-black text-stone-100 tracking-tight">
                    Command Room
                  </h2>
                  <p className="text-xs text-stone-400 mt-1 font-sans">
                    Post missions and notify every member of the unit
                  </p>
                </div>

                <button
                  onClick={() => {
                    tacticalAudio.playRadioClick();
                    setPreselectedEditMemberId(undefined);
                    setShowApprovalModal(true);
                  }}
                  className="px-3.5 py-2 rounded-2xl border border-[#f2c14e]/40 bg-[#161a14]/90 text-[#f2c14e] font-display font-bold text-xs flex items-center gap-1.5 hover:bg-[#f2c14e]/10 transition shadow-sm cursor-pointer shrink-0"
                >
                  <Users className="w-3.5 h-3.5 text-[#f2c14e]" />
                  <span>Manage members</span>
                </button>
              </div>

              {/* Clearance Check for Command Room */}
              {userRole !== 'instructor' ? (
                <div className="rounded-3xl p-6 bg-[#16130d] border border-amber-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-[#f2c14e] mx-auto">
                    <Lock className="w-6 h-6 text-[#f2c14e]" />
                  </div>
                  <h3 className="font-display text-base font-bold text-stone-100">
                    Command Room Restricted
                  </h3>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                    This section is strictly reserved for Command & Instructors to post missions and authorize recruits.
                  </p>
                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalAlert();
                      onSetUserRole('instructor');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#f2c14e] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ffda73] transition cursor-pointer shadow-md"
                  >
                    Switch to Commander Clearance
                  </button>
                </div>
              ) : (
                <>
                  {/* Card 1: Member sign-up (Matching Screenshot 2) */}
                  <div className="rounded-3xl p-5 tb-card border border-[#f2c14e]/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-[#f2c14e]" />
                        <h3 className="font-display text-base font-bold text-stone-100">
                          Member sign-up
                        </h3>
                      </div>

                      <button
                        onClick={() => {
                          tacticalAudio.playRadioClick();
                          setCopiedJoinLink(false);
                        }}
                        className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition"
                        title="Refresh status"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-400 leading-relaxed font-sans">
                      Members create their own account on the app link, then you approve them here.
                    </p>

                    {/* Toggle Switch: Self sign-up is ON */}
                    <div 
                      onClick={() => {
                        tacticalAudio.playRadioClick();
                        setSelfSignUpEnabled(!selfSignUpEnabled);
                      }}
                      className="rounded-2xl p-2.5 bg-black/70 border border-stone-800 flex items-center gap-3 cursor-pointer select-none"
                    >
                      <div className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                        selfSignUpEnabled ? 'bg-[#f2c14e] justify-end' : 'bg-stone-800 justify-start'
                      }`}>
                        <div className={`w-5 h-5 rounded-full shadow-md transition-transform ${
                          selfSignUpEnabled ? 'bg-black' : 'bg-stone-400'
                        }`} />
                      </div>
                      <span className="font-sans font-bold text-xs text-stone-200">
                        Self sign-up is {selfSignUpEnabled ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    {/* Send Members This Link Box */}
                    <div className="rounded-2xl p-3.5 bg-black/40 border border-stone-800 space-y-2">
                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-bold block">
                        SEND MEMBERS THIS LINK
                      </span>

                      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black border border-stone-800">
                        <span className="text-xs font-mono text-stone-300 truncate">
                          {window.location.origin ? `${window.location.origin}/join` : 'https://thunderbolt-unit-i5h.web.app'}
                        </span>

                        <button
                          onClick={() => {
                            tacticalAudio.playRadioClick();
                            const linkToCopy = window.location.origin ? `${window.location.origin}/join` : 'https://thunderbolt-unit-i5h.web.app';
                            navigator.clipboard.writeText(linkToCopy);
                            setCopiedJoinLink(true);
                            setTimeout(() => setCopiedJoinLink(false), 2500);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#f2c14e]/40 bg-stone-900/80 text-[#f2c14e] font-mono text-xs font-bold hover:bg-[#f2c14e] hover:text-black transition flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedJoinLink ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-400 font-sans flex items-start gap-1.5 leading-relaxed">
                        <span className="text-stone-500 font-mono">∞</span>
                        <span>They tap "Request to join", pick a username and password.</span>
                      </p>
                    </div>

                    {/* Join Requests */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-bold block">
                        JOIN REQUESTS
                      </span>

                      {pendingAccounts.length === 0 ? (
                        <div className="space-y-1 pt-0.5">
                          <p className="text-xs text-stone-400 font-sans">
                            No pending requests.
                          </p>
                          <p className="text-[11px] text-stone-500 font-sans flex items-start gap-1.5 leading-relaxed">
                            <span className="text-stone-600 font-mono">⚑</span>
                            <span>An approved member gets their own account — and every mission alert.</span>
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          {pendingAccounts.map((acc) => (
                            <div
                              key={acc.id}
                              className="p-3 rounded-2xl bg-[#1c180e] border border-amber-500/40 flex items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5 overflow-hidden">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-stone-100 text-xs">
                                    {acc.username}
                                  </span>
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                    {acc.requestedRank || acc.rank}
                                  </span>
                                </div>
                                <div className="text-[10px] text-stone-400 font-mono flex items-center gap-2">
                                  <span>UID: <span className="text-stone-200">{acc.unitServiceId || 'TU-XXXX'}</span></span>
                                  {acc.steamUid && (
                                    <span className="truncate max-w-[120px]">Steam: {acc.steamUid}</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    tacticalAudio.playSuccessBeep();
                                    if (onApproveAccount) {
                                      onApproveAccount(acc.id, acc.requestedRank || acc.rank || '[PFC | جندي أول]');
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] font-mono cursor-pointer transition shadow"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    tacticalAudio.playRadioClick();
                                    if (onRejectAccount) onRejectAccount(acc.id);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-stone-900 border border-stone-700 hover:bg-rose-950/80 hover:text-rose-300 text-stone-400 text-[11px] font-mono cursor-pointer transition"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card: Thunderbolt Sa'ka Academy Qualifications System */}
                  <div 
                    onClick={() => handleOpenAcademy()}
                    className="rounded-3xl p-5 tb-card border border-[#f2c14e]/30 hover:border-[#f2c14e] transition cursor-pointer space-y-2.5 group shadow-xl bg-gradient-to-r from-[#171c17] via-[#101512] to-black"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#f2c14e]/10 border border-[#f2c14e]/40 flex items-center justify-center text-[#f2c14e] group-hover:scale-105 transition-transform shrink-0 shadow-inner">
                          <Award className="w-6 h-6 text-[#f2c14e]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-sm sm:text-base font-bold text-stone-100">
                              THUNDERBOLT / SA'KA ACADEMY
                            </h3>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#f2c14e] text-black">
                              OFFICIAL
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Qualifications, training passports & operator combat certifications
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-[#f2c14e] bg-black/60 border border-[#f2c14e]/40 px-2.5 py-1 rounded-full uppercase shrink-0">
                        31 Modules
                      </span>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-stone-400 border-t border-stone-800/80">
                      <span className="text-emerald-400">Server-Verified Records</span>
                      <span className="text-[#f2c14e] group-hover:underline flex items-center gap-1">
                        <span>Open Academy Structure</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Card 2: New Mission (Matching Screenshot 2 bottom card) */}
                  <div 
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      setShowPostModal(true);
                    }}
                    className="rounded-3xl p-5 tb-card border border-[#f2c14e]/20 hover:border-[#f2c14e]/50 transition cursor-pointer space-y-2 group shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#f2c14e] group-hover:scale-110 transition-transform" />
                        <h3 className="font-display text-base font-bold text-stone-100">
                          New mission
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/30 px-2 py-0.5 rounded-full">
                        DISPATCH
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 leading-relaxed font-sans">
                      Post an upcoming military operation with date, time, reconnaissance map image, voice audio briefing, and instant alert broadcast to all operators.
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f2c14e] to-[#ffda73] text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-[#f2c14e]/10 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Dispatch New Operation</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: ACCOUNT (MATCHING SCREENSHOT 23_a1194300.PNG EXACTLY)
             ========================================================================= */}
          {!viewingMissionId && activeTab === 'account' && (
            <div className="space-y-3.5 tb-rise">
              {/* Card 1: User Profile & Dedicated UNIT SERVICE ID / STEAM UID (Matching Screenshot 23) */}
              <div className="rounded-3xl p-5 bg-[#101412] border border-[#f2c14e]/20 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    {/* Square Avatar with initial "D" matching Screenshot 23 */}
                    <div className="w-14 h-14 rounded-2xl bg-[#282518] border border-[#f2c14e]/40 flex items-center justify-center font-display text-2xl font-black text-[#f2c14e] shadow-inner shrink-0">
                      {currentUser.username ? currentUser.username[0].toUpperCase() : 'D'}
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <h3 className="font-display text-base font-bold text-stone-100 truncate flex items-center gap-1.5">
                        <span>{currentUser.username}</span>
                        <span className="text-[#f2c14e] font-mono text-xs font-semibold">
                          [{currentUser.rank.replace(/^\[|\]$/g, '')}]
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 font-mono">
                        {currentUser.username.toLowerCase()}
                      </p>
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#f2c14e]/40 bg-[#f2c14e]/10 text-[#f2c14e] text-[10px] font-mono font-bold tracking-wider">
                          <Shield className="w-2.5 h-2.5" />
                          <span>{isCommandRank(currentUser.rank) ? 'Command' : 'Squad Operator'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      onClick={() => {
                        tacticalAudio.playRadioClick();
                        onLogout();
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-red-500/40 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                      title="Log Out to Gateway"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>

                {/* Dedicated Nested Card: UNIT SERVICE ID / STEAM UID (Matching Screenshot 23 exactly) */}
                <div className="rounded-2xl p-4 bg-black/60 border border-[#f2c14e]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#f2c14e] tracking-wider uppercase">
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>UNIT SERVICE ID</span>
                    </div>

                    <button
                      onClick={() => {
                        tacticalAudio.playRadioClick();
                        const idToCopy = currentUser.unitServiceId || 'TU-9198';
                        navigator.clipboard.writeText(idToCopy);
                        setCopiedServiceId(true);
                        setTimeout(() => setCopiedServiceId(false), 2500);
                      }}
                      className="px-3 py-1 rounded-xl border border-[#f2c14e]/40 bg-stone-900/80 hover:bg-[#f2c14e] hover:text-black text-[#f2c14e] text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedServiceId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Large Monospace Value TU-9198 matching Screenshot 23 */}
                  <div className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-stone-100">
                    {currentUser.unitServiceId || 'TU-9198'}
                  </div>

                  {/* Steam UID details */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-800/80">
                    <span className="text-stone-400">Steam UID: <span className="text-stone-200">{currentUser.steamUid || '76561198000009198'}</span></span>
                    <button
                      onClick={() => setIsEditingSteamUid(!isEditingSteamUid)}
                      className="text-[10px] text-[#f2c14e] hover:underline cursor-pointer"
                    >
                      {isEditingSteamUid ? 'Cancel' : 'Edit Steam UID'}
                    </button>
                  </div>

                  {isEditingSteamUid && (
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={steamUidInput}
                        onChange={(e) => setSteamUidInput(e.target.value)}
                        placeholder="Steam 64-bit UID (e.g. 76561198...)"
                        className="flex-1 p-2 bg-stone-900 border border-stone-700 rounded-lg text-xs font-mono text-stone-100 focus:outline-none focus:border-[#f2c14e]"
                      />
                      <button
                        onClick={() => {
                          tacticalAudio.playSuccessBeep();
                          const updated = { ...currentUser, steamUid: steamUidInput.trim() };
                          onUpdateUserAccount(updated);
                          setIsEditingSteamUid(false);
                        }}
                        className="px-3 py-2 bg-[#f2c14e] text-black font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Exact Subtitle copy from Screenshot 23 */}
                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  Your own permanent ID inside the unit — it stays the same on every device and is issued the moment your account is created.
                </p>

                {/* Dedicated Box: RANK (Matching Screenshot 23 exactly) */}
                <div className="rounded-2xl border border-stone-800 bg-black/40 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block">
                      RANK
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="font-bold text-stone-100 text-sm font-mono block">
                        {currentUser.rank}
                      </span>
                      {isStaffRank(currentUser.rank) && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-[#f2c14e] border border-[#f2c14e]/30 font-mono font-bold">
                          أ.ح
                        </span>
                      )}
                      {isCommandRank(currentUser.rank) && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                          Command
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      if (userRole === 'instructor') {
                        setShowRankChangeDropdown(!showRankChangeDropdown);
                      } else {
                        setPreselectedEditMemberId(currentUser.id);
                        setShowApprovalModal(true);
                      }
                    }}
                    className="text-xs font-mono font-bold text-[#f2c14e] hover:text-[#ffda73] flex items-center gap-1 cursor-pointer px-2.5 py-1.5 rounded-xl border border-[#f2c14e]/30 bg-stone-900/60 transition"
                  >
                    <ChevronsUpDown className="w-3.5 h-3.5 text-[#f2c14e]" />
                    <span>Change</span>
                  </button>
                </div>

                {showRankChangeDropdown && (
                  <div className="p-3.5 bg-stone-900 border border-[#f2c14e]/40 rounded-2xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-mono font-bold text-[#f2c14e] block">
                        Select Commissioned Military Rank (Arabic Standard):
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setAccountRankFilter('all')}
                          className={`px-2 py-0.5 rounded cursor-pointer transition ${
                            accountRankFilter === 'all' 
                              ? 'bg-[#f2c14e] text-black font-bold' 
                              : 'bg-stone-800 text-stone-400 hover:text-white'
                          }`}
                        >
                          All Ranks
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccountRankFilter('command')}
                          className={`px-2 py-0.5 rounded cursor-pointer transition ${
                            accountRankFilter === 'command' 
                              ? 'bg-[#f2c14e] text-black font-bold' 
                              : 'bg-stone-800 text-stone-400 hover:text-white'
                          }`}
                        >
                          Command (عقيد - لواء)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccountRankFilter('staff')}
                          className={`px-2 py-0.5 rounded cursor-pointer transition ${
                            accountRankFilter === 'staff' 
                              ? 'bg-[#f2c14e] text-black font-bold' 
                              : 'bg-stone-800 text-stone-400 hover:text-white'
                          }`}
                        >
                          أ.ح
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                      {AVAILABLE_RANKS
                        .filter((rk) => {
                          if (accountRankFilter === 'command') return rk.isCommand;
                          if (accountRankFilter === 'staff') return rk.isStaffOfficer;
                          return true;
                        })
                        .map((rk) => (
                        <button
                          key={rk.id}
                          onClick={() => {
                            tacticalAudio.playSuccessBeep();
                            onUpdateUserAccount({ ...currentUser, rank: rk.formatted });
                            setShowRankChangeDropdown(false);
                          }}
                          className={`p-2.5 rounded-xl text-left text-xs font-mono flex items-center justify-between border cursor-pointer transition ${
                            currentUser.rank === rk.formatted
                              ? 'bg-[#f2c14e] text-black font-bold border-[#f2c14e]'
                              : 'bg-black/60 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="truncate mr-1.5">
                            <span className="block truncate font-bold">{rk.formatted}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              {rk.isCommand && (
                                <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                  currentUser.rank === rk.formatted ? 'bg-black/30 text-black' : 'bg-amber-500/20 text-[#f2c14e]'
                                }`}>
                                  Command
                                </span>
                              )}
                              {rk.isStaffOfficer && (
                                <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                  currentUser.rank === rk.formatted ? 'bg-black/30 text-black' : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                  أ.ح
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] shrink-0 font-bold">{rk.insignia}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card: Sa'ka Academy Training Passport for Current User */}
              <div className="rounded-3xl p-5 bg-[#101412] border border-[#f2c14e]/25 space-y-3 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#f2c14e]/10 border border-[#f2c14e]/40 flex items-center justify-center text-[#f2c14e] shrink-0 mt-0.5">
                      <Award className="w-6 h-6 text-[#f2c14e]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-sm font-bold text-stone-100 uppercase">
                          Sa'ka Academy Passport
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#f2c14e] text-black">
                          OFFICIAL
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5 font-arabic">
                        سجل التأهيل القتالي والأكاديمية العسكرية
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 shrink-0">
                    {userAcademyStats.completed} / {userAcademyStats.total} Certified
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>Combat Readiness: <strong className="text-emerald-400">{userAcademyStats.percent}%</strong></span>
                    <span>{userAcademyStats.available} Available Modules</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black border border-stone-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-[#f2c14e] to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.max(userAcademyStats.percent, 5)}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  Server-verified qualification records for <strong className="text-stone-200">{currentUser.username}</strong> ({currentUser.unitServiceId || 'TU-9198'}). Review critical tasks and trainee manuals.
                </p>

                <button
                  onClick={() => handleOpenAcademy(currentUser.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#f2c14e] hover:from-[#f2c14e] hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#f2c14e]/20"
                >
                  <BookOpen className="w-4 h-4 fill-black" />
                  <span>Open Sa'ka Academy (أكاديمية الصاعقة)</span>
                </button>
              </div>

              {/* Card 2: Mission alerts (Matching Screenshot 23 exactly) */}
              <div className="rounded-3xl p-5 bg-[#101412] border border-[#f2c14e]/15 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#18281e] border border-[#3b7352]/40 flex items-center justify-center text-[#52b788] shrink-0 mt-0.5">
                      <Bell className="w-5 h-5 text-[#52b788]" />
                    </div>

                    <div>
                      <h4 className="font-display text-sm font-bold text-stone-100">
                        Mission alerts
                      </h4>
                      <p className="text-xs text-stone-300 mt-0.5">
                        On — new missions reach you instantly.
                      </p>
                    </div>
                  </div>

                  <CheckCircle2 className="w-5 h-5 text-[#52b788] shrink-0 mt-0.5" />
                </div>

                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  Notifications do not work inside the preview. Open the app from its published link, installed on your home screen.
                </p>

                {/* Send a test notification button matching Screenshot 23 */}
                <button
                  onClick={handleSendTestNotification}
                  className="w-full py-2.5 rounded-xl border border-[#f2c14e]/40 bg-stone-900/60 hover:bg-[#f2c14e]/10 text-[#f2c14e] text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Bell className="w-3.5 h-3.5 text-[#f2c14e]" />
                  <span>{testNotifSent ? 'Test notification sent ✓' : 'Send a test notification'}</span>
                </button>
              </div>

              {/* Card 3: Multi-Account & Profile Switcher */}
              <div className="rounded-2xl p-4 tb-card border border-[#f2c14e]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#f2c14e]" />
                    <span className="text-[11px] font-display uppercase tracking-wider text-[#f2c14e] font-bold">
                      Unit Member Profiles & UIDs
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">
                    {accounts.length} Profiles
                  </span>
                </div>

                <div className="space-y-1.5">
                  {accounts.map(acc => {
                    const isActive = acc.id === currentUser.id;
                    const isClient = acc.role === 'client' || acc.role === 'member';

                    const isPending = acc.approvalStatus === 'pending';
                    const isRejected = acc.approvalStatus === 'rejected';

                    return (
                      <div
                        key={acc.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                          isActive
                            ? 'bg-[#152319] border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30'
                            : isPending
                            ? 'bg-[#1a170d] border-amber-500/40'
                            : 'bg-black/40 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="font-mono text-[10px] font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/25 px-1.5 py-0.5 rounded shrink-0">
                            {acc.rank}
                          </span>
                          <span className="font-sans font-bold text-stone-100 text-xs truncate">
                            {acc.username}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 truncate">
                            {acc.unitServiceId || 'TU-9198'}
                          </span>
                          {isPending && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                              Pending
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenAcademy(acc.id)}
                            className="p-1 rounded text-stone-400 hover:text-[#f2c14e] bg-stone-900 border border-stone-800 hover:border-[#f2c14e]/40 transition cursor-pointer"
                            title="Sa'ka Academy Qualification Record"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>

                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                tacticalAudio.playTacticalAlert();
                                if (onSwitchAccount) {
                                  onSwitchAccount(acc);
                                } else {
                                  onUpdateUserAccount(acc);
                                }
                              }}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold text-stone-200 hover:text-black bg-stone-900 hover:bg-[#f2c14e] border border-stone-700 rounded-lg transition cursor-pointer"
                            >
                              Switch
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-1 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      setSignUpInitialRole('member');
                      setShowSignUpModal(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#f2c14e]" />
                    <span>+ Add Member</span>
                  </button>

                  <button
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      setShowAccountSwitcher(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-[#f2c14e]" />
                    <span>Manage ({accounts.length})</span>
                  </button>
                </div>
              </div>

              {/* Card 4: Official Unit Cover Banner */}
              <div className="rounded-2xl tb-card border border-[#f2c14e]/20 overflow-hidden">
                <div 
                  onClick={() => {
                    tacticalAudio.playRadioClick();
                    setShowCoverModal(true);
                  }}
                  className="relative h-28 w-full overflow-hidden border-b border-[#f2c14e]/20 cursor-pointer group"
                >
                  <img
                    src="/assets/OP/1.Cover_b397aaf7.png"
                    alt="Thunderbolt Unit Cover"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101412] via-black/25 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/75 border border-[#f2c14e]/40 text-[#f2c14e] backdrop-blur-xs flex items-center gap-1">
                      <span>OFFICIAL COVER</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3">
                    <span className="text-[10px] font-mono text-stone-300 drop-shadow">
                      Tap to view full wallpaper
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="font-display text-xs font-bold text-stone-100 uppercase">
                    Under the command of Maj. Gen. dragon
                  </h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Thunderbolt Unit publishes missions with full brief, recon maps, and audio directives.
                  </p>
                </div>
              </div>

              {/* Installation Guide */}
              <div className="rounded-2xl p-3.5 bg-stone-900/40 border border-stone-800 text-xs text-stone-400 space-y-1">
                <p className="flex items-start gap-2 leading-relaxed">
                  <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <span>For new-mission alerts to arrive, the app needs to be published and installed on your home screen, with notifications allowed in your device settings.</span>
                </p>
              </div>
            </div>
          )}

        </main>

        {/* =========================================================================
            BOTTOM NAVIGATION BAR (4 TABS MATCHING SCREENSHOTS 2 AND 23)
            - Missions
            - Archive
            - Command (Shield icon, strictly for Command)
            - Account
           ========================================================================= */}
        <nav className="fixed bottom-0 w-full max-w-[420px] bg-[#0a0d0b]/98 backdrop-blur border-t border-stone-800/80 px-4 py-2 flex items-center justify-around z-40">
          {/* Tab 1: Missions */}
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setViewingMissionId(null);
              setActiveTab('missions');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'missions' && !viewingMissionId ? 'text-[#f2c14e]' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[11px] font-bold font-sans">Missions</span>
          </button>

          {/* Tab 2: Archive */}
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setViewingMissionId(null);
              setActiveTab('archive');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'archive' && !viewingMissionId ? 'text-[#f2c14e]' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <ArchiveIcon className="w-5 h-5" />
            <span className="text-[11px] font-bold font-sans">Archive</span>
          </button>

          {/* Tab 3: Command (Restricted to Command Room) */}
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setViewingMissionId(null);
              setActiveTab('command');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
              activeTab === 'command' && !viewingMissionId ? 'text-[#f2c14e]' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[11px] font-bold font-sans">Command</span>
            {pendingAccounts.length > 0 && userRole === 'instructor' && (
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-[#f2c14e] ring-2 ring-black animate-ping" />
            )}
          </button>

          {/* Tab 4: Account */}
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setViewingMissionId(null);
              setActiveTab('account');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'account' && !viewingMissionId ? 'text-[#f2c14e]' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[11px] font-bold font-sans">Account</span>
          </button>
        </nav>

        {/* MODAL: POST MISSION (COMMAND ROOM) */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#101412] border border-[#f2c14e]/30 rounded-2xl p-5 text-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#f2c14e]" />
                  <div>
                    <span className="font-display text-sm font-bold text-[#f2c14e] uppercase block">
                      Instructor Mission Dispatch
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Under command of Maj. Gen. dragon
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-stone-400 hover:text-white cursor-pointer px-1 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateMissionSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-400 block mb-1">Mission name *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-black border border-stone-700 text-stone-100 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-stone-400 block mb-1">Date</label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full p-2 rounded-lg bg-black border border-stone-700 text-stone-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1">Time</label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full p-2 rounded-lg bg-black border border-stone-700 text-stone-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Target Sector / Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Sector G14-H18 (Northern Ridge Outpost)"
                    className="w-full p-2 rounded-lg bg-black border border-stone-700 text-stone-200 text-xs"
                  />
                </div>

                {/* Discord Registration Link */}
                <div className="p-2.5 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 space-y-1">
                  <label className="text-[#5865F2] font-semibold text-xs flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>Discord Registration Link</span>
                  </label>
                  <input
                    type="url"
                    value={newDiscordLink}
                    onChange={(e) => setNewDiscordLink(e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full p-2 rounded-lg bg-black border border-[#5865F2]/40 text-[#5865F2] font-mono text-xs focus:border-[#5865F2] focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-400">
                    Dedicated Discord channel where operators register and confirm briefing attendance.
                  </p>
                </div>

                {/* Upload Operation Image */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#f2c14e] font-semibold text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Operation Image / Map</span>
                    </label>
                    {newImageFileName && (
                      <span className="text-[10px] font-mono text-stone-400 truncate max-w-[140px]">
                        {newImageFileName}
                      </span>
                    )}
                  </div>

                  {newImageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-stone-700 h-24 w-full bg-black flex items-center justify-center">
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewImageUrl('');
                          setNewImageFileName('');
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded bg-rose-950/80 text-rose-300 text-[10px]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-stone-700 hover:border-[#f2c14e] cursor-pointer text-stone-400 hover:text-stone-200 transition">
                      <Upload className="w-3.5 h-3.5 text-[#f2c14e]" />
                      <span className="text-[11px]">Upload Image (JPG, PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setNewImageUrl(ev.target.result as string);
                              setNewImageFileName(file.name);
                              tacticalAudio.playSuccessBeep();
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Upload Audio Briefing File */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#f2c14e] font-semibold text-xs flex items-center gap-1.5">
                      <FileAudio className="w-3.5 h-3.5" />
                      <span>Audio Briefing File</span>
                    </label>
                    {newAudioFileName && (
                      <span className="text-[10px] font-mono text-emerald-400 truncate max-w-[140px]">
                        Attached
                      </span>
                    )}
                  </div>

                  {newAudioUrl ? (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-stone-900 border border-stone-700">
                      <div className="flex items-center gap-1.5 truncate text-[11px] font-mono text-stone-200">
                        <Volume2 className="w-3.5 h-3.5 text-[#f2c14e] shrink-0" />
                        <span className="truncate">{newAudioFileName || 'Audio recording'}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (modalAudioPlaying) {
                              stopAllAudio();
                              setModalAudioPlaying(false);
                            } else {
                              tacticalAudio.playRadioClick();
                              setModalAudioPlaying(true);
                              playAudioUrl(newAudioUrl, () => setModalAudioPlaying(false));
                            }
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            modalAudioPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#f2c14e] text-black'
                          }`}
                        >
                          {modalAudioPlaying ? 'Stop' : 'Test Play'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            stopAllAudio();
                            setModalAudioPlaying(false);
                            setNewAudioUrl('');
                            setNewAudioFileName('');
                          }}
                          className="p-1 rounded bg-stone-800 text-stone-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-stone-700 hover:border-[#f2c14e] cursor-pointer text-stone-400 hover:text-stone-200 transition">
                      <FileAudio className="w-3.5 h-3.5 text-[#f2c14e]" />
                      <span className="text-[11px]">Upload Audio (MP3, WAV, OGG)</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setNewAudioUrl(ev.target.result as string);
                              setNewAudioFileName(file.name);
                              tacticalAudio.playSuccessBeep();
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  )}
                  <p className="text-[10px] text-stone-500 font-mono">
                    * If no audio is uploaded, AI/HUD voice will read the written briefing script automatically.
                  </p>
                </div>

                <div>
                  <label className="text-[#f2c14e] block mb-1">
                    Briefing Explanation & Directives *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newBriefing}
                    onChange={(e) => setNewBriefing(e.target.value)}
                    placeholder="Provide operational objectives, tactical directives, insertion coordinates..."
                    className="w-full p-2 rounded-lg bg-black border border-stone-700 text-stone-200 text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-stone-700 text-stone-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#f2c14e] text-black font-bold uppercase tracking-wider"
                  >
                    Post & Notify
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: FULL COVER IMAGE WALLPAPER PREVIEW */}
        {showCoverModal && (
          <div 
            onClick={() => setShowCoverModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#101412] border border-[#f2c14e]/40 rounded-3xl overflow-hidden shadow-2xl relative space-y-3 cursor-default"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                <img
                  src="/assets/OP/1.Cover_b397aaf7.png"
                  alt="Thunderbolt Unit Official Cover"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-display text-sm font-bold text-stone-100 uppercase tracking-wide">
                      Thunderbolt Unit Official Cover
                    </h3>
                    <p className="text-[11px] text-[#f2c14e] font-mono">
                      Under the command of Maj. Gen. dragon
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCoverModal(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#f2c14e] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#f2c14e]/90 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SIGN UP OPERATOR / MEMBER (2-STEP: USERNAME -> RANK & APPROVAL) */}
        <SignUpModal
          isOpen={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          onSignUpComplete={handleSignUpComplete}
          initialRole={signUpInitialRole}
          isLeaderViewing={userRole === 'instructor'}
        />

        {/* MODAL: ACCOUNT SWITCHER & MULTI-ACCOUNT MANAGER */}
        <AccountSwitcherModal
          isOpen={showAccountSwitcher}
          onClose={() => setShowAccountSwitcher(false)}
          accounts={accounts}
          currentAccountId={currentUser.id}
          onSwitchAccount={(acc) => {
            if (onSwitchAccount) {
              onSwitchAccount(acc);
            } else {
              onUpdateUserAccount(acc);
            }
          }}
          onOpenAddAccount={(role) => {
            setSignUpInitialRole(role || 'member');
            setShowSignUpModal(true);
          }}
          onDeleteAccount={onDeleteAccount}
        />

        {/* MODAL: LEADER CLEARANCE APPROVAL & RANK CONTROL */}
        <LeaderApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setPreselectedEditMemberId(undefined);
          }}
          accounts={accounts}
          onApproveAccount={(accId, rank) => {
            if (onApproveAccount) onApproveAccount(accId, rank);
          }}
          onRejectAccount={(accId) => {
            if (onRejectAccount) onRejectAccount(accId);
          }}
          onUpdateMemberRank={(accId, rank) => {
            if (onUpdateMemberRank) onUpdateMemberRank(accId, rank);
          }}
          preselectedAccountId={preselectedEditMemberId}
        />

        {/* MODAL: THUNDERBOLT SA'KA ACADEMY QUALIFICATIONS & PASSPORTS */}
        {showAcademyModal && (
          <SakaAcademyModal
            isOpen={showAcademyModal}
            onClose={() => setShowAcademyModal(false)}
            currentUser={currentUser}
            accounts={accounts}
            members={members}
            onUpdateMemberQualifications={handleUpdateQualifications}
            userRole={userRole}
            initialSelectedMemberId={academySelectedMemberId}
            lang={lang}
          />
        )}

      </div>
    </div>
  );
};

export const WhackaThunderboltApp = ThunderboltApp;
