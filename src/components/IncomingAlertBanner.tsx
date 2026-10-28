import React from 'react';
import { BroadcastNotification } from '../types';
import { AlertTriangle, Radio, X, ChevronRight, Shield } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface IncomingAlertBannerProps {
  notification: BroadcastNotification;
  onOpenBriefing: (missionId: string) => void;
  onDismiss: () => void;
  lang: 'en' | 'ar';
}

export const IncomingAlertBanner: React.FC<IncomingAlertBannerProps> = ({
  notification,
  onOpenBriefing,
  onDismiss,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-[#0F172A] border-2 border-amber-500 rounded-xl p-4 shadow-2xl shadow-amber-500/30 text-slate-100 flex items-start justify-between gap-4">
        {/* Left Icon Badge */}
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <Radio className="w-5 h-5 animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <span>🚨 {isAr ? 'إشعار تكتيكي جديد وارد لجميع المقاتلين' : 'INCOMING MISSION DISPATCH // SQUAD ALERT'}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{notification.timestamp}</span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white">
            {notification.title}
          </h4>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                onOpenBriefing(notification.missionId);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <span>{isAr ? 'عرض إيجاز وتفاصيل المهمة' : 'Open Tactical Briefing'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              {isAr ? 'تجاهل' : 'Acknowledge & Dismiss'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
