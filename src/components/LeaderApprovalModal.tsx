import React, { useState } from 'react';
import { UserAccount, AccountApprovalStatus } from '../types';
import { AVAILABLE_RANKS, RankItem, isCommandRank, isStaffRank } from '../data/initialData';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Award, 
  Clock, 
  Check, 
  X, 
  ChevronRight, 
  AlertCircle,
  Shield,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface LeaderApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  onApproveAccount: (accountId: string, assignedRank: string) => void;
  onRejectAccount: (accountId: string) => void;
  onUpdateMemberRank: (accountId: string, newRank: string) => void;
  preselectedAccountId?: string;
}

export const LeaderApprovalModal: React.FC<LeaderApprovalModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onApproveAccount,
  onRejectAccount,
  onUpdateMemberRank,
  preselectedAccountId,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'roster'>('pending');
  const [selectedRankForAccount, setSelectedRankForAccount] = useState<Record<string, string>>({});
  const [editingMemberId, setEditingMemberId] = useState<string | null>(preselectedAccountId || null);
  const [newRankForEdit, setNewRankForEdit] = useState<string>('[PFC | جندي أول]');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const pendingAccounts = accounts.filter(
    (acc) => acc.approvalStatus === 'pending'
  );

  const approvedMembers = accounts.filter(
    (acc) => acc.approvalStatus !== 'pending' && acc.approvalStatus !== 'rejected'
  );

  const handleRankSelect = (accountId: string, rankFormatted: string) => {
    setSelectedRankForAccount((prev) => ({
      ...prev,
      [accountId]: rankFormatted,
    }));
  };

  const handleApprove = (acc: UserAccount) => {
    tacticalAudio.playSuccessBeep();
    const rankToAssign = selectedRankForAccount[acc.id] || acc.requestedRank || acc.rank || '[PFC | جندي أول]';
    onApproveAccount(acc.id, rankToAssign);
    setFeedbackNotice(`Operator "${acc.username}" commissioned successfully with rank: ${rankToAssign}`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleReject = (acc: UserAccount) => {
    tacticalAudio.playRadioClick();
    onRejectAccount(acc.id);
    setFeedbackNotice(`Application for "${acc.username}" was rejected`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleSaveRankChange = (memberId: string) => {
    tacticalAudio.playSuccessBeep();
    onUpdateMemberRank(memberId, newRankForEdit);
    setEditingMemberId(null);
    setFeedbackNotice(`Military rank updated successfully to: ${newRankForEdit}`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e1310] border-2 border-[#f2c14e]/50 rounded-3xl p-5 text-stone-200 shadow-2xl shadow-[#f2c14e]/20 relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Gold tactical glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2c14e] to-transparent" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#f2c14e]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#231e13] border border-[#f2c14e]/50 flex items-center justify-center text-[#f2c14e] shadow-md shadow-[#f2c14e]/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-stone-100">
                  Commander Clearance & Roster Control
                </h3>
              </div>
              <p className="text-[11px] text-[#f2c14e] font-mono">
                MAJ. GEN. DRAGON · MILITARY COMMISSION DESK
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-600 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback flash notification */}
        {feedbackNotice && (
          <div className="my-2.5 p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-sans font-medium">{feedbackNotice}</span>
          </div>
        )}

        {/* Navigation Tabs: Pending Requests vs Member Ranks */}
        <div className="grid grid-cols-2 gap-2 pt-3 shrink-0">
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setActiveTab('pending');
            }}
            className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'pending'
                ? 'bg-[#f2c14e] text-black border-[#f2c14e] shadow-md shadow-[#f2c14e]/20'
                : 'bg-black/50 text-stone-400 border-stone-800 hover:border-stone-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Applications</span>
            {pendingAccounts.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                activeTab === 'pending' ? 'bg-black text-[#f2c14e]' : 'bg-[#f2c14e] text-black'
              }`}>
                {pendingAccounts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              setActiveTab('roster');
            }}
            className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'roster'
                ? 'bg-[#f2c14e] text-black border-[#f2c14e] shadow-md shadow-[#f2c14e]/20'
                : 'bg-black/50 text-stone-400 border-stone-800 hover:border-stone-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Manage Operator Ranks</span>
            <span className="text-[10px] font-mono text-stone-400">
              ({approvedMembers.length})
            </span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PENDING ACCOUNT REQUESTS
           ========================================================================= */}
        {activeTab === 'pending' && (
          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1 custom-scrollbar">
            {pendingAccounts.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed border-stone-800 rounded-2xl bg-black/30 p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-display text-sm font-bold text-stone-200">
                  No Pending Applications
                </h4>
                <p className="text-xs text-stone-400 max-w-xs mx-auto font-sans leading-relaxed">
                  When new operators register, their applications appear here for verification and military rank commissioning before grant of access.
                </p>
              </div>
            ) : (
              pendingAccounts.map((acc) => {
                const chosenRank = selectedRankForAccount[acc.id] || acc.requestedRank || acc.rank || '[PFC | جندي أول]';

                return (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-2xl bg-[#141b16] border border-[#f2c14e]/30 space-y-3 text-xs shadow-md"
                  >
                    {/* Applicant Profile */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-black/60 border border-[#f2c14e]/40 flex items-center justify-center font-display font-black text-sm text-[#f2c14e] shrink-0">
                          {acc.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-bold text-sm text-stone-100">
                              {acc.username}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono font-bold">
                              Awaiting Clearance
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-stone-300 font-bold">UID: {acc.unitServiceId || 'TU-9198'}</span>
                            {acc.steamUid && (
                              <span className="text-stone-400">Steam: {acc.steamUid}</span>
                            )}
                            {acc.linkedGmail && (
                              <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded text-[10px]">
                                Gmail: {acc.linkedGmail}
                              </span>
                            )}
                            {acc.linkedDiscord && (
                              <span className="text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-1.5 py-0.2 rounded text-[10px]">
                                Discord: {acc.linkedDiscord}
                              </span>
                            )}
                            <span>· Applied: {acc.joinedDate}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-[#f2c14e] bg-[#f2c14e]/10 px-2 py-0.5 rounded border border-[#f2c14e]/20 shrink-0">
                        NEW APPLICANT
                      </span>
                    </div>

                    {/* Leader Rank Assignment Selector */}
                    <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800 space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-[#f2c14e] flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>Assign Military Rank:</span>
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {chosenRank}
                        </span>
                      </label>

                      {/* Rank Chips Picker */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar pt-1">
                        {AVAILABLE_RANKS.map((rk) => {
                          const isPicked = chosenRank === rk.formatted;
                          return (
                            <button
                              key={rk.id}
                              type="button"
                              onClick={() => {
                                tacticalAudio.playRadioClick();
                                handleRankSelect(acc.id, rk.formatted);
                              }}
                              className={`p-1.5 rounded-lg border text-left transition cursor-pointer text-[10px] font-mono flex items-center justify-between ${
                                isPicked
                                  ? 'bg-[#f2c14e] text-black font-bold border-[#f2c14e]'
                                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                              }`}
                              title={rk.nameEn}
                            >
                              <span className="truncate mr-1">{rk.formatted}</span>
                              <div className="flex items-center gap-0.5 shrink-0">
                                {rk.isCommand && (
                                  <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${isPicked ? 'bg-black/30 text-black' : 'text-[#f2c14e]'}`}>
                                    Cmd
                                  </span>
                                )}
                                {rk.isStaffOfficer && (
                                  <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${isPicked ? 'bg-black/30 text-black' : 'text-emerald-400'}`}>
                                    أ.ح
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions: Approve & Assign Rank vs Reject */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(acc)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950 active:scale-98"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Commission Rank & Approve</span>
                      </button>

                      <button
                        onClick={() => handleReject(acc)}
                        className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-rose-950 text-stone-400 hover:text-rose-300 border border-stone-800 hover:border-rose-800 font-mono text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Reject Application</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: MEMBER RANK CONTROL
           ========================================================================= */}
        {activeTab === 'roster' && (
          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1 custom-scrollbar">
            <div className="p-3 rounded-xl bg-[#171e19] border border-emerald-500/30 text-xs text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Leader-Authoritative Rank Command</span>
              </div>
              <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                Operators cannot edit their ranks. As Commander, you can promote or reassign the military rank of any unit member at any time.
              </p>
            </div>

            {/* Member Editor Modal popup if editing */}
            {editingMemberId && (
              <div className="p-3.5 rounded-2xl bg-black/80 border-2 border-[#f2c14e] space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#f2c14e]">
                    Select New Rank for Operator:
                  </span>
                  <button
                    onClick={() => setEditingMemberId(null)}
                    className="text-stone-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {AVAILABLE_RANKS.map((rk) => (
                    <button
                      key={rk.id}
                      type="button"
                      onClick={() => {
                        tacticalAudio.playRadioClick();
                        setNewRankForEdit(rk.formatted);
                      }}
                      className={`p-2 rounded-xl border text-left text-xs font-mono transition cursor-pointer flex items-center justify-between ${
                        newRankForEdit === rk.formatted
                          ? 'bg-[#f2c14e] text-black font-bold border-[#f2c14e]'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="truncate mr-1">
                        <span className="block truncate font-bold">{rk.formatted}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {rk.isCommand && (
                            <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                              newRankForEdit === rk.formatted ? 'bg-black/30 text-black' : 'text-[#f2c14e]'
                            }`}>
                              Command
                            </span>
                          )}
                          {rk.isStaffOfficer && (
                            <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                              newRankForEdit === rk.formatted ? 'bg-black/30 text-black' : 'text-emerald-400'
                            }`}>
                              أ.ح
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] shrink-0">{rk.insignia}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleSaveRankChange(editingMemberId)}
                  className="w-full py-2.5 rounded-xl bg-[#f2c14e] text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-[#f2c14e]/20"
                >
                  Confirm Promotion & Commission ({newRankForEdit})
                </button>
              </div>
            )}

            {/* Approved Members List */}
            <div className="space-y-2">
              {approvedMembers.map((acc) => {
                const isCommand = isCommandRank(acc.rank);

                return (
                  <div
                    key={acc.id}
                    className="p-3 rounded-xl bg-black/50 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="font-mono text-[10px] font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/30 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1">
                        <span>{acc.rank}</span>
                        {isStaffRank(acc.rank) && (
                          <span className="text-[8px] text-emerald-400 bg-emerald-950/60 px-1 rounded">
                            أ.ح
                          </span>
                        )}
                      </span>
                      <span className="font-sans font-bold text-stone-100 truncate">
                        {acc.username}
                      </span>
                      <span className="font-mono text-[10px] text-stone-400 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800 shrink-0">
                        {acc.unitServiceId || 'TU-9198'}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 border ${
                        isCommand 
                          ? 'bg-[#f2c14e]/20 text-[#f2c14e] border-[#f2c14e]/40' 
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {isCommand ? 'Command' : 'Operator'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        tacticalAudio.playRadioClick();
                        setEditingMemberId(acc.id);
                        setNewRankForEdit(acc.rank || '[PFC | جندي أول]');
                      }}
                      className="px-2.5 py-1 text-[11px] font-mono font-bold text-[#f2c14e] hover:text-black bg-[#f2c14e]/10 hover:bg-[#f2c14e] border border-[#f2c14e]/30 rounded-lg transition cursor-pointer shrink-0"
                    >
                      Promote Rank ✏️
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-stone-800 text-center shrink-0">
          <p className="text-[10px] font-mono text-stone-500">
            Military Operational Authority: Rank assignment and recruitment approval reserved for Maj. Gen. Dragon
          </p>
        </div>

      </div>
    </div>
  );
};
