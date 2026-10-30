import React, { useState, useRef, useEffect } from 'react';
import { Mission, SquadMember } from '../types';
import { 
  Play, 
  Square, 
  Radio, 
  Shield, 
  MapPin, 
  Calendar, 
  Clock, 
  Crosshair, 
  Volume2, 
  FileAudio, 
  Image as ImageIcon 
} from 'lucide-react';
import { tacticalAudio, speakBriefing, stopAllAudio, playAudioUrl } from '../utils/audio';

interface BriefingRoomViewProps {
  missions: Mission[];
  allMembers: SquadMember[];
  onSelectMission: (mission: Mission) => void;
  lang: 'en' | 'ar';
}

export const BriefingRoomView: React.FC<BriefingRoomViewProps> = ({
  missions,
  allMembers,
  onSelectMission,
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const stopAudioRef = useRef<(() => void) | null>(null);

  const currentMission = missions.find(m => m.id === selectedMissionId) || missions[0];

  useEffect(() => {
    return () => {
      if (stopAudioRef.current) {
        stopAudioRef.current();
      }
      stopAllAudio();
    };
  }, []);

  const handleAudioPlayback = () => {
    if (!currentMission) return;
    if (isPlaying) {
      if (stopAudioRef.current) {
        stopAudioRef.current();
        stopAudioRef.current = null;
      }
      stopAllAudio();
      setIsPlaying(false);
    } else {
      tacticalAudio.playRadioClick();
      setIsPlaying(true);
      if (currentMission.audioUrl) {
        const stopFn = playAudioUrl(currentMission.audioUrl, () => {
          setIsPlaying(false);
          stopAudioRef.current = null;
        });
        stopAudioRef.current = stopFn;
      } else {
        const textToSpeak = `Briefing for ${currentMission.codeName}. Under command of ${currentMission.commander}. Date of operation: ${currentMission.dayName}, ${currentMission.date} at ${currentMission.time}. Location: ${currentMission.targetSector}. ${currentMission.briefingOverview} Rules of engagement: ${currentMission.rulesOfEngagement}.`;
        speakBriefing(textToSpeak, () => setIsPlaying(false));
      }
    }
  };

  const handleSelectTab = (mId: string) => {
    tacticalAudio.playRadioClick();
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    stopAllAudio();
    setIsPlaying(false);
    setSelectedMissionId(mId);
  };

  if (!currentMission) return null;

  const displayImage = currentMission.imageUrl || '/src/assets/images/tactical_operations_map_1792663265618.jpg';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 text-amber-500" />
            <span>TACTICAL OPS ROOM // AUDIO BRIEFING DISPATCH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Tactical Briefing Room & Audio Overwatch
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Listen to spoken operational orders and inspect tactical sector maps.
          </p>
        </div>

        {/* Mission selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto max-w-full">
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelectTab(m.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
                m.id === currentMission.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.codeName.replace('OPERATION ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Briefing Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Player & Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tactical Audio Player Console */}
          <div className="p-6 bg-gradient-to-br from-[#111827] to-[#0F172A] border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-400 block font-semibold">
                  ORDERED BY: {currentMission.commander}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {currentMission.codeName}: {currentMission.title}
                </h3>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300 mt-1">
                  <span className="text-amber-400 font-bold">{currentMission.dayName}, {currentMission.date}</span>
                  <span>·</span>
                  <span>{currentMission.time}</span>
                  <span>·</span>
                  <span>{currentMission.targetSector}</span>
                </div>
                {currentMission.audioUrl && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded w-fit">
                    <FileAudio className="w-3.5 h-3.5 text-amber-400" />
                    <span>Uploaded Audio File: {currentMission.audioFileName || 'Voice Recording Attached'}</span>
                  </div>
                )}
              </div>

              {/* Play Audio Button */}
              <button
                onClick={handleAudioPlayback}
                className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer shadow-lg shrink-0 ${
                  isPlaying
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>
                  {isPlaying 
                    ? 'Stop Audio' 
                    : (currentMission.audioUrl ? 'Play Attached Audio Order' : 'Play Audio Briefing')}
                </span>
              </button>
            </div>

            {/* Audio Waveform visualization */}
            <div className="my-5 flex items-center justify-between gap-1 h-10 px-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
              {Array.from({ length: 32 }).map((_, i) => {
                const heightPercent = isPlaying 
                  ? Math.sin(i * 0.5 + Date.now() / 400) * 35 + 50 
                  : ((i % 5) + 1) * 12;
                return (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isPlaying ? 'bg-amber-400' : 'bg-slate-700'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                );
              })}
            </div>

            {/* Full Written Briefing Text */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                SPOKEN BRIEFING SCRIPT & DETAILS:
              </span>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800 font-sans">
                {currentMission.briefingOverview}
              </p>
            </div>
          </div>

          {/* Tactical Map Display */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 relative">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-semibold flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>
                  {currentMission.imageFileName 
                    ? `MISSION RECON PHOTO // ${currentMission.imageFileName}` 
                    : `SATELLITE SECTOR RECON FEED · GRID ${currentMission.coordinates}`}
                </span>
              </span>
              <span>LIVE OVERWATCH</span>
            </div>
            <div className="relative aspect-[16/9] max-h-72 w-full">
              <img
                src={displayImage}
                alt="Tactical Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded border border-amber-500/40 text-xs font-mono text-amber-400">
                LZ ECHO-4 // TARGET: {currentMission.targetSector}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Tactical Checklist & Squad Assigned */}
        <div className="space-y-6">
          {/* Objectives */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-400" />
              <span>Designated Objectives</span>
            </h4>
            <div className="space-y-2.5">
              {currentMission.objectives.map((obj, i) => (
                <div key={obj.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-mono text-amber-400 mb-1">
                    <span>PHASE {i + 1}</span>
                    {obj.completed && <span className="text-emerald-400">· COMPLETED</span>}
                  </div>
                  <p>{obj.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Rules & Community Note */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3 text-xs font-mono">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Command Standing Orders</span>
            </h4>
            <div className="space-y-2 text-slate-400">
              <p>
                <strong className="text-slate-300">Engagement Protocol: </strong>
                {currentMission.rulesOfEngagement}
              </p>
              <p>
                <strong className="text-slate-300">Weather & Terrain: </strong>
                {currentMission.weatherConditions}
              </p>
              <p>
                <strong className="text-slate-300">Unit: </strong>
                Thunderbolt Unit · Special Operations Command
              </p>
            </div>

            <button
              onClick={() => onSelectMission(currentMission)}
              className="w-full mt-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer text-center block"
            >
              View Full Mission Card & Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
