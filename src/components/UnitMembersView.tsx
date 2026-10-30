import React from 'react';
import { SquadMember, Mission } from '../types';
import { Shield, Radio, CheckCircle, Smartphone, Wifi, UserCheck, AlertCircle } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface UnitMembersViewProps {
  members: SquadMember[];
  missions: Mission[];
  onPingMember: (member: SquadMember) => void;
  lang: 'en' | 'ar';
}

export const UnitMembersView: React.FC<UnitMembersViewProps> = ({
  members,
  missions,
  onPingMember,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6">
      {/* Header and Summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>THUNDERBOLT UNIT SQUAD DIRECTORY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Unit Operators & Tactical Readiness Roster
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            All operators receive real-time mission briefs and notifications dispatched by Commander Dragon.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">TOTAL SQUAD</span>
            <span className="text-base font-bold text-white tabular-nums">{members.length} Operators</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono">
            <span className="text-emerald-400 block text-[10px]">COMBAT READY</span>
            <span className="text-base font-bold text-emerald-300 tabular-nums">
              {members.filter(m => m.status === 'READY').length} / {members.length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Operators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => {
          const ackCount = member.acknowledgedMissions.length;
          return (
            <div
              key={member.id}
              className="bg-[#111827]/90 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Member Top Bar: Unboxed metadata */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#f2c14e]">{member.rank}</span>
                    <span className="text-[10px] text-stone-300 font-bold bg-black/60 px-1.5 py-0.5 rounded border border-stone-700">
                      {member.unitServiceId || 'TU-9198'}
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className={member.status === 'READY' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                    {member.status}
                  </span>
                </div>

                {/* Member Name and Role */}
                <div className="mt-3 flex items-start gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-mono font-black text-amber-400 text-sm shrink-0 shadow-inner">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {member.name}
                    </h4>
                    <p className="text-xs text-amber-400/90 font-mono mt-0.5">
                      {member.role}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-1">
                      <Wifi className="w-3 h-3 text-emerald-500" />
                      <span>Comms: {member.deviceType}</span>
                    </div>
                  </div>
                </div>

                {/* Mission Readiness Status */}
                <div className="mt-4 p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Missions Confirmed:</span>
                    <span className="text-slate-200 font-bold tabular-nums">
                      {ackCount} / {missions.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Last Uplink:</span>
                    <span className="text-slate-300">{member.lastSeen}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Ping Operator */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {member.status === 'READY' ? 'Ready for Deployment' : 'On Standby'}
                </span>
                <button
                  onClick={() => {
                    tacticalAudio.playRadioClick();
                    onPingMember(member);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Radio className="w-3 h-3" />
                  <span>Send Alert Ping</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
