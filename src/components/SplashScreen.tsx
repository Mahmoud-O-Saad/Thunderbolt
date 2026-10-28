import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface SplashScreenProps {
  onEnter: () => void;
  onDirectToMission: () => void;
  commanderName: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, onDirectToMission, commanderName }) => {
  useEffect(() => {
    tacticalAudio.playBootChime();
  }, []);

  const handleClick = () => {
    tacticalAudio.playRadioClick();
    onEnter();
  };

  return (
    <div 
      onClick={handleClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060807] text-[#ede8de] select-none cursor-pointer overflow-hidden"
    >
      {/* Outer ambient blur background for desktop */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-110 pointer-events-none"
        style={{ backgroundImage: `url('/assets/aistudio/1.Cover_b397aaf7.png')` }}
      />
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Phone-width container matching Screenshot 3 with Cover Background */}
      <div className="w-full max-w-[420px] h-full min-h-screen border-x border-[#1a221d] flex flex-col items-center justify-between p-6 relative overflow-hidden z-10 shadow-2xl">
        
        {/* Full Cover Image as the primary background */}
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/assets/aistudio/1.Cover_b397aaf7.png')` }}
        />
        
        {/* Tactical dark gradient overlay to ensure perfect contrast and gold prominence */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d0b]/80 via-[#0a0d0b]/75 to-[#0a0d0b]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_45%,rgba(242,193,78,0.20),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 tb-grid opacity-25 pointer-events-none" />

        {/* Top Unit Watermark */}
        <div className="relative z-10 pt-4 text-center">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#f2c14e]/70 px-3 py-1 rounded-full border border-[#f2c14e]/20 bg-black/40 backdrop-blur-xs">
            NO.1 EGYPTIAN MILITARY GAMING COMMUNITY
          </span>
        </div>

        {/* Central Logo Lockup matching Screenshot 3 */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-500 my-auto">
          
          {/* Concentric Golden Halo Rings around Eagle Emblem */}
          <div className="relative flex items-center justify-center">
            {/* Outer animated halo ring */}
            <div className="absolute -inset-10 rounded-full border border-[#f2c14e]/15 pointer-events-none animate-pulse" />
            {/* Outer ring 2 */}
            <div className="absolute -inset-6 rounded-full border border-[#f2c14e]/25 pointer-events-none" />
            {/* Inner ring */}
            <div className="absolute -inset-2 rounded-full border border-[#f2c14e]/40 pointer-events-none" />
            
            {/* The Eagle Emblem */}
            <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-b from-[#f2c14e]/60 via-[#101412] to-black border-2 border-[#f2c14e]/70 shadow-2xl shadow-[#f2c14e]/30 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/3.Logo_9d28ba9d.png"
                alt="Thunderbolt Emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Title & Commander Lockup (EXACT TYPOGRAPHY FROM SCREENSHOT 3) */}
          <div className="space-y-1 pt-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.14em] text-stone-100 uppercase drop-shadow-md">
              THUNDERBOLT
            </h1>
            <p className="font-display text-xs tracking-[0.45em] text-[#f2c14e] uppercase font-bold drop-shadow">
              UNIT
            </p>
          </div>

          {/* Commander Line with Lightning Icon (EXACT FROM SCREENSHOT 3) */}
          <div className="pt-2 flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#f2c14e] font-mono px-3 py-1 rounded-full bg-black/60 border border-[#f2c14e]/30 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 fill-[#f2c14e] text-[#f2c14e]" />
              <span className="font-bold">Under the command of Maj. Gen. dragon</span>
            </div>
            <span className="text-[11px] text-stone-400 font-sans">
              تحت قيادة اللواء أ.ح dragon
            </span>
          </div>

          {/* Action Button: Direct to Mission */}
          <div className="pt-4 flex flex-col items-center gap-2 w-full max-w-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                tacticalAudio.playTacticalAlert();
                onDirectToMission();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#f2c14e] hover:bg-[#f2c14e]/90 text-black font-display font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#f2c14e]/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Enter Mission Briefing</span>
            </button>
            
            <span className="text-[10px] text-stone-400 font-mono tracking-wider uppercase animate-pulse pt-1">
              Tap anywhere to enter app
            </span>
          </div>
        </div>

        {/* Bottom Lockup */}
        <div className="relative z-10 pb-4 text-center font-mono text-[10px] text-stone-500">
          <span>ARMA III · EGYPTIAN MILITARY SIMULATION</span>
        </div>
      </div>
    </div>
  );
};
