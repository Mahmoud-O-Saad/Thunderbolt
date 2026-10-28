import React from 'react';
import { UserAccount, UserRole } from '../types';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Shield, 
  Award, 
  Trash2, 
  Check, 
  X, 
  Zap, 
  Eye, 
  Radio 
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  currentAccountId: string;
  onSwitchAccount: (account: UserAccount) => void;
  onOpenAddAccount: (role?: UserRole) => void;
  onDeleteAccount?: (accountId: string) => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currentAccountId,
  onSwitchAccount,
  onOpenAddAccount,
  onDeleteAccount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d120f] border-2 border-[#f2c14e]/40 rounded-2xl p-5 text-stone-200 shadow-2xl shadow-[#f2c14e]/20 relative overflow-hidden space-y-4">
        
        {/* Top gold bar glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2c14e] to-transparent" />
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#f2c14e]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#231e13] border border-[#f2c14e]/40 flex items-center justify-center text-[#f2c14e]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-stone-100 flex items-center gap-2">
                <span>إدارة وتبديل الحسابات</span>
                <span className="text-[11px] text-[#f2c14e] font-mono tracking-wider font-normal">
                  / ACCOUNTS
                </span>
              </h3>
              <p className="text-[11px] text-stone-400 font-mono">
                MEMBERS & INSTRUCTORS ROSTER
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-600 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info callout */}
        <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300 space-y-1">
          <div className="flex items-center gap-1.5 text-[#f2c14e] font-mono font-bold text-[11px]">
            <Eye className="w-3.5 h-3.5" />
            <span>حسابات الأعضاء (Members) والقادة</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
            الـ <strong className="text-stone-200">Member</strong> هو عضو ومقاتل الوحدة الذي يستعرض المهمة ويدخل عبر رابط ديسكورد للتسجيل.
          </p>
        </div>

        {/* Add Account Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
              onOpenAddAccount('member');
            }}
            className="py-2.5 px-3 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-display font-bold text-xs uppercase tracking-wider shadow-md shadow-[#f2c14e]/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ إضافة عضو (Member)</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
              onOpenAddAccount('instructor');
            }}
            className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Award className="w-3.5 h-3.5 text-[#f2c14e]" />
            <span>+ إضافة قائد (Leader)</span>
          </button>
        </div>

        {/* Accounts List */}
        <div className="space-y-2 pt-1 max-h-64 overflow-y-auto pr-1">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
            الحسابات المسجلة ({accounts.length}):
          </span>

          {accounts.map((acc) => {
            const isActive = acc.id === currentAccountId;
            const isClient = acc.role === 'client' || acc.role === 'member';

            return (
              <div
                key={acc.id}
                onClick={() => {
                  if (!isActive) {
                    tacticalAudio.playTacticalAlert();
                    onSwitchAccount(acc);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${
                  isActive
                    ? 'bg-[#152319] border-emerald-500/50 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'bg-black/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/40'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm shrink-0 border ${
                      isActive
                        ? 'bg-emerald-900/40 border-emerald-400 text-emerald-300'
                        : isClient
                        ? 'bg-[#1c221e] border-stone-700 text-stone-300'
                        : 'bg-[#2a2213] border-[#f2c14e]/40 text-[#f2c14e]'
                    }`}
                  >
                    {acc.username ? acc.username.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div className="overflow-hidden space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/20 px-1 rounded shrink-0">
                        {acc.rank}
                      </span>
                      <span className="font-sans font-bold text-stone-100 text-xs truncate">
                        {acc.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 flex-wrap">
                      <span className={isClient ? 'text-sky-400 font-bold' : 'text-[#f2c14e] font-bold'}>
                        {isClient ? 'Member (عضو)' : 'Leader (قائد / معلم)'}
                      </span>
                      {acc.approvalStatus === 'pending' && (
                        <span className="text-amber-400 font-bold bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded">
                          (بانتظار موافقة القائد)
                        </span>
                      )}
                      {acc.approvalStatus === 'rejected' && (
                        <span className="text-rose-400 font-bold bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.2 rounded">
                          (مرفوض)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>نشط الآن</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        tacticalAudio.playTacticalAlert();
                        onSwitchAccount(acc);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-[11px] font-mono font-bold text-stone-300 hover:text-black bg-stone-900 hover:bg-[#f2c14e] border border-stone-700 rounded-lg transition cursor-pointer"
                    >
                      تفعيل
                    </button>
                  )}

                  {onDeleteAccount && accounts.length > 1 && !isActive && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        tacticalAudio.playRadioClick();
                        onDeleteAccount(acc.id);
                      }}
                      title="حذف هذا الحساب"
                      className="p-1 text-stone-500 hover:text-red-400 transition cursor-pointer rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-800 text-center">
          <p className="text-[10px] font-mono text-stone-500">
            الرتبة العسكرية القياسية [CODE | الرتبة] ثم الاسم (مثال: [PFC | جندي أول] Mahmoud)
          </p>
        </div>

      </div>
    </div>
  );
};
