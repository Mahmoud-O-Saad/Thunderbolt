import React from 'react';
import { BroadcastNotification, SquadMember, Mission } from '../types';
import { Bell, Radio, CheckCircle, Clock, Volume2, Shield, AlertTriangle } from 'lucide-react';
import { tacticalAudio, sendBrowserNotification } from '../utils/audio';

interface NotificationsCenterModalProps {
  notifications: BroadcastNotification[];
  allMembers: SquadMember[];
  onSelectMission: (missionId: string) => void;
  onSendTestNotification: () => void;
  lang: 'en' | 'ar';
}

export const NotificationsCenterModal: React.FC<NotificationsCenterModalProps> = ({
  notifications,
  allMembers,
  onSelectMission,
  onSendTestNotification,
  lang,
}) => {
  const isAr = lang === 'ar';

  const handleRequestPush = async () => {
    tacticalAudio.playTacticalAlert();
    await sendBrowserNotification('Thunderbolt Unit · Push Alerts Enabled', {
      body: 'Operational network link active. All new missions will trigger immediate tactical dispatch.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Test Alert & Push Permissions */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>REAL-TIME DISPATCH BROADCAST FEED</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Thunderbolt Tactical Broadcast Center
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Every new mission logged dispatches an audible alert and push notification to all squad operators simultaneously.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleRequestPush}
            className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Enable Push Alerts</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playTacticalAlert();
              onSendTestNotification();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Test Dispatch Siren</span>
          </button>
        </div>
      </div>

      {/* Broadcast Feed List */}
      <div className="space-y-3">
        {notifications.map((notif) => {
          const readCount = notif.readByMembers.length;
          return (
            <article
              key={notif.id}
              className="p-4 bg-[#111827]/90 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                {/* Unboxed Metadata (Zero-Pill) */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">{notif.priority}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300 font-bold">{notif.missionCode}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400 tabular-nums">{notif.timestamp}</span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {notif.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {notif.message}
                </p>

                {/* Sender & Read Receipts */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
                  <span>From: <strong className="text-amber-400 font-semibold">{notif.sender}</strong></span>
                  <span aria-hidden="true" className="text-slate-700">|</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Delivered to {readCount} / {allMembers.length} Operators</span>
                  </span>
                </div>
              </div>

              {/* View Briefing Button */}
              <div className="shrink-0 flex sm:flex-col items-center justify-between gap-2">
                <button
                  onClick={() => {
                    tacticalAudio.playRadioClick();
                    onSelectMission(notif.missionId);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Open Briefing
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
