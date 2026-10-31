import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { AVAILABLE_RANKS, isCommandRank, isStaffRank } from '../data/initialData';
import { 
  User, 
  Award, 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Zap, 
  AlertCircle,
  X,
  Lock,
  Clock,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpComplete: (account: UserAccount) => void;
  initialUser?: UserAccount;
  initialRole?: UserRole;
  isLeaderViewing?: boolean; // True if current user opening this is Commander (Leader)
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSignUpComplete,
  initialUser,
  initialRole = 'member',
  isLeaderViewing = false,
}) => {
  // Wizard Step: 1 for Username, 2 for Rank & Role
  const [step, setStep] = useState<1 | 2>(1);

  const [username, setUsername] = useState<string>(initialUser?.username || '');
  const [email, setEmail] = useState<string>(initialUser?.email || '');
  const [steamUid, setSteamUid] = useState<string>(initialUser?.steamUid || '');
  const [authProvider, setAuthProvider] = useState<'google' | 'discord' | 'manual'>(initialUser?.authProvider || 'manual');
  const [linkedGmail, setLinkedGmail] = useState<string>(initialUser?.linkedGmail || '');
  const [linkedDiscord, setLinkedDiscord] = useState<string>(initialUser?.linkedDiscord || '');
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [showDiscordModal, setShowDiscordModal] = useState<boolean>(false);
  const [googleEmailInput, setGoogleEmailInput] = useState<string>('mahmoudosama3003@gmail.com');
  const [discordTagInput, setDiscordTagInput] = useState<string>('Mahmoud#3003');
  const [selectedRank, setSelectedRank] = useState<string>(
    initialUser?.rank ? initialUser.rank.replace(/\s*I\s*/g, ' | ') : (isLeaderViewing && initialRole === 'instructor' ? '[CPT | نقيب]' : '[PFC | جندي أول]')
  );
  const [isCustomRank, setIsCustomRank] = useState<boolean>(false);
  const [customRankValue, setCustomRankValue] = useState<string>('');
  const [role, setRole] = useState<UserRole>(initialRole || initialUser?.role || 'member');

  const [usernameError, setUsernameError] = useState<string>('');

  if (!isOpen) return null;

  const handleLinkGoogle = () => {
    tacticalAudio.playRadioClick();
    setShowGoogleModal(true);
  };

  const handleConfirmGoogleLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    tacticalAudio.playSuccessBeep();
    const cleanEmail = googleEmailInput.trim() || 'mahmoudosama3003@gmail.com';
    setLinkedGmail(cleanEmail);
    setEmail(cleanEmail);
    setAuthProvider('google');
    if (!username.trim()) {
      const suggestedName = cleanEmail.split('@')[0].replace(/[0-9_.-]/g, '');
      const capitalized = suggestedName ? suggestedName.charAt(0).toUpperCase() + suggestedName.slice(1).toLowerCase() : 'Mahmoud';
      setUsername(capitalized || 'Mahmoud');
    }
    setShowGoogleModal(false);
  };

  const handleLinkDiscord = () => {
    tacticalAudio.playRadioClick();
    setShowDiscordModal(true);
  };

  const handleConfirmDiscordLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    tacticalAudio.playSuccessBeep();
    const cleanDiscord = discordTagInput.trim() || 'Mahmoud#3003';
    setLinkedDiscord(cleanDiscord);
    setAuthProvider('discord');
    if (!username.trim()) {
      const pureName = cleanDiscord.split('#')[0].trim();
      setUsername(pureName || 'Mahmoud');
    }
    setShowDiscordModal(false);
  };

  const handleNextToRank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setUsernameError('Please enter a single username to proceed');
      return;
    }
    setUsernameError('');
    tacticalAudio.playRadioClick();
    setStep(2); // Move to Step 2: Military Clearance
  };

  const handleBackToUsername = () => {
    tacticalAudio.playRadioClick();
    setStep(1); // Return to Step 1: Username
  };

  const handleCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    let finalRank = isCustomRank && customRankValue.trim() 
      ? customRankValue.trim().replace(/\s*I\s*/g, ' | ') 
      : selectedRank;

    if (isCustomRank && finalRank && !finalRank.startsWith('[')) {
      finalRank = `[${finalRank}]`;
    }

    // If Commander is creating account: immediately approved with selected rank.
    // If recruit is signing up: status is 'pending', initial rank is [PVT | جندي], rank assigned by Commander!
    const isApprovedImmediately = isLeaderViewing;
    const assignedRank = isApprovedImmediately ? finalRank : '[PVT | جندي]';
    const finalRole = isLeaderViewing ? (role === 'client' ? 'member' : role) : 'member';

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const assignedServiceId = `TU-${randomDigits}`;
    const cleanedSteamUid = steamUid.trim() || `765611980${randomDigits}${Math.floor(1000 + Math.random() * 9000)}`;

    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      email: email.trim() || linkedGmail || `${username.trim().toLowerCase().replace(/\s+/g, '')}@thunderbolt.unit`,
      rank: assignedRank,
      requestedRank: !isApprovedImmediately ? finalRank : undefined,
      approvalStatus: isApprovedImmediately ? 'approved' : 'pending',
      role: finalRole,
      unitServiceId: assignedServiceId,
      steamUid: cleanedSteamUid,
      authProvider,
      linkedGmail: linkedGmail || (email.includes('@gmail.com') ? email : undefined),
      linkedDiscord: linkedDiscord || undefined,
      joinedDate: new Date().toISOString().split('T')[0],
      isRegistered: true,
    };

    tacticalAudio.playTacticalAlert();
    onSignUpComplete(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d120f] border-2 border-[#f2c14e]/40 rounded-2xl p-6 text-stone-200 shadow-2xl shadow-[#f2c14e]/20 relative overflow-hidden">
        
        {/* Background glow & military line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2c14e] to-transparent" />
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#f2c14e]/10 rounded-full blur-2xl pointer-events-none" />

        {/* TACTICAL COVER IMAGE BANNER */}
        <div className="relative h-32 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl border-b border-[#f2c14e]/30 bg-black">
          <img
            src="/assets/OP/1.Cover_b397aaf7.png"
            alt="Thunderbolt Cover"
            className="w-full h-full object-cover object-top filter brightness-90 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d120f] via-black/40 to-black/20" />
          
          {/* Unit Insignia & Badge Overlay */}
          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-[#f2c14e]/60 p-0.5 bg-black/90 shadow-lg shadow-black/80 shrink-0">
                <img
                  src="/assets/OP/3.Logo_9d28ba9d.png"
                  alt="Unit Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-display text-xs font-bold text-stone-100 uppercase tracking-wider block drop-shadow">
                  THUNDERBOLT UNIT
                </span>
                <span className="text-[10px] text-[#f2c14e] font-mono block drop-shadow">
                  MAJ. GEN. DRAGON · COMMAND HQ
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-black/80 border border-[#f2c14e]/50 text-[#f2c14e] font-mono text-[9px] font-bold shrink-0">
              {isLeaderViewing ? 'COMMAND DISPATCH' : 'RECRUIT REGISTRATION'}
            </span>
          </div>

          {/* Close button top right */}
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/70 border border-stone-700/80 hover:border-stone-500 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer transition backdrop-blur-xs z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Title */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#231e13] border border-[#f2c14e]/40 flex items-center justify-center text-[#f2c14e] shrink-0">
              <Zap className="w-4 h-4 fill-[#f2c14e]" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>{isLeaderViewing ? 'Add Operator Account' : 'Operator Registration'}</span>
                <span className="text-[10px] text-[#f2c14e] font-mono tracking-wider font-normal">
                  / {isLeaderViewing ? 'ADD ACCOUNT' : 'SIGN UP'}
                </span>
              </h3>
              <p className="text-[10px] text-stone-400 font-mono">
                {isLeaderViewing ? 'Instant Commissioning & Rank Assignment' : 'Registration Grants Direct Discord Mission Access'}
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="py-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={`font-bold flex items-center gap-1.5 ${step === 1 ? 'text-[#f2c14e]' : 'text-emerald-400'}`}>
              <span className="w-5 h-5 rounded-full bg-stone-900 border border-current flex items-center justify-center text-[10px]">
                {step > 1 ? <Check className="w-3 h-3 text-emerald-400" /> : '1'}
              </span>
              <span>1. Single Username</span>
            </span>

            <span className={`font-bold flex items-center gap-1.5 ${step === 2 ? 'text-[#f2c14e]' : 'text-stone-500'}`}>
              <span className="w-5 h-5 rounded-full bg-stone-900 border border-current flex items-center justify-center text-[10px]">
                2
              </span>
              <span>2. Military Rank & Clearance</span>
            </span>
          </div>

          <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-stone-800">
            <div 
              className="bg-gradient-to-r from-[#f2c14e] to-[#ffda73] h-full transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* =========================================================================
            STEP 1: USERNAME (Single name, e.g. Mahmoud)
           ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleNextToRank} className="space-y-4">
            
            {/* Quick One-Click Identity Link with Gmail / Discord */}
            <div className="p-3 rounded-xl bg-black/60 border border-[#f2c14e]/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-200">
                <span className="flex items-center gap-1.5 text-[#f2c14e]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Link with Gmail or Discord:</span>
                </span>
                <span className="text-[10px] text-stone-400">Quick Connect</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Google / Gmail button */}
                <button
                  type="button"
                  onClick={handleLinkGoogle}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition cursor-pointer active:scale-98 ${
                    linkedGmail 
                      ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300' 
                      : 'bg-stone-900 border-stone-700 hover:border-[#f2c14e] text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span className="truncate">{linkedGmail ? 'Gmail Linked ✓' : 'Link with Gmail'}</span>
                </button>

                {/* Discord button */}
                <button
                  type="button"
                  onClick={handleLinkDiscord}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition cursor-pointer active:scale-98 ${
                    linkedDiscord 
                      ? 'bg-[#5865F2]/30 border-[#5865F2] text-indigo-200' 
                      : 'bg-[#5865F2]/15 border-[#5865F2]/40 hover:border-[#5865F2] text-indigo-200 hover:bg-[#5865F2]/25'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0 fill-[#5865F2]" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="truncate">{linkedDiscord ? 'Discord Linked ✓' : 'Link Discord'}</span>
                </button>
              </div>

              {/* Status Chips */}
              {(linkedGmail || linkedDiscord) && (
                <div className="pt-1.5 border-t border-stone-800 space-y-1 text-[11px] font-mono">
                  {linkedGmail && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="truncate">✓ Gmail: {linkedGmail}</span>
                      <button
                        type="button"
                        onClick={() => setLinkedGmail('')}
                        className="text-stone-500 hover:text-stone-300 ml-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {linkedDiscord && (
                    <div className="flex items-center justify-between text-indigo-300">
                      <span className="truncate">✓ Discord: {linkedDiscord}</span>
                      <button
                        type="button"
                        onClick={() => setLinkedDiscord('')}
                        className="text-stone-500 hover:text-stone-300 ml-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800 text-xs text-stone-300 space-y-1">
              <span className="font-bold text-[#f2c14e] block text-[11px] font-mono uppercase tracking-wider">
                Step 1: Single Callsign Username
              </span>
              <p>
                Enter your single name (e.g. <span className="text-[#f2c14e] font-semibold">Mahmoud</span> or <span className="text-[#f2c14e] font-semibold">Tariq</span> — single name only, no second name).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-stone-200 block font-bold">
                Username (Single Name) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError('');
                  }}
                  placeholder="e.g. Mahmoud, Tariq, Ahmed"
                  className={`w-full p-3 rounded-xl bg-black border text-stone-100 placeholder:text-stone-600 text-sm focus:outline-none transition ${
                    usernameError 
                      ? 'border-red-500 ring-1 ring-red-500' 
                      : 'border-stone-700 focus:border-[#f2c14e] focus:ring-1 focus:ring-[#f2c14e]'
                  }`}
                />
                <User className="w-4 h-4 text-stone-500 absolute right-3 top-3.5" />
              </div>
              <p className="text-[10px] text-stone-400 font-mono">
                ✓ Single first name only without family surname.
              </p>
              {usernameError && (
                <p className="text-xs text-red-400 flex items-center gap-1 font-mono pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{usernameError}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-stone-300 block">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@thunderbolt.unit"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-stone-800 focus:border-[#f2c14e] text-stone-200 placeholder:text-stone-600 text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-stone-300 block">
                  Steam UID / Unit ID (Optional)
                </label>
                <span className="text-[10px] text-[#f2c14e] font-mono">e.g. 76561198... or TU-9198</span>
              </div>
              <input
                type="text"
                value={steamUid}
                onChange={(e) => setSteamUid(e.target.value)}
                placeholder="Leave blank for auto-generated TU-XXXX"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-stone-800 focus:border-[#f2c14e] text-stone-200 placeholder:text-stone-600 text-xs font-mono focus:outline-none"
              />
              <p className="text-[10px] text-stone-500 font-mono">
                Your permanent unit identification tag matching your Steam profile.
              </p>
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#f2c14e]/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Next: Military Rank & Clearance</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            STEP 2: MILITARY RANK & ROLE (Rank is controlled exclusively by Commander)
           ========================================================================= */}
        {step === 2 && (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#1c180e] border border-[#f2c14e]/30 text-xs text-stone-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-mono block">Chosen Username:</span>
                <span className="font-bold text-[#f2c14e] text-sm">{username}</span>
              </div>
              <button
                type="button"
                onClick={handleBackToUsername}
                className="text-[11px] text-stone-400 hover:text-white underline font-mono cursor-pointer"
              >
                Edit Username
              </button>
            </div>

            {/* CASE 1: USER IS RECRUIT / MEMBER -> RANK IS CONTROLLED BY COMMANDER */}
            {!isLeaderViewing ? (
              <div className="space-y-3">
                {/* Military Rule Callout */}
                <div className="p-3.5 rounded-xl bg-[#16201a] border-2 border-emerald-500/40 text-xs text-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Military Rank: Controlled Exclusively by Commander</span>
                  </div>
                  <p className="text-stone-300 font-sans leading-relaxed text-[11px]">
                    By Thunderbolt Unit regulations, <strong>operators cannot arbitrarily assign or change their own rank</strong>. Your registration will be forwarded to Unit Commander Maj. Gen. Dragon for verification and official rank commissioning.
                  </p>
                  <div className="pt-1 flex items-center justify-between border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                    <span>Initial Recruit Rank: [PVT | جندي]</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 font-bold">
                      Pending Clearance
                    </span>
                  </div>
                </div>

                {/* Optional Rank Suggestion */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-stone-300 block font-bold flex items-center justify-between">
                    <span>Requested Rank (Optional - Commander decides):</span>
                    <span className="text-[10px] text-[#f2c14e] font-mono">{selectedRank}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                    {AVAILABLE_RANKS.slice(0, 6).map((rk) => {
                      const isSelected = selectedRank === rk.formatted;
                      return (
                        <button
                          key={rk.id}
                          type="button"
                          onClick={() => {
                            tacticalAudio.playRadioClick();
                            setSelectedRank(rk.formatted);
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer text-xs font-mono ${
                            isSelected
                              ? 'bg-[#f2c14e]/20 border-[#f2c14e] text-[#f2c14e]'
                              : 'bg-black/60 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <span className="truncate">{rk.formatted}</span>
                          <span className="text-[10px] text-[#f2c14e]">{rk.insignia}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 text-[11px] text-amber-200">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>An immediate alert will reach Commander Dragon upon submission.</span>
                </div>
              </div>
            ) : (
              /* CASE 2: COMMANDER IS CREATING AN ACCOUNT DIRECTLY -> FULL CONTROL */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-stone-200 block font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#f2c14e]" />
                    <span>Assign Operator Military Rank:</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-[#f2c14e]">{selectedRank}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {AVAILABLE_RANKS.map((rk) => {
                    const isSelected = selectedRank === rk.formatted;
                    return (
                      <button
                        key={rk.id}
                        type="button"
                        onClick={() => {
                          tacticalAudio.playRadioClick();
                          setSelectedRank(rk.formatted);
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer text-xs font-mono ${
                          isSelected
                            ? 'bg-[#f2c14e] text-black font-bold border-[#f2c14e]'
                            : 'bg-black/60 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="truncate mr-1">
                          <span className="block truncate font-bold">{rk.formatted}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            {rk.isCommand && (
                              <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                                isSelected ? 'bg-black/30 text-black' : 'text-[#f2c14e]'
                              }`}>
                                Command
                              </span>
                            )}
                            {rk.isStaffOfficer && (
                              <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                                isSelected ? 'bg-black/30 text-black' : 'text-emerald-400'
                              }`}>
                                أ.ح
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] shrink-0 font-bold">{rk.insignia}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Role selection for commander */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-mono text-stone-200 block font-bold">
                    Clearance Role:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('member')}
                      className={`p-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
                        role === 'member'
                          ? 'bg-[#f2c14e] text-black font-bold border-[#f2c14e]'
                          : 'bg-black/60 border-stone-800 text-stone-400'
                      }`}
                    >
                      Member (Squad Operator)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('instructor')}
                      className={`p-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
                        role === 'instructor'
                          ? 'bg-[#f2c14e] text-black font-bold border-[#f2c14e]'
                          : 'bg-black/60 border-stone-800 text-stone-400'
                      }`}
                    >
                      {isCommandRank(selectedRank) ? 'Command' : 'Leader (Commander)'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons: Back & Complete */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleBackToUsername}
                className="py-2.5 px-3 rounded-xl border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#f2c14e]/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isLeaderViewing ? 'Commission Account' : 'Submit Application to Commander'}</span>
              </button>
            </div>
          </form>
        )}

        {/* GOOGLE LINK INTERACTIVE MODAL */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm bg-[#121613] border-2 border-emerald-500/60 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span className="font-display font-bold text-sm text-stone-100">Connect Google Account</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Connect with your Google / Gmail account to authenticate your callsign and link your identity to Thunderbolt Unit:
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-stone-300 block">
                  Gmail Address:
                </label>
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full p-2.5 rounded-xl bg-black border border-stone-700 focus:border-emerald-400 text-stone-100 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="py-2 px-3 rounded-xl border border-stone-700 bg-stone-900 text-stone-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmGoogleLink}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs cursor-pointer shadow-md transition"
                >
                  Confirm Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DISCORD LINK INTERACTIVE MODAL */}
        {showDiscordModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm bg-[#10121d] border-2 border-[#5865F2]/60 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 fill-[#5865F2]" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="font-display font-bold text-sm text-stone-100">Connect Discord Account</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDiscordModal(false)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Link your Discord profile to join the Thunderbolt Unit voice briefings, mission alert broadcasts, and squad comms:
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-stone-300 block">
                  Discord Username / Tag:
                </label>
                <input
                  type="text"
                  value={discordTagInput}
                  onChange={(e) => setDiscordTagInput(e.target.value)}
                  placeholder="e.g. Mahmoud#3003 or mahmoud"
                  className="w-full p-2.5 rounded-xl bg-black border border-stone-700 focus:border-[#5865F2] text-stone-100 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDiscordModal(false)}
                  className="py-2 px-3 rounded-xl border border-stone-700 bg-stone-900 text-stone-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDiscordLink}
                  className="py-2 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-mono font-bold text-xs cursor-pointer shadow-md transition"
                >
                  Confirm Link
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
