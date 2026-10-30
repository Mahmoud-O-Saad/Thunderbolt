import React, { useState } from 'react';
import { Mission, UserAccount } from '../types';
import { 
  Radio, 
  ExternalLink, 
  Copy, 
  Check, 
  Shield, 
  Lock, 
  Award, 
  Headphones, 
  Volume2, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Play,
  Square,
  Sparkles
} from 'lucide-react';
import { tacticalAudio, speakBriefing, stopBriefing } from '../utils/audio';

interface DiscordMemberHubProps {
  currentUser: UserAccount;
  activeMission?: Mission;
  onSwitchToLeader?: () => void;
  onOpenAccountModal?: () => void;
}

export const DiscordMemberHub: React.FC<DiscordMemberHubProps> = ({
  currentUser,
  activeMission,
  onSwitchToLeader,
  onOpenAccountModal,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const discordUrl = activeMission?.discordUrl || 'https://discord.gg/thunderbolt-ops';

  const handleCopyLink = () => {
    tacticalAudio.playRadioClick();
    navigator.clipboard.writeText(discordUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleAudio = () => {
    if (!activeMission) return;
    if (isPlayingAudio) {
      stopBriefing();
      setIsPlayingAudio(false);
      tacticalAudio.playRadioClick();
    } else {
      setIsPlayingAudio(true);
      tacticalAudio.playTacticalAlert();
      speakBriefing(
        `${activeMission.title}. Target Sector: ${activeMission.targetSector}. Discord briefing is now active. All operators proceed to the designated Discord channel for registration and mission briefing.`,
        () => setIsPlayingAudio(false)
      );
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-6">
      
      {/* Tactical Cover Banner with Unit Emblem & Discord Glow */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#5865F2]/40 bg-[#0c101d] shadow-2xl shadow-[#5865F2]/20">
        
        {/* Banner Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src="/assets/aistudio/1.Cover_b397aaf7.png"
            alt="Thunderbolt Operations"
            className="w-full h-full object-cover object-top filter brightness-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/60 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-black/80 border border-[#f2c14e]/40 text-[#f2c14e] font-mono text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#f2c14e] animate-ping" />
              <span>THUNDERBOLT UNIT</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-[#5865F2] text-white font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-md shadow-[#5865F2]/40">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>DISCORD HUB</span>
            </span>
          </div>

          {/* Bottom badge overlay */}
          <div className="absolute bottom-2 left-4 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#5865F2] p-0.5 bg-black/90 shadow-lg">
              <img
                src="/assets/aistudio/3.Logo_9d28ba9d.png"
                alt="Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white drop-shadow">
                Discord Operations Hub
              </h2>
              <p className="text-[10px] text-stone-300 font-mono drop-shadow">
                TACTICAL MISSION DISCORD GATEWAY
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          
          {/* Welcome User Badge */}
          <div className="p-3 rounded-2xl bg-black/60 border border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#1b2234] border border-[#5865F2]/40 flex items-center justify-center font-bold text-sm text-[#5865F2] shrink-0">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/30 px-1.5 py-0.2 rounded shrink-0">
                    {currentUser.rank}
                  </span>
                  <span className="font-bold text-stone-100 text-xs truncate">
                    {currentUser.username}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono block">
                  Registered Operator (Member) · Thunderbolt Unit
                </span>
              </div>
            </div>

            {currentUser.approvalStatus === 'pending' ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold shrink-0 animate-pulse">
                Pending Approval
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                Approved ✓
              </span>
            )}
          </div>

          {/* Mission Alert Preview */}
          {activeMission && (
            <div className="rounded-2xl p-4 bg-[#11172a] border border-[#5865F2]/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#5865F2] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5865F2] animate-pulse" />
                  <span>UPCOMING OPERATION</span>
                </span>
                <span className="text-stone-400 text-[11px]">
                  {activeMission.date} · {activeMission.time}
                </span>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-white">
                  {activeMission.title}
                </h3>
                <p className="text-[11px] text-stone-400 font-mono flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#f2c14e]" />
                  <span>{activeMission.targetSector}</span>
                </p>
              </div>

              {/* Audio button */}
              <div className="pt-1 flex items-center justify-between border-t border-stone-800/80">
                <span className="text-[10px] font-mono text-stone-400">
                  Audio Briefing (Spoken Orders):
                </span>
                <button
                  onClick={handleToggleAudio}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-[#5865F2] hover:bg-[#4752c4] text-white'
                  }`}
                >
                  {isPlayingAudio ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isPlayingAudio ? 'Stop Brief' : 'Play Brief'}</span>
                </button>
              </div>
            </div>
          )}

          {/* PRIMARY DISCORD DIRECT LINK BUTTON */}
          <div className="space-y-2">
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => tacticalAudio.playSuccessBeep()}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-display font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#5865F2]/40 transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Join & Register on Discord</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            {/* Copy Link box */}
            <div className="p-2.5 rounded-xl bg-black/70 border border-stone-800 flex items-center justify-between gap-2 text-xs font-mono">
              <span className="truncate text-stone-300 text-[11px]">
                {discordUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-[#5865F2] hover:text-white border border-stone-700 text-stone-300 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Voice Channel & Registration Instructions */}
          <div className="rounded-2xl p-4 bg-[#141824]/90 border border-[#5865F2]/20 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-[#5865F2] font-mono font-bold text-[11px]">
              <Headphones className="w-4 h-4 text-[#5865F2]" />
              <span>DISCORD OPERATIONAL DIRECTIVES</span>
            </div>
            
            <ul className="space-y-1.5 text-stone-300 text-[11px] font-sans leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-[#5865F2] font-mono font-bold">1.</span>
                <span>Confirm your squad registration in <strong>#mission-registration</strong> on the Discord server.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#5865F2] font-mono font-bold">2.</span>
                <span>Join voice channel <strong>#tactical-briefing</strong> 15 minutes prior to operation launch.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#5865F2] font-mono font-bold">3.</span>
                <span>Maintain your approved single username and military rank designated by Maj. Gen. Dragon.</span>
              </li>
            </ul>
          </div>

          {/* Linked Identity Badge */}
          {(currentUser.linkedGmail || currentUser.linkedDiscord) && (
            <div className="rounded-2xl p-3 bg-black/60 border border-stone-800 flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">Linked Identity:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {currentUser.linkedGmail && (
                  <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                    ✓ Gmail: {currentUser.linkedGmail}
                  </span>
                )}
                {currentUser.linkedDiscord && (
                  <span className="text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                    ✓ Discord: {currentUser.linkedDiscord}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Permissions Notice */}
          <div className="rounded-2xl p-3.5 bg-[#181a15] border border-amber-500/30 text-xs text-stone-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-[11px]">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>MILITARY CLEARANCE: DISCORD ACCESS ONLY</span>
            </div>
            <p className="text-[11px] text-stone-300 font-sans leading-relaxed">
              Your account clearance as a <strong>Member</strong> is dedicated to Discord event registration and field comms. Tactical mission dispatches, full unit rosters, and squadron broadcasting are reserved for Commander Maj. Gen. Dragon.
            </p>

            {onSwitchToLeader && (
              <div className="pt-1">
                <button
                  onClick={() => {
                    tacticalAudio.playTacticalAlert();
                    onSwitchToLeader();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-[#f2c14e] hover:text-black border border-stone-700 text-[#f2c14e] font-mono text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Switch to Commander (Dragon) Account</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Unit Lockup footer */}
      <div className="text-center py-2 space-y-0.5">
        <p className="font-display text-[10px] tracking-[0.2em] text-[#f2c14e]/70 uppercase font-bold">
          Thunderbolt Unit Operations
        </p>
        <p className="text-[10px] text-stone-500 font-mono">
          Under the command of Maj. Gen. Dragon
        </p>
      </div>

    </div>
  );
};
