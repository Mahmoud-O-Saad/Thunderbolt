import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { AVAILABLE_RANKS } from '../data/initialData';
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
  isLeaderViewing?: boolean; // True if the current user opening this is Leader (Instructor)
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

  // Form states
  const [username, setUsername] = useState<string>(initialUser?.username || '');
  const [email, setEmail] = useState<string>(initialUser?.email || '');
  const [selectedRank, setSelectedRank] = useState<string>(
    initialUser?.rank ? initialUser.rank.replace(/\s*I\s*/g, ' | ') : (isLeaderViewing && initialRole === 'instructor' ? '[CPT | نقيب]' : '[PFC | جندي أول]')
  );
  const [isCustomRank, setIsCustomRank] = useState<boolean>(false);
  const [customRankValue, setCustomRankValue] = useState<string>('');
  const [role, setRole] = useState<UserRole>(initialRole || initialUser?.role || 'member');

  const [usernameError, setUsernameError] = useState<string>('');

  if (!isOpen) return null;

  const handleNextToRank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setUsernameError('برجاء كتابة اسم المستخدم للمتابعة / Please enter your username');
      return;
    }
    setUsernameError('');
    tacticalAudio.playRadioClick();
    setStep(2); // Move to Step 2: Rank
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

    // If Leader is creating account: immediately approved with selected rank.
    // If regular user is signing up: status is 'pending', base rank is [PVT | جندي], rank to be assigned by leader!
    const isApprovedImmediately = isLeaderViewing;
    const assignedRank = isApprovedImmediately ? finalRank : '[PVT | جندي]';
    const finalRole = isLeaderViewing ? (role === 'client' ? 'member' : role) : 'member';

    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      email: email.trim() || `${username.trim().toLowerCase().replace(/\s+/g, '')}@thunderbolt.unit`,
      rank: assignedRank,
      requestedRank: !isApprovedImmediately ? finalRank : undefined,
      approvalStatus: isApprovedImmediately ? 'approved' : 'pending',
      role: finalRole,
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
            src="/assets/aistudio/1.Cover_b397aaf7.png"
            alt="Thunderbolt Cover"
            className="w-full h-full object-cover object-top filter brightness-90 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d120f] via-black/40 to-black/20" />
          
          {/* Unit Insignia & Badge Overlay */}
          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-[#f2c14e]/60 p-0.5 bg-black/90 shadow-lg shadow-black/80 shrink-0">
                <img
                  src="/assets/aistudio/3.Logo_9d28ba9d.png"
                  alt="Unit Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-display text-xs font-bold text-stone-100 uppercase tracking-wider block drop-shadow">
                  THUNDERBOLT UNIT · وحدة الصاعقة
                </span>
                <span className="text-[10px] text-[#f2c14e] font-mono block drop-shadow">
                  MAJ. GEN. DRAGON · قيادة العمليات
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-black/80 border border-[#f2c14e]/50 text-[#f2c14e] font-mono text-[9px] font-bold shrink-0">
              {isLeaderViewing ? 'ADMIN' : 'REGISTRATION'}
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
                <span>{isLeaderViewing ? 'إضافة حساب مقاتل أو قائد' : 'طلب انضمام مقاتل جديد'}</span>
                <span className="text-[10px] text-[#f2c14e] font-mono tracking-wider font-normal">
                  / {isLeaderViewing ? 'ADD ACCOUNT' : 'SIGN UP'}
                </span>
              </h3>
              <p className="text-[10px] text-stone-400 font-mono">
                {isLeaderViewing ? 'اعتماد فوري بالرتبة المحددة' : 'التسجيل مخصص للوصول لبوابة ديسكورد والمهمة'}
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
              <span>1. الاسم المفرد (Username)</span>
            </span>

            <span className={`font-bold flex items-center gap-1.5 ${step === 2 ? 'text-[#f2c14e]' : 'text-stone-500'}`}>
              <span className="w-5 h-5 rounded-full bg-stone-900 border border-current flex items-center justify-center text-[10px]">
                2
              </span>
              <span>2. الرتبة واعتماد القائد</span>
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
            STEP 1: USERNAME (الاسم مفرد مثل Mahmoud وليس ثنائي)
           ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleNextToRank} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800 text-xs text-stone-300 space-y-1">
              <span className="font-bold text-[#f2c14e] block text-[11px] font-mono uppercase tracking-wider">
                الخطوة الأولى: اسم المستخدم (اسم مفرد فقط)
              </span>
              <p>
                ادخل اسمك الشخصي مفرد (مثلاً <span className="text-[#f2c14e] font-semibold">Mahmoud</span> أو <span className="text-[#f2c14e] font-semibold">Tariq</span> — بدون اسم ثنائي).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-stone-200 block font-bold">
                User name / اسم المستخدم (اسم مفرد) <span className="text-red-400">*</span>
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
                  placeholder="مثال: Mahmoud أو Tariq أو Ahmed"
                  className={`w-full p-3 rounded-xl bg-black border text-stone-100 placeholder:text-stone-600 text-sm focus:outline-none transition ${
                    usernameError 
                      ? 'border-red-500 ring-1 ring-red-500' 
                      : 'border-stone-700 focus:border-[#f2c14e] focus:ring-1 focus:ring-[#f2c14e]'
                  }`}
                />
                <User className="w-4 h-4 text-stone-500 absolute right-3 top-3.5" />
              </div>
              <p className="text-[10px] text-stone-400 font-mono">
                ✓ اكتب الاسم الأول فقط بدون اسم عائلة.
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
                Email / البريد الإلكتروني (اختياري)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@thunderbolt.unit"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-stone-800 focus:border-[#f2c14e] text-stone-200 placeholder:text-stone-600 text-xs font-mono focus:outline-none"
              />
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#f2c14e]/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>التالي: الرتبة واعتماد القيادة</span>
                <span className="font-mono text-[11px]">(Next: Military Clearance)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            STEP 2: MILITARY RANK & ROLE (التحكم في الرتبة حصر للقائد فقط)
           ========================================================================= */}
        {step === 2 && (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#1c180e] border border-[#f2c14e]/30 text-xs text-stone-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-mono block">اسم المستخدم المختار:</span>
                <span className="font-bold text-[#f2c14e] text-sm">{username}</span>
              </div>
              <button
                type="button"
                onClick={handleBackToUsername}
                className="text-[11px] text-stone-400 hover:text-white underline font-mono cursor-pointer"
              >
                تعديل الاسم
              </button>
            </div>

            {/* CASE 1: USER IS NOT LEADER -> RANK IS CONTROLLED BY LEADER */}
            {!isLeaderViewing ? (
              <div className="space-y-3">
                {/* Military Rule Callout */}
                <div className="p-3.5 rounded-xl bg-[#16201a] border-2 border-emerald-500/40 text-xs text-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                    <Lock className="w-4 h-4" />
                    <span>الرتبة العسكرية: يحددها القائد فقط</span>
                  </div>
                  <p className="text-stone-300 font-sans leading-relaxed text-[11px]">
                    بموجب الأوامر واللوائح العسكرية لوحدة الصاعقة، <strong>لا يمكن للمقاتل اختيار أو تغيير رتبته بنفسه</strong>. 
                    سيتم إرسال طلب انضمامك إلى قائد الوحدة (اللواء أ.ح Dragon) للمراجعة، وسيحدد القائد رتبتك العسكرية المناسبة ويعتمد حسابك.
                  </p>
                  <div className="pt-1 flex items-center justify-between border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                    <span>الرتبة الأولية المستجدة: [PVT | جندي]</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 font-bold">
                      قيد اعتماد القائد
                    </span>
                  </div>
                </div>

                {/* Optional Rank Suggestion */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-stone-300 block font-bold flex items-center justify-between">
                    <span>رتبة تقترحها (اختياري - القرار النهائي للقائد):</span>
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
                  <span>سيصل إشعار فوري للقائد بطلبك للموافقة عليه فور إرساله.</span>
                </div>
              </div>
            ) : (
              /* CASE 2: LEADER IS CREATING AN ACCOUNT DIRECTLY -> FULL CONTROL */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-stone-200 block font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#f2c14e]" />
                    <span>تحديد الرتبة العسكرية للمقاتل (بصفتك القائد):</span>
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
                        <span className="truncate">{rk.formatted}</span>
                        <span className="text-[10px]">{rk.insignia}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Role selection for leader */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-mono text-stone-200 block font-bold">
                    نوع الصلاحية:
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
                      Member (عضو الوحدة)
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
                      Leader (قائد / معلم)
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
                <span>السابق</span>
              </button>

              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#f2c14e]/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isLeaderViewing ? 'اعتماد وإضافة الحساب' : 'إرسال طلب الانضمام للقائد'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
