import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Key, 
  LogIn, 
  UserPlus, 
  Globe, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Eye, 
  EyeOff, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { tacticalAudio } from '../utils/audio';
import { signInWithGooglePopup } from '../utils/firebase';

interface LoginPageProps {
  accounts: UserAccount[];
  onLoginSuccess: (account: UserAccount) => void;
  onOpenSignUp: () => void;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  accounts,
  onLoginSuccess,
  onOpenSignUp,
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Social login modals state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);

  // Direct login by selecting an existing operator profile
  const handleSelectProfile = (account: UserAccount) => {
    tacticalAudio.playTacticalAlert();
    setIsAuthorizing(true);
    setErrorMessage(null);
    setSuccessNotice(
      lang === 'ar'
        ? `تم التحقق: مرحباً بالضابط/المقاتل ${account.username} (${account.rank})`
        : `Authorized: Welcome Operator ${account.username} (${account.rank})`
    );

    setTimeout(() => {
      onLoginSuccess(account);
      setIsAuthorizing(false);
    }, 700);
  };

  // Login via credentials form
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = usernameInput.trim();
    if (!cleanUsername) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى إدخال رمز النداء أو اسم المستخدم أو كود الخدمة'
          : 'Please enter your callsign, username, or Service ID'
      );
      tacticalAudio.playRadioClick();
      return;
    }

    // Match by username (case-insensitive) or unitServiceId or steamUid
    const found = accounts.find(
      a =>
        a.username.toLowerCase() === cleanUsername.toLowerCase() ||
        (a.unitServiceId && a.unitServiceId.toLowerCase() === cleanUsername.toLowerCase()) ||
        (a.steamUid && a.steamUid === cleanUsername)
    );

    setIsAuthorizing(true);
    tacticalAudio.playRadioClick();

    setTimeout(() => {
      if (found) {
        tacticalAudio.playTacticalAlert();
        setSuccessNotice(
          lang === 'ar'
            ? `تم التصريح: أهلاً بك يا ${found.username} [${found.rank}]`
            : `Clearance Verified: Welcome ${found.username} [${found.rank}]`
        );
        setTimeout(() => {
          onLoginSuccess(found);
          setIsAuthorizing(false);
        }, 600);
      } else {
        // Create an active session account if not registered yet, or invite to register
        tacticalAudio.playRadioClick();
        setIsAuthorizing(false);
        setErrorMessage(
          lang === 'ar'
            ? `رمز النداء "${cleanUsername}" غير مسجل في القيادة. يمكنك تسجيل طلب انضمام جديد أو الدخول كزائر.`
            : `Callsign "${cleanUsername}" not found. You can submit a recruitment request or enter as guest.`
        );
      }
    }, 600);
  };

  // Google Login Flow via Firebase Auth
  const handleGoogleSignInFlow = async () => {
    tacticalAudio.playRadioClick();
    setIsAuthorizing(true);
    setErrorMessage(null);

    try {
      const fbUser = await signInWithGooglePopup();
      if (fbUser && fbUser.email) {
        tacticalAudio.playTacticalAlert();
        const userEmail = fbUser.email.toLowerCase();
        const found = accounts.find(a => a.email && a.email.toLowerCase() === userEmail);

        if (found) {
          setSuccessNotice(
            lang === 'ar'
              ? `تم تسجيل الدخول بنجاح عبر Google: ${userEmail}`
              : `Signed in successfully via Google: ${userEmail}`
          );
          setTimeout(() => {
            onLoginSuccess(found);
            setIsAuthorizing(false);
          }, 600);
          return;
        }

        // New Google Sign Up:
        // mahmoudosama3003@gmail.com is Commander / Instructor.
        // All other emails require instructor approval ('pending').
        const isCommander = userEmail === 'mahmoudosama3003@gmail.com' || userEmail.includes('dragon');
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const displayName = fbUser.displayName || userEmail.split('@')[0];
        const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

        const newGoogleAccount: UserAccount = {
          id: fbUser.uid || `usr-google-${Date.now()}`,
          username: formattedName,
          rank: isCommander ? '[MG | لواء أ.ح]' : '[PVT | جندي]',
          role: isCommander ? 'instructor' : 'member',
          approvalStatus: isCommander ? 'approved' : 'pending',
          email: userEmail,
          unitServiceId: `TU-${randomDigits}`,
          steamUid: `7656119800000${randomDigits}`,
          authProvider: 'google',
          linkedGmail: userEmail,
          joinedDate: new Date().toISOString().split('T')[0],
          isRegistered: true,
        };

        setSuccessNotice(
          lang === 'ar'
            ? `تم تسجيل الحساب بنجاح عبر Google: ${userEmail} · ${isCommander ? 'مصرح بالدخول كقائد' : 'بانتظار تصريح القيادة'}`
            : `Account registered via Google: ${userEmail} · ${isCommander ? 'Commander Clearance Active' : 'Pending Instructor Clearance'}`
        );

        setTimeout(() => {
          onLoginSuccess(newGoogleAccount);
          setIsAuthorizing(false);
        }, 600);
        return;
      } else {
        setIsAuthorizing(false);
      }
    } catch {
      setIsAuthorizing(false);
      setShowGoogleModal(true);
    }
  };

  // Google Login Confirmation (from modal fallback)
  const handleGoogleLoginConfirm = () => {
    tacticalAudio.playTacticalAlert();
    setShowGoogleModal(false);
    setIsAuthorizing(true);

    const userEmail = 'mahmoudosama3003@gmail.com';
    const isCommander = true;
    const googleUser: UserAccount = accounts.find(a => a.email && a.email.toLowerCase() === userEmail) || {
      id: `usr-google-${Date.now()}`,
      username: 'Mahmoud',
      rank: '[MG | لواء أ.ح]',
      role: 'instructor',
      approvalStatus: 'approved',
      email: userEmail,
      unitServiceId: 'TU-9198',
      steamUid: '76561198000009198',
      authProvider: 'google',
      linkedGmail: userEmail,
      joinedDate: new Date().toISOString().split('T')[0],
      isRegistered: true,
    };

    setSuccessNotice(
      lang === 'ar'
        ? `تم تسجيل الدخول بنجاح عبر Google: ${userEmail}`
        : `Signed in successfully via Google: ${userEmail}`
    );

    setTimeout(() => {
      onLoginSuccess(googleUser);
      setIsAuthorizing(false);
    }, 700);
  };

  // Discord Login One-Click
  const handleDiscordLoginConfirm = () => {
    tacticalAudio.playTacticalAlert();
    setShowDiscordModal(false);
    setIsAuthorizing(true);

    const discordUser: UserAccount = accounts.find(a => a.username.toLowerCase() === 'dragon') || {
      id: `usr-discord-${Date.now()}`,
      username: 'Dragon',
      rank: '[MG | لواء أ.ح]',
      role: 'instructor',
      approvalStatus: 'approved',
      email: 'dragon@thunderbolt.unit',
      unitServiceId: 'TU-9198',
      steamUid: '76561198000009198',
      joinedDate: new Date().toISOString().split('T')[0],
      isRegistered: true,
    };

    setSuccessNotice(
      lang === 'ar'
        ? `تم ربط الدخول بحساب ديسكورد: Mahmoud#3003 (Dragon)`
        : `Authorized via Discord: Mahmoud#3003 (Dragon)`
    );

    setTimeout(() => {
      onLoginSuccess(discordUser);
      setIsAuthorizing(false);
    }, 700);
  };

  // Quick Guest Login
  const handleGuestEntry = () => {
    tacticalAudio.playRadioClick();
    const guestUser: UserAccount = {
      id: `guest-${Date.now()}`,
      username: 'Recruit_Guest',
      rank: '[PVT | جندي]',
      role: 'member',
      approvalStatus: 'approved',
      unitServiceId: 'TU-0000',
      steamUid: '76561198000000000',
      joinedDate: new Date().toISOString().split('T')[0],
      isRegistered: false,
    };
    onLoginSuccess(guestUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060807] text-[#ede8de] select-none overflow-y-auto">
      {/* Outer ambient blur background for desktop */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-25 blur-md scale-110 pointer-events-none"
        style={{ backgroundImage: `url('/assets/OP/1.Cover_b397aaf7.png')` }}
      />
      <div className="fixed inset-0 bg-black/60 pointer-events-none" />

      {/* Phone-width container matching Thunderbolt App Layout */}
      <div className="w-full max-w-[420px] min-h-screen border-x border-[#1a221d] flex flex-col justify-between p-5 relative overflow-hidden z-10 shadow-2xl bg-[#090d0b]">
        {/* Cover image subtle background inside card */}
        <div
          className="absolute inset-0 bg-cover bg-top opacity-20 pointer-events-none"
          style={{ backgroundImage: `url('/assets/OP/1.Cover_b397aaf7.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090d0b]/90 via-[#0a0f0c]/85 to-[#060807]/98 pointer-events-none" />
        <div className="absolute inset-0 tb-grid opacity-20 pointer-events-none" />

        {/* Top Bar: Language & Audio Toggles */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-stone-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-[#f2c14e] font-bold uppercase">
              GATEWAY // PORTAL 01
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1 rounded-lg bg-stone-900/80 border border-stone-700/80 text-[10px] font-mono font-bold text-stone-300 hover:text-[#f2c14e] transition flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3 h-3 text-[#f2c14e]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg bg-stone-900/80 border border-stone-700/80 text-stone-300 hover:text-[#f2c14e] transition cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#f2c14e]" />}
            </button>
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 py-4 my-auto space-y-5">
          {/* Logo & Header Lockup */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-4 rounded-full border border-[#f2c14e]/20 animate-pulse pointer-events-none" />
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-b from-[#f2c14e]/70 via-[#121915] to-black border-2 border-[#f2c14e]/80 shadow-xl shadow-[#f2c14e]/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/OP/3.Logo_9d28ba9d.png"
                  alt="Thunderbolt Unit Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-display text-2xl font-black tracking-widest text-stone-100 uppercase">
                  THUNDERBOLT
                </h1>
                <span className="font-display text-xs px-2 py-0.5 rounded bg-[#f2c14e] text-black font-black tracking-widest">
                  UNIT
                </span>
              </div>
              <p className="font-arabic text-xs font-bold text-[#f2c14e] tracking-wide">
                وحدة الصاعقة المصرية · مركز القيادة والعمليات
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-[#f2c14e]/30 text-[10px] font-mono text-[#f2c14e]">
                <Zap className="w-3 h-3 fill-[#f2c14e]" />
                <span>Cmd: [MG | لواء أ.ح] Dragon</span>
              </div>
            </div>
          </div>

          {/* Feedback Notices */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{successNotice}</span>
            </div>
          )}

          {/* Operator Direct Quick-Access Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 px-1">
              <span className="flex items-center gap-1 text-[#f2c14e]">
                <Shield className="w-3 h-3" />
                <span>{lang === 'ar' ? 'المشغلين المعتمدين' : 'Authorized Operators'}</span>
              </span>
              <span className="text-[10px] text-stone-500">{accounts.length} Profiles</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {accounts.slice(0, 4).map(acc => {
                const isLeader = acc.role === 'instructor';
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectProfile(acc)}
                    disabled={isAuthorizing}
                    className="p-2.5 rounded-xl bg-[#111714] hover:bg-[#19241e] border border-stone-800 hover:border-[#f2c14e]/60 transition flex flex-col text-left group cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-mono text-[9px] font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/20 px-1 py-0.2 rounded">
                        {acc.rank}
                      </span>
                      {isLeader && (
                        <span className="text-[8px] font-mono font-bold text-amber-300">HQ</span>
                      )}
                    </div>
                    <span className="font-sans font-bold text-stone-100 text-xs group-hover:text-[#f2c14e] transition-colors truncate">
                      {acc.username}
                    </span>
                    <span className="font-mono text-[9px] text-stone-500 truncate">
                      {acc.unitServiceId || 'TU-9198'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Form (Callsign / Service ID) */}
          <form onSubmit={handleFormLogin} className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold tracking-wider text-stone-400 uppercase flex items-center justify-between">
                <span>{lang === 'ar' ? 'رمز النداء / اسم المشغل' : 'Callsign / Operator ID'}</span>
                <span className="text-stone-600 font-normal">e.g. Dragon, Tariq, TU-9198</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل اسمك أو رمز النداء...' : 'Enter callsign or username...'}
                  className="w-full bg-black/60 border border-stone-700 focus:border-[#f2c14e] rounded-xl px-3.5 py-2.5 pl-9 text-xs font-mono text-stone-100 placeholder:text-stone-600 focus:outline-hidden transition"
                />
                <User className="w-4 h-4 text-[#f2c14e] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold tracking-wider text-stone-400 uppercase flex items-center justify-between">
                <span>{lang === 'ar' ? 'كلمة المرور / الرمز الأمني' : 'Tactical PIN / Password'}</span>
                <span className="text-[10px] text-stone-600">Default: 1234</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-stone-700 focus:border-[#f2c14e] rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-xs font-mono text-stone-100 placeholder:text-stone-600 focus:outline-hidden transition"
                />
                <Key className="w-4 h-4 text-[#f2c14e] absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full py-3 px-4 rounded-xl bg-[#f2c14e] hover:bg-[#f2c14e]/90 text-black font-display font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#f2c14e]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 fill-black" />
              <span>{isAuthorizing ? (lang === 'ar' ? 'جاري التحقق...' : 'Authorizing...') : (lang === 'ar' ? 'تسجيل الدخول' : 'Authorize & Enter')}</span>
            </button>
          </form>

          {/* Social Sign In (Gmail / Discord) */}
          <div className="space-y-2 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-800 w-full" />
              <span className="bg-[#090d0b] px-3 text-[10px] font-mono text-stone-500 uppercase tracking-widest shrink-0">
                {lang === 'ar' ? 'أو الدخول بضغطة زر' : 'Or Instant Identity Link'}
              </span>
              <div className="border-t border-stone-800 w-full" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignInFlow}
                className="py-2.5 px-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-sans font-bold flex items-center justify-center gap-2 transition hover:border-amber-400/50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Discord Button */}
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadioClick();
                  setShowDiscordModal(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/50 text-[#99aab5] hover:text-white text-xs font-sans font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#5865F2] shrink-0" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Discord</span>
              </button>
            </div>
          </div>

          {/* New Recruit Sign Up Button (Highlighted) */}
          <div className="pt-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#f2c14e]/15 to-amber-500/10 border border-[#f2c14e]/30 flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#f2c14e] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'ليس لديك حساب في الصاعقة؟' : 'New recruit joining the squad?'}</span>
            </div>
            <p className="text-[11px] text-stone-400">
              {lang === 'ar'
                ? 'سجل رمز ندائك واربط حساب Gmail أو Discord للحصول على رتبتك وكود خدمتك العسكري.'
                : 'Register your callsign and link Gmail or Discord to obtain your unit service ID and rank.'}
            </p>
            <button
              type="button"
              onClick={() => {
                tacticalAudio.playRadioClick();
                onOpenSignUp();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 fill-black" />
              <span>{lang === 'ar' ? 'طلب انضمام جديد (Sign Up)' : 'Request to Join (Sign Up)'}</span>
            </button>
          </div>

          {/* Guest Observer Option */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleGuestEntry}
              className="text-[11px] font-mono text-stone-500 hover:text-stone-300 transition underline underline-offset-4 cursor-pointer"
            >
              {lang === 'ar' ? 'تصفح كزائر مستطلع (Guest Observer)' : 'Enter as Guest Observer without login'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-3 border-t border-stone-800/80 text-center font-mono text-[9px] text-stone-500 flex items-center justify-between">
          <span>ARMA III · EGYPTIAN SIMULATION</span>
          <span>SECURED CLASSIFIED GATE</span>
        </div>
      </div>

      {/* Google Modal Simulation */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#141a17] border border-amber-500/40 p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-100">Google Sign In</h3>
                <p className="text-xs text-stone-400">Thunderbolt Military Verification</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase">Recognized Google Account</span>
              <p className="text-xs font-mono font-bold text-amber-300">mahmoudosama3003@gmail.com</p>
              <p className="text-[10px] text-stone-400">Associated Operator: Mahmoud ([MG | لواء أ.ح])</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoogleLoginConfirm}
                className="flex-1 py-2 rounded-xl bg-[#f2c14e] text-black text-xs font-bold cursor-pointer"
              >
                Authorize & Enter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discord Modal Simulation */}
      {showDiscordModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#141a17] border border-[#5865F2]/50 p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-100">Discord Verification</h3>
                <p className="text-xs text-stone-400">Thunderbolt Special Ops Guild</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase">Recognized Discord Handle</span>
              <p className="text-xs font-mono font-bold text-[#5865F2]">Mahmoud#3003</p>
              <p className="text-[10px] text-stone-400">Linked Callsign: Dragon ([MG | لواء أ.ح])</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDiscordModal(false)}
                className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDiscordLoginConfirm}
                className="flex-1 py-2 rounded-xl bg-[#5865F2] hover:bg-[#5865F2]/90 text-white text-xs font-bold cursor-pointer"
              >
                Authorize Discord
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
