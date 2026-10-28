import React, { useState } from 'react';
import { Mission, SquadMember } from '../types';
import { X, Calendar, Clock, MapPin, Radio, Shield, CheckCircle, Volume2, VolumeX, ListChecks, Crosshair, Users, AlertTriangle, Play, Square } from 'lucide-react';
import { tacticalAudio, speakBriefing, stopBriefing } from '../utils/audio';

interface MissionDetailModalProps {
  mission: Mission;
  allMembers: SquadMember[];
  onClose: () => void;
  onBroadcastAlert: (mission: Mission) => void;
  onToggleAcknowledge: (missionId: string) => void;
  isAcknowledged: boolean;
  onToggleObjective: (missionId: string, objectiveId: string) => void;
  lang: 'en' | 'ar';
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
  mission,
  allMembers,
  onClose,
  onBroadcastAlert,
  onToggleAcknowledge,
  isAcknowledged,
  onToggleObjective,
  lang,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isAr = lang === 'ar';

  const assignedMembers = allMembers.filter(m => mission.assignedSquad.includes(m.id));

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopBriefing();
      setIsPlayingAudio(false);
    } else {
      tacticalAudio.playRadioClick();
      setIsPlayingAudio(true);
      const textToRead = `${mission.codeName}. Scheduled for ${mission.dayName}, ${mission.date} at ${mission.time}. Under command of ${mission.commander}. ${mission.briefingOverview}. Rules of engagement: ${mission.rulesOfEngagement}.`;
      speakBriefing(textToRead, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleClose = () => {
    stopBriefing();
    tacticalAudio.playRadioClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-500/30 shrink-0">
              <img 
                src="/src/assets/images/thunderbolt_unit_insignia_1792663264729.jpg" 
                alt="Thunderbolt Insignia" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Shield className="w-3.5 h-3.5" />
                <span>THUNDERBOLT UNIT · {mission.commander}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {mission.codeName}: {mission.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Highlight Banner: Mission Date & Dispatch Notification */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-bold tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {isAr ? 'موعد تنفيذ المهمة المجدولة' : 'Scheduled Execution Date'}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
                {mission.dayName}, {mission.date} · {mission.time}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{mission.targetSector} ({mission.coordinates})</span>
              </p>
            </div>

            {/* Listen to Voice Briefing & Broadcast Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleAudioToggle}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAudio ? (isAr ? 'إيقاف الإيجاز الصوتي' : 'Stop Audio Briefing') : (isAr ? 'استماع للإيجاز الصوتي' : 'Listen to Briefing (Audio)')}</span>
              </button>

              <button
                onClick={() => onBroadcastAlert(mission)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isAr ? 'إرسال إشعار لكافة الأفراد' : 'Broadcast to All Operators'}</span>
              </button>
            </div>
          </div>

          {/* Full Explanation: What this Mission is about */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'إيجاز المهمة والشرح التكتيكي المفصل' : 'Mission Briefing & Tactical Explanation'}</span>
            </h4>
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3 text-sm text-slate-300 leading-relaxed">
              <p className="font-sans">
                {mission.briefingOverview}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">RULES OF ENGAGEMENT (قواعد الاشتباك):</span>
                  <span className="text-slate-300">{mission.rulesOfEngagement}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">ENVIRONMENT & METEOROLOGY (الطقس والتضاريس):</span>
                  <span className="text-slate-300">{mission.weatherConditions}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Operations Map Visualizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold uppercase">
                {isAr ? 'خريطة القطاع وإحداثيات الإنزال التكتيكية' : 'Sector Grid Coordinates & Tactical Overwatch Map'}
              </span>
              <span className="tabular-nums">GRID REF: {mission.coordinates}</span>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-[16/9] max-h-64 w-full bg-slate-950">
              <img 
                src="/src/assets/images/tactical_operations_map_1792663265618.jpg" 
                alt="Tactical Map" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-xs font-mono text-amber-400 flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded border border-slate-800 backdrop-blur">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>TARGET LZ: {mission.targetSector}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Split: Objectives Checklist & Squad Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Tactical Objectives Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'الأهداف التكتيكية المحددة' : 'Tactical Objectives Checklist'}</span>
              </h4>
              <div className="space-y-2">
                {mission.objectives.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      onToggleObjective(mission.id, obj.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-start gap-3 cursor-pointer ${
                      obj.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <CheckCircle className={`w-4 h-4 ${obj.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={obj.completed ? 'line-through text-slate-500' : 'font-medium'}>
                        {obj.text}
                      </p>
                      {obj.assignedRole && (
                        <span className="text-[11px] font-mono text-amber-400/80 mt-1 block">
                          Assigned: {obj.assignedRole}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Squad Deployment & Confirmation Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'المقاتلون المكلفون وحالة التأكيد' : 'Assigned Squad & Read Receipts'}</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {assignedMembers.length} Operators
                </span>
              </div>

              <div className="space-y-2">
                {assignedMembers.map((member) => {
                  const hasAck = member.acknowledgedMissions.includes(mission.id);
                  return (
                    <div 
                      key={member.id}
                      className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-[11px]">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>{member.name}</span>
                            <span className="text-amber-400 font-mono text-[10px]">{member.rank}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{member.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        {hasAck ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تم الاستلام' : 'Confirmed'}</span>
                          </span>
                        ) : (
                          <span className="text-amber-400/90 flex items-center gap-1">
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            <span>{isAr ? 'بانتظار التأكيد' : 'Pending Ack'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Equipment Loadout */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400 block mb-2 font-semibold">
                  {isAr ? 'قائمة العتاد والتجهيزات المعتمدة:' : 'Authorized Gear & Equipment:'}
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-300">
                  {mission.equipmentList.map((item, idx) => (
                    <span key={idx} className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400">
            <span>Commander: </span>
            <span className="text-amber-400 font-semibold">{mission.commander}</span>
            <span className="mx-2">·</span>
            <span>Thunderbolt Unit HQ</span>
          </div>

          <div className="flex items-center gap-3">
            {mission.discordUrl && (
              <a
                href={mission.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => tacticalAudio.playRadioClick()}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5865F2]/20"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Discord</span>
              </a>
            )}
            <button
              onClick={() => {
                tacticalAudio.playSuccessBeep();
                onToggleAcknowledge(mission.id);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
                isAcknowledged
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {isAcknowledged
                  ? (isAr ? 'أكدت استلام المهمة والجاهزية' : 'You Confirmed Ready')
                  : (isAr ? 'تأكيد استلامك للمهمة والجاهزية' : 'Confirm My Readiness')}
              </span>
            </button>

            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
