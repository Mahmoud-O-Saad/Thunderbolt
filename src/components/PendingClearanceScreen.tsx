import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { 
  ShieldAlert, 
  Clock, 
  RotateCw, 
  LogOut, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Lock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface PendingClearanceScreenProps {
  currentUser: UserAccount;
  onRefreshStatus?: () => void;
  onSwitchAccount: () => void;
  onLogout: () => void;
  lang?: 'en' | 'ar';
}

export const PendingClearanceScreen: React.FC<PendingClearanceScreenProps> = ({
  currentUser,
  onRefreshStatus,
  onSwitchAccount,
  onLogout,
  lang = 'en',
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>('Just now');
  const [pulseCount, setPulseCount] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleManualCheck = () => {
    tacticalAudio.playRadioClick();
    setIsRefreshing(true);
    if (onRefreshStatus) {
      onRefreshStatus();
    }
    setTimeout(() => {
      tacticalAudio.playSuccessBeep();
      setIsRefreshing(false);
      setLastCheckTime(new Date().toLocaleTimeString());
    }, 900);
  };

  const isRejected = currentUser.approvalStatus === 'rejected';

  return (
    <div className="min-h-screen bg-[#070a08] text-stone-200 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#f2c14e] selection:text-black">
      {/* Background Military Grid & Atmospheric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e2b20_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#f2c14e]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="border-b border-stone-800/80 bg-black/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <img
            src="/assets/OP/photo_5836838891465246777_x.jpg"
            alt="Thunderbolt Emblem"
            className="w-8 h-8 rounded-lg object-cover border border-[#f2c14e]/40 shadow-sm"
          />
          <div>
            <h1 className="font-display text-sm font-bold tracking-wider text-stone-100 uppercase">
              Thunderbolt Unit · Special Operations
            </h1>
            <p className="text-[10px] text-stone-400 font-mono">
              Operational Security & Clearance Gate · بوابة تصاريح الصاعقة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onSwitchAccount();
            }}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#f2c14e]" />
            <span className="hidden sm:inline">Switch / Instructor Login</span>
            <span className="sm:hidden">Switch</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onLogout();
            }}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Terminal Viewport */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-xl bg-[#0c110e]/95 border-2 border-[#f2c14e]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 relative overflow-hidden backdrop-blur-xl">
          
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#f2c14e] to-transparent" />
          
          {/* Status Header Badge */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${
              isRejected
                ? 'bg-red-950/80 border-2 border-red-500/60 text-red-400'
                : 'bg-[#1b251d] border-2 border-[#f2c14e]/60 text-[#f2c14e] shadow-[#f2c14e]/10'
            }`}>
              {isRejected ? (
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              ) : (
                <Lock className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <span className={`text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border inline-block ${
                isRejected 
                  ? 'bg-red-950/50 text-red-400 border-red-500/40' 
                  : 'bg-[#f2c14e]/10 text-[#f2c14e] border-[#f2c14e]/30'
              }`}>
                {isRejected ? 'CLEARANCE STATUS: REJECTED' : 'CLEARANCE STATUS: PENDING INSTRUCTOR APPROVAL'}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-100">
                {isRejected 
                  ? 'Application Requires Instructor Review' 
                  : 'Verification In Progress · في انتظار تصريح القائد'}
              </h2>
            </div>
          </div>

          {/* Operator Registration Dossier Summary */}
          <div className="bg-black/50 border border-stone-800 rounded-2xl p-4 divide-y divide-stone-800/80 text-xs font-mono">
            <div className="pb-2.5 flex items-center justify-between">
              <span className="text-stone-400">CALLSIGN / USERNAME:</span>
              <span className="text-stone-100 font-bold">{currentUser.username}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">AUTHENTICATED EMAIL:</span>
              <span className="text-stone-200">{currentUser.email || 'Not provided'}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">ASSIGNED SERVICE ID:</span>
              <span className="text-[#f2c14e] font-bold">{currentUser.unitServiceId || 'TU-PENDING'}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">REQUESTED RANK:</span>
              <span className="text-stone-300">{currentUser.requestedRank || currentUser.rank || '[PVT | جندي]'}</span>
            </div>
            <div className="pt-2.5 flex items-center justify-between">
              <span className="text-stone-400">REGISTRATION DATE:</span>
              <span className="text-stone-300">{currentUser.joinedDate || new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          {/* Operational Directives Notice */}
          <div className="p-4 rounded-2xl bg-[#111914] border border-[#f2c14e]/20 space-y-2 text-xs leading-relaxed text-stone-300">
            <div className="flex items-center gap-2 text-[#f2c14e] font-bold font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>COMMAND SECURITY PROTOCOL (OPSEC)</span>
            </div>
            <p>
              Under direct order of <strong>Maj. Gen. Dragon</strong>, all newly created accounts are restricted from viewing operational missions, tactical frequencies, and Sa&apos;ka Academy training curricula until an authorized Instructor approves and commissions the operator.
            </p>
            <p className="text-[11px] text-stone-400">
              Please contact your Squad Leader or Instructor on Discord, or await commander verification. This screen will automatically unlock once your clearance is approved in real-time.
            </p>
          </div>

          {/* Live Radar Listening Indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-stone-800 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-stone-300">
                Live Radar Synced · Auto-detecting approval
              </span>
            </div>
            <span className="text-[10px] text-stone-500 tabular-nums">
              Last checked: {lastCheckTime}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleManualCheck}
              disabled={isRefreshing}
              className="w-full py-3 px-4 rounded-xl bg-[#f2c14e] hover:bg-[#ffd778] active:scale-98 text-black font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#f2c14e]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking Clearance Status...' : 'Check Clearance Status Now'}</span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadioClick();
                onSwitchAccount();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono text-xs transition flex items-center justify-center gap-2 border border-stone-800 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#f2c14e]" />
              <span>Log in with Instructor / Commander Account</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="text-center py-4 border-t border-stone-900 text-stone-500 text-[11px] font-mono relative z-10">
        Thunderbolt Unit Operational Command · 777th &amp; 999th Special Forces Reserve
      </footer>
    </div>
  );
};
