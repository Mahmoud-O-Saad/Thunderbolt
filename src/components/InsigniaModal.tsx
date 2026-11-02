import React from 'react';
import { X, Shield, Zap, RotateCcw, ExternalLink } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface InsigniaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayLoading: () => void;
  lang?: 'en' | 'ar';
}

export const InsigniaModal: React.FC<InsigniaModalProps> = ({
  isOpen,
  onClose,
  onReplayLoading,
  lang = 'ar',
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#090d0b] border-2 border-[#f2c14e]/50 p-6 shadow-2xl shadow-[#f2c14e]/20 text-stone-100 space-y-5 relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-radial from-[#f2c14e]/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 tb-grid opacity-20 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            tacticalAudio.playRadioClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <span className="text-[10px] font-mono tracking-widest text-[#f2c14e] font-bold uppercase px-3 py-1 rounded-full bg-[#f2c14e]/10 border border-[#f2c14e]/30">
            OFFICIAL UNIT INSIGNIA // شعار الوحدة الرسمي
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100 uppercase tracking-wider font-display">
            THUNDERBOLT UNIT
          </h2>
          <p className="text-xs text-[#d8b763] font-mono">
            وحدة الصاعقة المصرية · ARMA III SIMULATION
          </p>
        </div>

        {/* Ultra-Clear HD Emblem Display */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          {/* Animated concentric rings */}
          <div className="absolute w-56 h-56 rounded-full border border-[#f2c14e]/15 animate-pulse pointer-events-none" />
          <div className="absolute w-48 h-48 rounded-full border border-dashed border-[#f2c14e]/25 pointer-events-none" />

          {/* Emblem Container with Gold Rim */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full p-2 bg-gradient-to-b from-[#f2c14e] via-[#352b13] to-black border-3 border-[#f2c14e] shadow-2xl shadow-[#f2c14e]/40 flex items-center justify-center overflow-hidden">
            <img
              src="/assets/OP/thunderbolt_logo_hd.png"
              alt="Thunderbolt Emblem HD"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(242,193,78,0.7)]"
            />
          </div>
        </div>

        {/* Insignia Details & Motto */}
        <div className="p-4 rounded-2xl bg-black/60 border border-stone-800 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#f2c14e] font-mono font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#f2c14e]" />
            <span>Under the command of Maj. Gen. dragon</span>
          </div>
          <p className="text-xs text-stone-300 font-arabic leading-relaxed">
            الشعار الرسمي لوحدة الصاعقة: الصقر الذهبي الهجومي ورمز البرق التكتيكي، يمثل السرعة والشجاعة والجاهزية القتالية العالية في كافة مسارح العمليات.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
              onReplayLoading();
            }}
            className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#f2c14e] border border-[#f2c14e]/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تشغيل شاشة التحميل' : 'Replay Boot Loader'}</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl bg-[#f2c14e] hover:bg-[#f2c14e]/90 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md shadow-[#f2c14e]/20"
          >
            <span>{lang === 'ar' ? 'إغلاق ومتابعة' : 'Close'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
