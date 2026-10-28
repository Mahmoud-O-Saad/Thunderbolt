import React, { useState } from 'react';
import { Mission, SquadMember } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Radio, 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  Play, 
  Square, 
  Users, 
  ListChecks, 
  Server, 
  MessageSquare, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { tacticalAudio, speakBriefing, stopBriefing } from '../utils/audio';

interface DedicatedMissionPageProps {
  mission: Mission;
  allMembers: SquadMember[];
  onBack: () => void;
  onBroadcastAlert: (mission: Mission) => void;
  onToggleAcknowledge: (missionId: string) => void;
  isAcknowledged: boolean;
  onToggleObjective: (missionId: string, objectiveId: string) => void;
  commanderName: string;
  lang: 'en' | 'ar';
}

export const DedicatedMissionPage: React.FC<DedicatedMissionPageProps> = ({
  mission,
  allMembers,
  onBack,
  onBroadcastAlert,
  onToggleAcknowledge,
  isAcknowledged,
  onToggleObjective,
  commanderName,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const assignedMembers = allMembers.filter(m => mission.assignedSquad.includes(m.id));
  const confirmedCount = assignedMembers.filter(m => m.acknowledgedMissions.includes(mission.id)).length;

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopBriefing();
      setIsPlayingAudio(false);
    } else {
      tacticalAudio.playRadioClick();
      setIsPlayingAudio(true);
      const text = `${mission.codeName}. Under command of ${commanderName}. Scheduled for ${mission.dayName}, ${mission.date} at ${mission.time}. Location: ${mission.targetSector}. ${mission.briefingOverview} Rules of engagement: ${mission.rulesOfEngagement}.`;
      speakBriefing(text, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={() => {
            tacticalAudio.playRadioClick();
            stopBriefing();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'العودة لمركز العمليات' : 'Back to Command Center'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-amber-400 font-bold">MISSION DOSSIER</span>
          <span>·</span>
          <span>{mission.codeName}</span>
          <span>·</span>
          <span className="tabular-nums">{mission.date}</span>
        </div>
      </div>

      {/* Main Mission Hero Banner with Insignia & Commander Dragon */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#070A11] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Logo Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-amber-500/50 shadow-xl shadow-amber-500/20 shrink-0 bg-slate-950 p-0.5">
              <img
                src="/src/assets/images/thunderbolt_eagle_logo_1792663524960.jpg"
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                  {mission.priority} PRIORITY
                </span>
                <span>·</span>
                <span>STATUS: {mission.status}</span>
                <span>·</span>
                <span className="text-slate-300">CMD: {commanderName}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {mission.codeName}: {mission.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-300">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{mission.dayName}, {mission.date}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mission.time}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{mission.targetSector} ({mission.coordinates})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Audio Briefing Toggle */}
            <button
              onClick={handleAudioToggle}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isPlayingAudio
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isPlayingAudio ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlayingAudio ? (isAr ? 'إيقاف الصوت' : 'Stop Audio') : (isAr ? 'استماع للإيجاز' : 'Play Audio Briefing')}</span>
            </button>

            {/* Acknowledge Button */}
            <button
              onClick={() => {
                tacticalAudio.playSuccessBeep();
                onToggleAcknowledge(mission.id);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isAcknowledged
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isAcknowledged ? (isAr ? 'تم تأكيد جاهزيتك' : 'Ready Confirmed') : (isAr ? 'تأكيد الحضور والجاهزية' : 'Confirm Attendance')}</span>
            </button>

            {/* Discord Registration Link */}
            <a
              href={mission.discordUrl || 'https://discord.gg/thunderbolt-ops'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => tacticalAudio.playRadioClick()}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#5865F2] hover:bg-[#4752c4] text-white transition-all flex items-center gap-2 shadow-lg shadow-[#5865F2]/20 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>{isAr ? 'التسجيل عبر ديسكورد' : 'Register on Discord'}</span>
            </a>

            {/* Broadcast Button */}
            <button
              onClick={() => onBroadcastAlert(mission)}
              className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>{isAr ? 'بث إشعار للكل' : 'Broadcast to Squad'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Detailed Briefing & Operational Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spoken Briefing Explanation & Sector Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Explanation Box */}
          <div className="p-6 bg-[#111827] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{isAr ? 'شرح المهمة والتفاصيل العملياتية' : 'Mission Explanation & Tactical Concept'}</span>
              </h2>
              <span className="text-xs font-mono text-amber-400">
                {isAr ? 'تاريخ المهمة: الخميس ٢٢/١٠/٢٠٢٦' : 'Mission Date: Thursday 22/10/2026'}
              </span>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed font-sans space-y-3">
              <p className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                {mission.briefingOverview}
              </p>
            </div>

            {/* ROE & Environment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                <span className="text-amber-400 font-bold block">
                  {isAr ? 'قواعد الاشتباك (ROE):' : 'RULES OF ENGAGEMENT:'}
                </span>
                <span className="text-slate-300">{mission.rulesOfEngagement}</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                <span className="text-amber-400 font-bold block">
                  {isAr ? 'الطقس وظروف الميدان:' : 'METEOROLOGY & TERRAIN:'}
                </span>
                <span className="text-slate-300">{mission.weatherConditions}</span>
              </div>
            </div>
          </div>

          {/* Tactical Sector Map */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold">
                TACTICAL OVERWATCH SATELLITE MAP // SECTOR {mission.targetSector}
              </span>
              <span className="tabular-nums">GRID REF: {mission.coordinates}</span>
            </div>

            <div className="relative aspect-[16/9] w-full bg-slate-950">
              <img
                src="/src/assets/images/tactical_operations_map_1792663265618.jpg"
                alt="Tactical Overwatch Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/80 backdrop-blur p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>OBJECTIVE LZ: Ridge Bravo Outpost Echo-4</span>
                </div>
                <span className="text-emerald-400 font-bold">FEED: LIVE SAT-UPLINK</span>
              </div>
            </div>
          </div>

          {/* ARMA III & Military Gaming Community Server Setup */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-[#111827] border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'بيانات سيرفر اللعبة والاتصال الصوتي (ARMA 3)' : 'ARMA 3 Server & Tactical Radio Channels'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">SERVER IP</span>
                <span className="text-amber-400 font-bold">arma.thunderbolt-unit.eg</span>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">TEAMSPEAK / ACRE2</span>
                <span className="text-slate-200 font-bold">Freq: 45.00 MHz (Ch. 1)</span>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">MODPACK</span>
                <span className="text-emerald-400 font-bold">Thunderbolt v4.8 Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Objectives Checklist, Squad Readiness, Gear */}
        <div className="space-y-6">
          {/* Tactical Objectives */}
          <div className="p-5 bg-[#111827] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'قائمة الأهداف التكتيكية' : 'Tactical Objectives'}</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {mission.objectives.filter(o => o.completed).length} / {mission.objectives.length}
              </span>
            </div>

            <div className="space-y-2">
              {mission.objectives.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => {
                    tacticalAudio.playRadioClick();
                    onToggleObjective(mission.id, obj.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-start gap-3 cursor-pointer ${
                    obj.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${obj.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <div>
                    <p className={obj.completed ? 'line-through text-slate-500' : 'font-medium'}>
                      {obj.text}
                    </p>
                    {obj.assignedRole && (
                      <span className="text-[11px] font-mono text-amber-400/90 mt-1 block">
                        Assigned: {obj.assignedRole}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Squad Roster & Attendance Confirmation */}
          <div className="p-5 bg-[#111827] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'حضور أفراد الوحدة' : 'Squad Operators'}</span>
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {confirmedCount} / {assignedMembers.length} {isAr ? 'جاهزون' : 'Ready'}
              </span>
            </div>

            <div className="space-y-2">
              {assignedMembers.map((member) => {
                const hasAck = member.acknowledgedMissions.includes(mission.id);
                return (
                  <div
                    key={member.id}
                    className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{member.name}</span>
                          <span className="text-amber-400 font-mono text-[11px]">{member.rank}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{member.role}</span>
                      </div>
                    </div>

                    <div className="font-mono text-[11px]">
                      {hasAck ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{isAr ? 'حاضر' : 'Confirmed'}</span>
                        </span>
                      ) : (
                        <span className="text-amber-400/80 flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          <span>{isAr ? 'بانتظار' : 'Pending'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment */}
          <div className="p-5 bg-[#111827] border border-slate-800 rounded-2xl space-y-3 text-xs font-mono">
            <span className="text-slate-400 block font-bold uppercase tracking-wider">
              {isAr ? 'العتاد والتجهيزات المعتمدة للمهمة:' : 'AUTHORIZED LOADOUT:'}
            </span>
            <div className="flex flex-wrap gap-1.5 text-slate-300">
              {mission.equipmentList.map((eq, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
