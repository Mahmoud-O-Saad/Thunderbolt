import { TrainingBooking } from '../types';

export interface TimeSlotOption {
  id: string;
  time: string;
  labelEn: string;
  labelAr: string;
}

export const TRAINING_TIME_SLOTS: TimeSlotOption[] = [
  {
    id: 'dawn',
    time: '06:00 - 08:00 UTC+2',
    labelEn: 'Dawn Tactical Maneuver',
    labelAr: 'مناورة تكتيكية فجرية'
  },
  {
    id: 'morning',
    time: '10:00 - 12:00 UTC+2',
    labelEn: 'Live Fire & Assessment Lane',
    labelAr: 'حارة تقييم ورماية حية'
  },
  {
    id: 'afternoon',
    time: '14:00 - 16:00 UTC+2',
    labelEn: 'Specialist Technical Lab',
    labelAr: 'ميدان التخصص والمهام الفنية'
  },
  {
    id: 'dusk',
    time: '18:00 - 20:00 UTC+2',
    labelEn: 'Dusk / Night Infiltration',
    labelAr: 'تدريب إغارة واقتحام ليلي'
  }
];

export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

/**
 * Format a zero-padded 2-digit number
 */
function pad(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Format a human readable date string
 * Supports formatBookingDate(year, month, day, lang) or formatBookingDate({ year, month, day }, lang)
 */
export function formatBookingDate(
  dateOrYear: number | { year: number; month: number; day: number },
  monthOrLang?: number | 'en' | 'ar',
  dayNum?: number,
  langCode: 'en' | 'ar' = 'en'
): string {
  let y: number;
  let m: number;
  let d: number;
  let lang: 'en' | 'ar' = 'en';

  if (typeof dateOrYear === 'object') {
    y = dateOrYear.year;
    m = dateOrYear.month;
    d = dateOrYear.day;
    lang = (monthOrLang as 'en' | 'ar') || 'en';
  } else {
    y = dateOrYear;
    m = typeof monthOrLang === 'number' ? monthOrLang : 1;
    d = dayNum || 1;
    lang = langCode;
  }

  const mIdx = Math.max(0, Math.min(11, m - 1));
  const mName = lang === 'ar' ? MONTH_NAMES_AR[mIdx] : MONTH_NAMES_EN[mIdx];
  if (lang === 'ar') {
    return `${d} ${mName} ${y}`;
  }
  return `${mName} ${d}, ${y}`;
}

/**
 * Generate ISO date-time string in Google Calendar compact format YYYYMMDDTHHMMSSZ
 */
export function getCalendarDateTimeRange(booking: TrainingBooking): { start: string; end: string } {
  const startHourStr = booking.timeSlot.split(':')[0] || '06';
  const startHour = parseInt(startHourStr, 10);
  const endHour = (startHour + 2) % 24;

  const y = booking.year;
  const m = pad(booking.month);
  const d = pad(booking.day);

  // UTC+2 offset compensation for standard UTC timestamp
  const utcStartHour = pad((startHour - 2 + 24) % 24);
  const utcEndHour = pad((endHour - 2 + 24) % 24);

  const start = `${y}${m}${d}T${utcStartHour}0000Z`;
  const end = `${y}${m}${d}T${utcEndHour}0000Z`;

  return { start, end };
}

/**
 * Generate 1-click Google Calendar Event creation link
 */
export function generateGoogleCalendarUrl(booking: TrainingBooking): string {
  const { start, end } = getCalendarDateTimeRange(booking);

  const eventTitle = `Thunderbolt Ops: [${booking.qualificationId}] ${booking.qualificationTitle} Assessment`;
  const eventDetails = [
    `MILITARY QUALIFICATION ASSESSMENT SESSION`,
    `Unit: Egyptian Thunderbolt Unit (وحدة الصاعقة المصرية)`,
    `Commander: Maj. Gen. Dragon`,
    `Candidate: ${booking.candidateName} (${booking.candidateRank})`,
    `Module: ${booking.qualificationId} - ${booking.qualificationTitle}`,
    `Scheduled Date: ${formatBookingDate(booking, 'en')} at ${booking.timeSlot}`,
    booking.companionEmail ? `Companion / Comrade: ${booking.companionEmail}` : '',
    booking.notes ? `Tactical Notes: ${booking.notes}` : '',
    `Status: ${booking.status.toUpperCase()}`,
    `Bring full tactical loadout and standard military comms.`
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle,
    dates: `${start}/${end}`,
    details: eventDetails,
    location: 'Thunderbolt Tactical Academy Range (Field Alpha)',
  });

  if (booking.companionEmail) {
    params.set('add', booking.companionEmail);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate direct Gmail compose link to invite a companion
 */
export function generateGmailInviteUrl(booking: TrainingBooking): string {
  if (!booking.companionEmail) return '';

  const subject = `[Thunderbolt Unit] Tactical Training Invitation: ${booking.qualificationId} ${booking.qualificationTitle}`;
  const body = [
    `Attention Operator,`,
    ``,
    `You have been invited by ${booking.candidateName} (${booking.candidateRank}) to participate as companion operator for the upcoming qualification assessment:`,
    ``,
    `• Module: ${booking.qualificationId} - ${booking.qualificationTitle}`,
    `• Date: ${formatBookingDate(booking, 'en')} (${formatBookingDate(booking, 'ar')})`,
    `• Time Window: ${booking.timeSlot}`,
    `• Location: Thunderbolt Training Range & Assessment Lane`,
    ``,
    `Add to Google Calendar:`,
    `${generateGoogleCalendarUrl(booking)}`,
    ``,
    `Status: Awaiting Instructor Approval / في انتظار تأكيد القيادة`,
    ``,
    `Respectfully,`,
    `Thunderbolt Unit HQ · Under the command of Maj. Gen. Dragon`
  ].join('\n');

  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: booking.companionEmail,
    su: subject,
    body: body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}
