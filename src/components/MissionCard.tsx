import React from 'react';
import { Mission, SquadMember } from '../types';
import { Calendar, Clock, MapPin, Radio, Shield, CheckCircle, ChevronRight, Volume2 } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface MissionCardProps {
  mission: Mission;
  allMembers: SquadMember[];
  onOpenDetail: (mission: Mission) => void;
  onBroadcastAlert: (mission: Mission) => void;
  onToggleAcknowledge: (missionId: string) => void;
  isAcknowledgedByCurrent: boolean;
  lang: 'en' | 'ar';
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  allMembers,
  onOpenDetail,
  onBroadcastAlert,
  onToggleAcknowledge,
  isAcknowledgedByCurrent,
  lang,
}) => {
  const isAr = lang === 'ar';

  // Count assigned members who have acknowledged
  const assigned = allMembers.filter(m => mission.assignedSquad.includes(m.id));
  const acknowledgedCount = assigned.filter(m => m.acknowledgedMissions.includes(mission.id)).length;

  const priorityColor = {
    CRITICAL: 'text-rose-400',
    HIGH: 'text-amber-400',
    TACTICAL: 'text-sky-400',
    ROUTINE: 'text-slate-400',
  }[mission.priority];

  const statusColor = {
    ACTIVE: 'text-emerald-400',
    UPCOMING: 'text-amber-400',
    COMPLETED: 'text-slate-500',
    STANDBY: 'text-indigo-400',
  }[mission.status];

  return (
    <article className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between">
      <div>
        {/* Unboxed Metadata Header (No pill badges, clean separators) */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${priorityColor}`}>
              {mission.priority}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={`font-semibold ${statusColor}`}>
              {mission.status}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-bold tracking-wider">
              {mission.codeName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 tabular-nums">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <span>{mission.broadcastCount} {isAr ? 'بث للمقاتلين' : 'Dispatches'}</span>
          </div>
        </div>

        {/* Mission Title */}
        <h3 className="text-lg font-bold text-white mt-3 mb-1.5 leading-snug">
          {mission.title}
        </h3>

        {/* Highlighted Date & Time (Thursday 22/10/2026) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-300 my-2.5">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span className="tabular-nums">{mission.dayName}, {mission.date}</span>
          </div>
          <span aria-hidden="true" className="text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums">{mission.time}</span>
          </div>
          <span aria-hidden="true" className="text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1 text-slate-400 truncate max-w-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{mission.targetSector}</span>
          </div>
        </div>

        {/* Tactical Mission Summary / Explanation */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
          {mission.summary}
        </p>

        {/* Squad Readiness Progress */}
        <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-xs mb-4">
          <div className="flex items-center justify-between font-mono mb-1.5 text-slate-300">
            <span className="text-slate-400 text-[11px]">
              {isAr ? 'جاهزية المقاتلين المكلفين:' : 'Assigned Squad Readiness:'}
            </span>
            <span className="tabular-nums font-bold text-amber-400">
              {acknowledgedCount} / {assigned.length} {isAr ? 'أكدوا الاستلام' : 'Confirmed'}
            </span>
          </div>

          {/* Clean Progress Line */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${assigned.length > 0 ? (acknowledgedCount / assigned.length) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2">
            <span>Commander: {mission.commander}</span>
            <span>Coord: {mission.coordinates}</span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Quick Broadcast Button */}
          <button
            onClick={() => {
              tacticalAudio.playTacticalAlert();
              onBroadcastAlert(mission);
            }}
            title={isAr ? "إرسال إشعار فوري وتكليف لكل أفراد الوحدة" : "Broadcast Dispatch Alert to All Squad Members"}
            className="px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isAr ? 'بث إشعار للكل' : 'Broadcast to All'}</span>
          </button>

          {mission.discordUrl && (
            <a
              href={mission.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => tacticalAudio.playRadioClick()}
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#5865F2]/20 hover:bg-[#5865F2]/40 border border-[#5865F2]/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Discord</span>
            </a>
          )}

          {/* Quick Acknowledge */}
          <button
            onClick={() => {
              tacticalAudio.playSuccessBeep();
              onToggleAcknowledge(mission.id);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAcknowledgedByCurrent
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${isAcknowledgedByCurrent ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>
              {isAcknowledgedByCurrent 
                ? (isAr ? 'تم الاستلام والتأكيد' : 'Acknowledged & Ready') 
                : (isAr ? 'تأكيد استلام المهمة' : 'Acknowledge')}
            </span>
          </button>
        </div>

        {/* View Full Briefing Details */}
        <button
          onClick={() => {
            tacticalAudio.playRadioClick();
            onOpenDetail(mission);
          }}
          className="px-3.5 py-1.5 text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>{isAr ? 'شرح وإيجاز المهمة' : 'Full Briefing'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </article>
  );
};
