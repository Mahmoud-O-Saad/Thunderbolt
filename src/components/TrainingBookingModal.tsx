import React, { useState } from 'react';
import { UserAccount, TrainingBooking } from '../types';
import { 
  TRAINING_TIME_SLOTS, 
  MONTH_NAMES_EN, 
  MONTH_NAMES_AR, 
  formatBookingDate, 
  generateGoogleCalendarUrl, 
  generateGmailInviteUrl 
} from '../utils/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Mail, 
  UserPlus, 
  Check, 
  X, 
  ExternalLink, 
  Shield, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface TrainingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  qualification?: {
    code: string;
    title: string;
    branch?: string;
    category?: string;
  };
  module?: {
    code: string;
    title: string;
    branch?: string;
    category?: string;
  };
  currentUser: UserAccount;
  onSaveBooking: (booking: TrainingBooking) => void;
  existingBookings?: TrainingBooking[];
  lang?: 'en' | 'ar';
}

export const TrainingBookingModal: React.FC<TrainingBookingModalProps> = ({
  isOpen,
  onClose,
  qualification: qualProp,
  module: modProp,
  currentUser,
  onSaveBooking,
  existingBookings = [],
  lang = 'en',
}) => {
  const qualification = qualProp || modProp || { code: '01.1', title: 'Basic Combat Marksmanship', branch: 'Tactics' };
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(11); // November default for 2026
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('morning');
  const [hasCompanion, setHasCompanion] = useState<boolean>(false);
  const [companionEmail, setCompanionEmail] = useState<string>('');
  const [companionName, setCompanionName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Days in month calculation
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayWeekday = new Date(selectedYear, selectedMonth - 1, 1).getDay();

  const selectedSlot = TRAINING_TIME_SLOTS.find(s => s.id === selectedSlotId) || TRAINING_TIME_SLOTS[0];

  const previewBooking: TrainingBooking = {
    id: `tb-preview`,
    qualificationId: qualification.code,
    qualificationTitle: qualification.title,
    candidateId: currentUser.id,
    candidateName: currentUser.username,
    candidateEmail: currentUser.email || `${currentUser.username.toLowerCase()}@thunderbolt.unit`,
    candidateRank: currentUser.rank,
    year: selectedYear,
    month: selectedMonth,
    day: selectedDay,
    timeSlot: selectedSlot.time,
    slotLabel: lang === 'ar' ? selectedSlot.labelAr : selectedSlot.labelEn,
    companionEmail: hasCompanion && companionEmail.trim() ? companionEmail.trim() : undefined,
    companionName: hasCompanion && companionName.trim() ? companionName.trim() : undefined,
    notes: notes.trim() || undefined,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const googleCalUrl = generateGoogleCalendarUrl(previewBooking);
  const gmailInviteUrl = hasCompanion && companionEmail ? generateGmailInviteUrl(previewBooking) : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playSuccessBeep();

    const newBooking: TrainingBooking = {
      id: `tb-${Date.now()}`,
      qualificationId: qualification.code,
      qualificationTitle: qualification.title,
      candidateId: currentUser.id,
      candidateName: currentUser.username,
      candidateEmail: currentUser.email || `${currentUser.username.toLowerCase()}@thunderbolt.unit`,
      candidateRank: currentUser.rank,
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      timeSlot: selectedSlot.time,
      slotLabel: lang === 'ar' ? selectedSlot.labelAr : selectedSlot.labelEn,
      companionEmail: hasCompanion && companionEmail.trim() ? companionEmail.trim() : undefined,
      companionName: hasCompanion && companionName.trim() ? companionName.trim() : undefined,
      notes: notes.trim() || undefined,
      status: currentUser.role === 'instructor' ? 'confirmed' : 'pending',
      createdAt: new Date().toISOString(),
      approvedBy: currentUser.role === 'instructor' ? currentUser.username : undefined,
      approvedAt: currentUser.role === 'instructor' ? new Date().toISOString() : undefined,
    };

    onSaveBooking(newBooking);
    setFeedbackNotice(
      lang === 'ar' 
        ? `تم تسجيل حجز التدريب لـ ${formatBookingDate(newBooking, 'ar')} بنجاح! في انتظار اعتماد القائد.`
        : `Training session booked for ${formatBookingDate(newBooking, 'en')}! Pending instructor validation.`
    );

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0c110e] border-2 border-[#f2c14e]/40 rounded-3xl p-5 sm:p-6 text-stone-200 shadow-2xl shadow-black relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#f2c14e] to-transparent" />
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#231e13] border border-[#f2c14e]/50 flex items-center justify-center text-[#f2c14e] shadow-md shadow-[#f2c14e]/10">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#f2c14e] bg-[#f2c14e]/10 border border-[#f2c14e]/30 px-1.5 py-0.5 rounded">
                  {qualification.code}
                </span>
                <h3 className="font-display text-base font-bold text-stone-100">
                  {lang === 'ar' ? 'حجز موعد تدريب وتقييم' : 'Schedule Training Assessment'}
                </h3>
              </div>
              <p className="text-[11px] text-stone-400 font-sans truncate max-w-xs sm:max-w-md">
                {qualification.title} · {qualification.branch}
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

        {/* Feedback Alert Notice */}
        {feedbackNotice && (
          <div className="my-2 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 shrink-0 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono">{feedbackNotice}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pt-3 pr-1 custom-scrollbar text-xs">
          
          {/* Candidate Dossier Banner */}
          <div className="p-3 rounded-2xl bg-black/40 border border-stone-800/80 flex items-center justify-between font-mono">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">OPERATOR CANDIDATE</span>
              <span className="text-stone-100 font-bold">{currentUser.username}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px] uppercase">MILITARY RANK</span>
              <span className="text-[#f2c14e] font-bold">{currentUser.rank}</span>
            </div>
          </div>

          {/* Calendar Date Selection: Month / Year Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#f2c14e] uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'اختيار التاريخ (يوم / شهر / سنة)' : '1. Training Date (Day / Month / Year)'}</span>
              </span>

              {/* Month / Year quick switcher */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="bg-black/80 border border-stone-800 rounded-lg px-2 py-1 text-stone-200 font-mono text-xs focus:border-[#f2c14e]/60 outline-none cursor-pointer"
                >
                  {MONTH_NAMES_EN.map((name, i) => (
                    <option key={name} value={i + 1}>
                      {lang === 'ar' ? MONTH_NAMES_AR[i] : name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="bg-black/80 border border-stone-800 rounded-lg px-2 py-1 text-stone-200 font-mono text-xs focus:border-[#f2c14e]/60 outline-none cursor-pointer"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </div>

            {/* Interactive Day Grid */}
            <div className="bg-black/50 border border-stone-800/80 rounded-2xl p-3 space-y-2">
              {/* Day names */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-stone-500 font-bold uppercase">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty offset padding cells */}
                {Array.from({ length: firstDayWeekday }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {/* Day numbers */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        tacticalAudio.playRadioClick();
                        setSelectedDay(dayNum);
                      }}
                      className={`h-8 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#f2c14e] text-black shadow-md shadow-[#f2c14e]/30 scale-105'
                          : 'bg-stone-900/60 hover:bg-stone-800 text-stone-300 border border-stone-800/60'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              <div className="text-center pt-1 font-mono text-[11px] text-[#f2c14e]">
                {formatBookingDate({ year: selectedYear, month: selectedMonth, day: selectedDay }, lang)}
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#f2c14e] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'توقيت التدريب المتاح' : '2. Operational Time Slot'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRAINING_TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      tacticalAudio.playRadioClick();
                      setSelectedSlotId(slot.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#182319] border-emerald-500/60 text-stone-100 ring-1 ring-emerald-500/30'
                        : 'bg-black/50 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-[#f2c14e] block">
                        {slot.time}
                      </span>
                      <span className="text-[11px] text-stone-400 font-sans">
                        {lang === 'ar' ? slot.labelAr : slot.labelEn}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Companion Operator Invite (Gmail) */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border border-stone-800/80">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#f2c14e]" />
                <span className="font-mono text-xs font-bold text-stone-200">
                  {lang === 'ar' ? 'إضافة زميل للمشاركة في التدريب (Comrade Companion)' : 'Add Training Companion (Invite Comrade)'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasCompanion}
                onChange={(e) => setHasCompanion(e.target.checked)}
                className="w-4 h-4 accent-[#f2c14e] cursor-pointer"
              />
            </label>

            {hasCompanion && (
              <div className="pt-2 space-y-2.5 animate-in fade-in">
                <div>
                  <label className="text-[10px] font-mono text-stone-400 block mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني للزميل (Gmail):' : 'Comrade Gmail Address:'}
                  </label>
                  <input
                    type="email"
                    value={companionEmail}
                    onChange={(e) => setCompanionEmail(e.target.value)}
                    placeholder="comrade.operator@gmail.com"
                    required={hasCompanion}
                    className="w-full px-3 py-2 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs font-mono focus:border-[#f2c14e]/60 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-stone-400 block mb-1">
                    {lang === 'ar' ? 'اسم الزميل / رمز النداء (اختياري):' : 'Comrade Callsign / Name (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="Tariq / Omar"
                    className="w-full px-3 py-2 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs font-mono focus:border-[#f2c14e]/60 outline-none"
                  />
                </div>

                {companionEmail && (
                  <div className="p-2.5 rounded-xl bg-[#111914] border border-[#f2c14e]/30 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-300 font-sans">
                      {lang === 'ar' ? 'إرسال دعوة بالبريد الإلكتروني:' : 'Send Tactical Email Invite:'}
                    </span>
                    <a
                      href={gmailInviteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 text-[10px] font-mono font-bold flex items-center gap-1.5 transition"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Open Gmail Invite</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tactical Notes / Request comments */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-stone-400 block">
              {lang === 'ar' ? 'ملاحظات التدريب الميداني (اختياري):' : 'Pre-exercise Tactical Notes (Optional):'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Request live fire lane testing, night vision qualification ready..."
              className="w-full px-3 py-2 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs font-mono focus:border-[#f2c14e]/60 outline-none resize-none"
            />
          </div>

          {/* 1-Click Google Calendar Action Preview */}
          <div className="p-3 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <CalendarIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-[11px] text-stone-300 font-sans">
                <span className="font-bold text-blue-400 block font-mono text-[10px]">GOOGLE CALENDAR EVENT</span>
                <span>Auto-adds date, module title, and companion</span>
              </div>
            </div>
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold shrink-0 flex items-center gap-1 transition"
            >
              <span>Add to Calendar</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Operational Policy Notice */}
          <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800 text-[10px] font-mono text-stone-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#f2c14e] shrink-0" />
            <span>
              {currentUser.role === 'instructor'
                ? 'Instructor Clearance Active: Session will be confirmed immediately.'
                : 'Session request will be submitted to Commander Dragon for clearance approval.'}
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#f2c14e] hover:bg-[#ffda73] text-black font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#f2c14e]/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>
                {lang === 'ar' ? 'تأكيد إرسال طلب حجز التدريب' : 'Confirm & Submit Training Booking'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
