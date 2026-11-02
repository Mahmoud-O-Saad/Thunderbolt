import React, { useState, useEffect } from 'react';
import { Zap, Shield, Radio, CheckCircle2, ChevronRight } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface TacticalBootLoaderProps {
  onComplete: () => void;
  lang?: 'en' | 'ar';
}

interface BootStep {
  threshold: number;
  en: string;
  ar: string;
  code: string;
}

const BOOT_STEPS: BootStep[] = [
  {
    threshold: 15,
    code: 'SATCOM-01',
    en: 'Establishing encrypted MIL-SPEC satellite uplink...',
    ar: 'جاري إنشاء رابط الأقمار الصناعية المشفر وتأمين الترددات...',
  },
  {
    threshold: 40,
    code: 'THEATRE-02',
    en: 'Synchronizing ARMA III tactical operations & mission dossiers...',
    ar: 'مزامنة مسارح العمليات التكتيكية وسجلات مهام الصاعقة...',
  },
  {
    threshold: 65,
    code: 'ACADEMY-03',
    en: "Loading Sa'ka Academy qualification registries & promotion roadmap...",
    ar: 'تحميل سجلات أكاديمية الصاعقة وجداول التأهيل ونظام الترقيات...',
  },
  {
    threshold: 88,
    code: 'SEC-AUTH-04',
    en: 'Verifying Dragon Command security clearance & operator credentials...',
    ar: 'فحص تصاريح الدخول العسكرية والتحقق من هوية المقاتل...',
  },
  {
    threshold: 100,
    code: 'READY-05',
    en: 'Tactical Operations Center fully online. Authorization confirmed.',
    ar: 'مركز قيادة العمليات التكتيكية جاهز ومصرح بالدخول بالكامل.',
  },
];

export const TacticalBootLoader: React.FC<TacticalBootLoaderProps> = ({
  onComplete,
  lang = 'ar',
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  useEffect(() => {
    // Play tactical boot chime on start
    tacticalAudio.playBootChime();

    const startTime = Date.now();
    const duration = 2300; // 2.3 seconds smooth boot

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPercent = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawPercent);

      if (rawPercent >= 100) {
        clearInterval(interval);
        tacticalAudio.playRadioClick();
        setIsFinishing(true);
        setTimeout(() => {
          onComplete();
        }, 350);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleQuickSkip = () => {
    tacticalAudio.playRadioClick();
    setProgress(100);
    setIsFinishing(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  // Determine current active boot step
  const currentStep =
    BOOT_STEPS.find((s) => progress <= s.threshold) || BOOT_STEPS[BOOT_STEPS.length - 1];

  return (
    <div
      onClick={handleQuickSkip}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050706] text-[#ede8de] select-none cursor-pointer transition-opacity duration-300 ${
        isFinishing ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
      }`}
    >
      {/* Outer Tactical Ambient Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 blur-md scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/assets/OP/1.Cover_b397aaf7.png')` }}
      />
      <div className="absolute inset-0 bg-radial from-[#121814]/80 via-[#070a08]/90 to-black pointer-events-none" />
      <div className="absolute inset-0 tb-grid opacity-30 pointer-events-none" />

      {/* Military HUD corner brackets */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#f2c14e]/60 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#f2c14e]/60 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#f2c14e]/60 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#f2c14e]/60 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto px-6 py-8 relative z-10 flex flex-col items-center justify-between min-h-screen sm:min-h-[640px] text-center">
        {/* Top Watermark & Military Specs */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-[#f2c14e]/80 pb-4 border-b border-[#f2c14e]/15">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">SATCOM // ONLINE</span>
          </div>
          <span className="text-stone-400 uppercase">SYS-VER: 3.8.4-OPS</span>
          <div className="flex items-center gap-1 text-[#f2c14e]">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>24ms</span>
          </div>
        </div>

        {/* Central Tactical Logo & Pulse Rings */}
        <div className="my-auto py-6 flex flex-col items-center space-y-6">
          {/* Concentric Pulsing Gold Radar Rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer animated scanning ring */}
            <div className="absolute -inset-10 sm:-inset-12 rounded-full border border-[#f2c14e]/20 animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute -inset-6 sm:-inset-8 rounded-full border border-dashed border-[#f2c14e]/30 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border-2 border-[#f2c14e]/50" />

            {/* Glowing Backdrop Aura */}
            <div className="absolute inset-0 rounded-full bg-[#f2c14e]/15 blur-xl pointer-events-none" />

            {/* High-Resolution Egyptian Thunderbolt Eagle Emblem */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-b from-[#f2c14e] via-[#2e2612] to-black border-3 border-[#f2c14e] shadow-2xl shadow-[#f2c14e]/40 flex items-center justify-center overflow-hidden transition-transform duration-300">
              <img
                src="/assets/OP/thunderbolt_logo_hd.png"
                alt="Thunderbolt Eagle Emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(242,193,78,0.6)]"
              />
            </div>
          </div>

          {/* Unit Typography & Arabic Subtitle */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#f2c14e]/15 border border-[#f2c14e]/40 text-[#f2c14e] text-[11px] font-mono font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 fill-[#f2c14e]" />
              <span>THUNDERBOLT UNIT 🇪🇬 وحدة الصاعقة</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-[0.12em] text-stone-100 uppercase drop-shadow-md">
              EGYPTIAN SPECIAL FORCES
            </h1>

            <p className="text-xs text-[#d8b763] font-mono tracking-wider">
              Under the command of Maj. Gen. dragon
            </p>
          </div>

          {/* Loading Progress Bar & Live Status */}
          <div className="w-full max-w-xs space-y-3 pt-2">
            {/* Progress Readout */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#f2c14e] font-bold tracking-wider">
                [{currentStep.code}]
              </span>
              <span className="text-stone-100 font-bold tabular-nums text-sm">
                {progress}%
              </span>
            </div>

            {/* Tactical Gold Bar */}
            <div className="w-full h-2.5 bg-black/80 rounded-full border border-[#f2c14e]/40 p-0.5 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#f2c14e] to-yellow-300 transition-all duration-75 shadow-md shadow-[#f2c14e]/50"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dynamic Status Log Message */}
            <div className="min-h-[44px] flex flex-col items-center justify-center">
              <p className="text-xs sm:text-sm font-arabic text-stone-200 font-medium leading-relaxed">
                {currentStep.ar}
              </p>
              <span className="text-[10px] text-stone-400 font-mono tracking-wide">
                {currentStep.en}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Quick-Skip Option */}
        <div className="w-full pt-4 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-stone-400">
          <span className="text-stone-400">ARMA III · MILITARY SIMULATION</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuickSkip();
            }}
            className="px-3 py-1 rounded-lg bg-stone-900/90 hover:bg-[#f2c14e] text-stone-300 hover:text-black border border-stone-800 hover:border-[#f2c14e] transition-all flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>{lang === 'ar' ? 'تخطي والدخول' : 'SKIP TO APP'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
