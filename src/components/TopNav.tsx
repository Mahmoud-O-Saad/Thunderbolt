import React from 'react';
import { Bell, Volume2, VolumeX, Plus, Globe, Users, Shield, Radio } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface TopNavProps {
  activeTab: 'missions' | 'squad' | 'briefing' | 'notifications';
  setActiveTab: (tab: 'missions' | 'squad' | 'briefing' | 'notifications') => void;
  unreadCount: number;
  onOpenNewMission: () => void;
  onOpenDirectMission: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  currentUserRole: 'commander' | 'operator';
  onToggleRole: () => void;
  onShowSplash: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  onOpenNewMission,
  onOpenDirectMission,
  isMuted,
  onToggleMute,
  lang,
  onToggleLang,
  currentUserRole,
  onToggleRole,
  onShowSplash,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Top Bar Contract (3 zones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark & Insignia */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onShowSplash}
            title="Show Unit Emblem & Splash Screen"
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-500/40 shadow-sm shadow-amber-500/10 group-hover:border-amber-400 transition-colors">
              <img 
                src="/src/assets/images/thunderbolt_unit_insignia_1792663264729.jpg" 
                alt="Thunderbolt Insignia" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white uppercase whitespace-nowrap">
                Thunderbolt Unit
              </span>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider uppercase whitespace-nowrap">
                Cmd: Maj. Gen. Dragon
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links including Mission Page */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setActiveTab('missions');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
              activeTab === 'missions' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Missions Feed
          </button>

          {/* Dedicated Mission Page Direct Nav Button */}
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onOpenDirectMission();
            }}
            className="transition-colors whitespace-nowrap shrink-0 py-1 text-amber-400 font-bold flex items-center gap-1.5 hover:text-amber-300 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Mission Page (22/10)</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setActiveTab('squad');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 flex items-center gap-1.5 ${
              activeTab === 'squad' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Unit Squad (All)</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setActiveTab('briefing');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
              activeTab === 'briefing' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Briefing Center
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setActiveTab('notifications');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 flex items-center gap-1.5 ${
              activeTab === 'notifications' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Broadcasts</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-950 font-mono font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Quick Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Direct Mission Button in Header */}
          <button
            onClick={() => {
              tacticalAudio.playTacticalAlert();
              onOpenDirectMission();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 fill-slate-950" />
            <span>Mission Page</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? "Unmute Tactical Sound" : "Mute Sound"}
            className="p-2 text-slate-400 hover:text-white rounded border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onOpenNewMission();
            }}
            className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispatch</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 py-2 px-2 text-xs bg-slate-950/90 overflow-x-auto">
        <button
          onClick={() => {
            tacticalAudio.playTacticalAlert();
            onOpenDirectMission();
          }}
          className="py-1 px-2.5 rounded font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1 whitespace-nowrap"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Mission Page</span>
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`py-1 px-2 rounded whitespace-nowrap ${activeTab === 'missions' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          Missions
        </button>
        <button
          onClick={() => setActiveTab('squad')}
          className={`py-1 px-2 rounded flex items-center gap-1 whitespace-nowrap ${activeTab === 'squad' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <span>Squad</span>
        </button>
        <button
          onClick={() => setActiveTab('briefing')}
          className={`py-1 px-2 rounded whitespace-nowrap ${activeTab === 'briefing' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          Briefing
        </button>
      </div>
    </header>
  );
};
