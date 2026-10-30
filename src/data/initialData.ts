import { Mission, SquadMember, BroadcastNotification } from '../types';

export const COMMANDER_NAME = "[MG | لواء أ.ح] Dragon";
export const COMMANDER_TITLE = "Commander of Thunderbolt Unit";

export const INITIAL_MEMBERS: SquadMember[] = [
  {
    id: "mem-01",
    name: "Tariq",
    rank: "[CPT | نقيب]",
    role: "Field Strike Lead",
    status: "READY",
    acknowledgedMissions: ["msn-001"],
    lastSeen: "2 mins ago",
    deviceType: "Command HUD",
    unitServiceId: "TU-8412",
    steamUid: "76561198084120391",
  },
  {
    id: "mem-02",
    name: "Omar",
    rank: "[1LT | ملازم أول]",
    role: "Reconnaissance & Sniper",
    status: "READY",
    acknowledgedMissions: ["msn-001"],
    lastSeen: "Just now",
    deviceType: "Tactical Radio",
    unitServiceId: "TU-6320",
    steamUid: "76561198063201488",
  },
  {
    id: "mem-03",
    name: "Ziad",
    rank: "[MSG | رقيب أول]",
    role: "Heavy Fire Support & Breaching",
    status: "READY",
    acknowledgedMissions: ["msn-001"],
    lastSeen: "5 mins ago",
    deviceType: "Tactical Radio",
    unitServiceId: "TU-5109",
    steamUid: "76561198051092841",
  },
  {
    id: "mem-04",
    name: "Kareem",
    rank: "[SGT | رقيب]",
    role: "Electronic Warfare & Comms",
    status: "STANDBY",
    acknowledgedMissions: ["msn-001"],
    lastSeen: "1 min ago",
    deviceType: "Satellite Terminal",
    unitServiceId: "TU-4891",
    steamUid: "76561198048915023",
  },
  {
    id: "mem-05",
    name: "Nour",
    rank: "[CPL | عريف]",
    role: "Tactical Combat Medic",
    status: "READY",
    acknowledgedMissions: ["msn-001"],
    lastSeen: "Just now",
    deviceType: "Mobile Pager",
    unitServiceId: "TU-3142",
    steamUid: "76561198031428904",
  },
  {
    id: "mem-06",
    name: "Youssef",
    rank: "[PFC | جندي أول]",
    role: "CQC Assault Specialist",
    status: "READY",
    acknowledgedMissions: [],
    lastSeen: "12 mins ago",
    deviceType: "Tactical Radio",
    unitServiceId: "TU-2975",
    steamUid: "76561198029754129",
  },
  {
    id: "mem-07",
    name: "Ahmed",
    rank: "[PVT | جندي]",
    role: "Support Gunner",
    status: "READY",
    acknowledgedMissions: ["msn-001"],
    lastSeen: "Just now",
    deviceType: "Tactical Radio",
    unitServiceId: "TU-1840",
    steamUid: "76561198018409382",
  },
  {
    id: "mem-08",
    name: "Hossam",
    rank: "[2LT | ملازم]",
    role: "Drone Pilot & Signals",
    status: "READY",
    acknowledgedMissions: ["msn-001"],
    lastSeen: "4 mins ago",
    deviceType: "Command HUD",
    unitServiceId: "TU-7153",
    steamUid: "76561198071530911",
  },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: "msn-001",
    codeName: "OPERATION FLASH THUNDER",
    title: "Sector G14 Tactical Intercept & Perimeter Recon",
    date: "2026-10-22",
    dayName: "Thursday",
    time: "06:00 UTC+2",
    targetSector: "Sector G14-H18 (Northern Ridge Outpost)",
    coordinates: "32°14'08\"N 31°22'45\"E",
    priority: "CRITICAL",
    status: "ACTIVE",
    commander: COMMANDER_NAME,
    summary: "High-priority deployment on Thursday 22/10/2026 to secure Sector G14, intercept hostile logistical convoys, and establish dominant radar surveillance.",
    briefingOverview: 
      "Attention Thunderbolt Unit operators. Under direct command of Maj. Gen. Staff Dragon, Operation Flash Thunder initiates on Thursday, 22/10/2026 at 06:00 hours. The primary objective is establishing an impenetrable containment perimeter across Ridge G14, seizing visual overwatch of supply route Bravo, and neutralizing unauthorized drone surveillance relays. Rapid insertion via armored tactical vehicles with radio silence until Point Alpha. All operators must verify night-vision gear, ballistic plates, and encrypted satellite transponders before 05:00 hours.",
    rulesOfEngagement: "ROE Level 2: Target identification mandatory prior to discharge. Suppressed engagements authorized during Phase 1 infiltration.",
    weatherConditions: "Dry terrain, low-visibility dawn fog (est. 250m), crosswind 14 knots NE.",
    assignedSquad: ["mem-01", "mem-02", "mem-03", "mem-04", "mem-05", "mem-06", "mem-07", "mem-08"],
    discordUrl: "https://discord.gg/thunderbolt-ops",
    equipmentList: [
      "Thermal Night-Vision Goggles (Gen IV)",
      "Suppressed Tactical Carbines with 5.56 AP ammo",
      "Encrypted Comms Transponders (VHF/UHF)",
      "High-Sensitivity Directional RF Jammers",
      "Field Trauma Surgical First-Aid Kits",
    ],
    objectives: [
      { id: "obj-1", text: "Infiltrate Observation Point Alpha by 06:15 hours without triggering thermal alarms", completed: true, assignedRole: "Ghost-4 (Sniper)" },
      { id: "obj-2", text: "Deploy electronic directional jammer on hostile repeater tower Bravo", completed: false, assignedRole: "Cipher-7 (Comms)" },
      { id: "obj-3", text: "Secure perimeter breach point and establish heavy defensive cordon", completed: false, assignedRole: "Titan-3 (Heavy Support)" },
      { id: "obj-4", text: "Maintain constant satellite uplink with Maj. Gen. Dragon command post", completed: false, assignedRole: "Viper-1 (Strike Lead)" },
    ],
    broadcastCount: 3,
    lastBroadcastTime: "2026-10-22 03:00",
    imageUrl: "/src/assets/images/tactical_operations_map_1792663265618.jpg",
    imageFileName: "sat_recon_sector_g14.jpg",
  },
  {
    id: "msn-002",
    codeName: "OPERATION NIGHT HAWK",
    title: "Deep Reconnaissance & Supply Route Overwatch",
    date: "2026-10-24",
    dayName: "Saturday",
    time: "21:30 UTC+2",
    targetSector: "Sector K09 (Canyon Crossing)",
    coordinates: "31°58'12\"N 30°45'20\"E",
    priority: "HIGH",
    status: "UPCOMING",
    commander: COMMANDER_NAME,
    summary: "Covert reconnaissance deployment to monitor hostile logistics movement across the southern canyon during dark hours.",
    briefingOverview:
      "Thunderbolt Unit operators: Scheduled for Saturday night. Ghost team will position along canyon bluffs to record convoy registration and cargo configurations without engagement. Extraction will occur via extraction grid Sierra at 04:00 hours.",
    rulesOfEngagement: "Strict surveillance only. Do not engage unless spotted and compromised.",
    weatherConditions: "Clear night sky, wind 8 knots, temperature dropping to 11°C.",
    assignedSquad: ["mem-01", "mem-02", "mem-03", "mem-04", "mem-05", "mem-06"],
    discordUrl: "https://discord.gg/thunderbolt-ops",
    imageUrl: "/src/assets/images/thunderbolt_tactical_cover_1792663525424.jpg",
    imageFileName: "night_recon_sector_k09.jpg",
    equipmentList: [
      "Long-Range Optic Scopes with Infrared",
      "Silent Footwear & Ghillie Camouflage",
      "Satellite Burst Data Transmitters",
    ],
    objectives: [
      { id: "obj-201", text: "Ascend Bluff Sierra unseen by 22:00", completed: false },
      { id: "obj-202", text: "Log license numbers and cargo markings of all passing transports", completed: false },
      { id: "obj-203", text: "Transmit encrypted telemetry back to Dragon Command", completed: false },
    ],
    broadcastCount: 1,
    lastBroadcastTime: "2026-10-21 18:30",
  },
  {
    id: "msn-003",
    codeName: "OPERATION DESERT SHIELD",
    title: "Forward Outpost Hardening & Asset Escort",
    date: "2026-10-28",
    dayName: "Wednesday",
    time: "11:00 UTC+2",
    targetSector: "Sector M22 (Eastern Dunes)",
    coordinates: "30°20'44\"N 32°10'15\"E",
    priority: "TACTICAL",
    status: "UPCOMING",
    commander: COMMANDER_NAME,
    summary: "Joint escort and reinforcement of high-value communications gear to forward operational base Bravo.",
    briefingOverview:
      "All units be advised: Convoy escort operation under command of Maj. Gen. Staff Dragon. Heavy vehicle escort through uneven sand terrain. Anti-mine sensors must be active at the vanguard.",
    rulesOfEngagement: "Defensive perimeter rules. Neutralize hostile obstacles immediately.",
    weatherConditions: "High heat index (38°C), sandstorm watch pending.",
    assignedSquad: ["mem-01", "mem-03", "mem-05", "mem-06", "mem-07", "mem-08"],
    discordUrl: "https://discord.gg/thunderbolt-ops",
    imageUrl: "/src/assets/images/thunderbolt_unit_insignia_1792663264729.jpg",
    imageFileName: "convoy_escort_insignia.jpg",
    equipmentList: [
      "Reinforced Armored Transport",
      "Ground-Penetrating Anti-Mine Scanners",
      "Heavy Machine Gun Turret Mounts",
    ],
    objectives: [
      { id: "obj-301", text: "Conduct pre-departure armor inspection at 09:30", completed: false },
      { id: "obj-302", text: "Maintain 50m vehicle stagger along route Falcon", completed: false },
      { id: "obj-303", text: "Deliver communications console to FOB Bravo intact", completed: false },
    ],
    broadcastCount: 0,
  },
];

export const INITIAL_NOTIFICATIONS: BroadcastNotification[] = [
  {
    id: "notif-01",
    missionId: "msn-001",
    missionCode: "OPERATION FLASH THUNDER",
    title: "NEW MISSION BRIEFING: Thursday 22/10/2026 - 06:00 HRS",
    date: "Thursday, Oct 22, 2026",
    message: "Critical deployment ordered by Maj. Gen. Staff Dragon for Thursday 22/10/2026. Sector G14 tactical intercept. Review briefing details, objectives, and confirm readiness immediately.",
    sender: COMMANDER_NAME,
    timestamp: "2026-10-22 05:45",
    priority: "CRITICAL",
    readByMembers: ["mem-01", "mem-02", "mem-03", "mem-04", "mem-05"],
  },
  {
    id: "notif-02",
    missionId: "msn-001",
    missionCode: "OPERATION FLASH THUNDER",
    title: "COMMAND ORDER: Radio Silence Protocol Active",
    date: "Thursday, Oct 22, 2026",
    message: "All operators assigned to Thursday 22/10/2026 mission must switch communication channels to Frequency Bravo-9. Comms check required by 05:30.",
    sender: COMMANDER_NAME,
    timestamp: "2026-10-22 05:15",
    priority: "HIGH",
    readByMembers: ["mem-01", "mem-02", "mem-03"],
  },
  {
    id: "notif-03",
    missionId: "msn-002",
    missionCode: "OPERATION NIGHT HAWK",
    title: "UPCOMING MISSION LOGGED: Saturday 24/10/2026",
    date: "Saturday, Oct 24, 2026",
    message: "Canyon crossing reconnaissance operation registered. Roster assigned: Viper-1, Ghost-4, Cipher-7.",
    sender: COMMANDER_NAME,
    timestamp: "2026-10-21 18:30",
    priority: "TACTICAL",
    readByMembers: ["mem-01"],
  },
];

export interface RankItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  formatted: string;
  insignia: string;
  isStaffOfficer?: boolean;
  isCommand?: boolean;
}

export const AVAILABLE_RANKS: RankItem[] = [
  // Enlisted & NCOs
  { id: 'pfc', code: 'PFC', nameAr: 'جندي أول', nameEn: 'Private First Class', formatted: '[PFC | جندي أول]', insignia: '●●', isCommand: false },
  { id: 'pvt', code: 'PVT', nameAr: 'جندي', nameEn: 'Private', formatted: '[PVT | جندي]', insignia: '●', isCommand: false },
  { id: 'cpl', code: 'CPL', nameAr: 'عريف', nameEn: 'Corporal', formatted: '[CPL | عريف]', insignia: '▲', isCommand: false },
  { id: 'sgt', code: 'SGT', nameAr: 'رقيب', nameEn: 'Sergeant', formatted: '[SGT | رقيب]', insignia: '▲▲', isCommand: false },
  { id: 'msg', code: 'MSG', nameAr: 'رقيب أول', nameEn: 'Master Sergeant', formatted: '[MSG | رقيب أول]', insignia: '▲▲▲', isCommand: false },

  // Junior Commissioned Officers
  { id: '2lt', code: '2LT', nameAr: 'ملازم', nameEn: 'Second Lieutenant', formatted: '[2LT | ملازم]', insignia: '★', isCommand: false },
  { id: '1lt', code: '1LT', nameAr: 'ملازم أول', nameEn: 'First Lieutenant', formatted: '[1LT | ملازم أول]', insignia: '★★', isCommand: false },
  { id: 'cpt', code: 'CPT', nameAr: 'نقيب', nameEn: 'Captain', formatted: '[CPT | نقيب]', insignia: '★★★', isCommand: false },

  // Field Grade Officers
  { id: 'maj', code: 'MAJ', nameAr: 'رائد', nameEn: 'Major', formatted: '[MAJ | رائد]', insignia: '🦅', isCommand: false },
  { id: 'maj_staff', code: 'MAJ', nameAr: 'رائد أ.ح', nameEn: 'Major Staff (p.s.c.)', formatted: '[MAJ | رائد أ.ح]', insignia: '🦅 أ.ح', isStaffOfficer: true, isCommand: false },
  { id: 'ltc', code: 'LTC', nameAr: 'مقدم', nameEn: 'Lieutenant Colonel', formatted: '[LTC | مقدم]', insignia: '🦅★', isCommand: false },
  { id: 'ltc_staff', code: 'LTC', nameAr: 'مقدم أ.ح', nameEn: 'Lt. Colonel Staff (p.s.c.)', formatted: '[LTC | مقدم أ.ح]', insignia: '🦅★ أ.ح', isStaffOfficer: true, isCommand: false },

  // Command Ranks (From Colonel to Major General / من أول العقيد لحد اللواء)
  { id: 'col', code: 'COL', nameAr: 'عقيد', nameEn: 'Colonel', formatted: '[COL | عقيد]', insignia: '🦅★★', isCommand: true },
  { id: 'col_staff', code: 'COL', nameAr: 'عقيد أ.ح', nameEn: 'Colonel Staff (p.s.c.)', formatted: '[COL | عقيد أ.ح]', insignia: '🦅★★ أ.ح', isStaffOfficer: true, isCommand: true },
  { id: 'bgd', code: 'BGD', nameAr: 'عميد', nameEn: 'Brigadier General', formatted: '[BGD | عميد]', insignia: '🦅★★★', isCommand: true },
  { id: 'bgd_staff', code: 'BGD', nameAr: 'عميد أ.ح', nameEn: 'Brigadier General Staff (p.s.c.)', formatted: '[BGD | عميد أ.ح]', insignia: '🦅★★★ أ.ح', isStaffOfficer: true, isCommand: true },
  { id: 'mg', code: 'MG', nameAr: 'لواء', nameEn: 'Major General', formatted: '[MG | لواء]', insignia: '⚔️🦅', isCommand: true },
  { id: 'mg_staff', code: 'MG', nameAr: 'لواء أ.ح', nameEn: 'Major General Staff (p.s.c.)', formatted: '[MG | لواء أ.ح]', insignia: '⚔️🦅 أ.ح', isStaffOfficer: true, isCommand: true },
];

/**
 * Checks if a rank belongs to Command level:
 * From Colonel (العقيد) up to Major General (اللواء) & General Officers.
 */
export const isCommandRank = (rank?: string): boolean => {
  if (!rank) return false;
  const s = rank.toLowerCase();

  // Explicitly check for ranks strictly below Colonel to prevent false positives
  if (
    s.includes('مقدم') ||
    s.includes('ltc') ||
    s.includes('lieutenant colonel') ||
    s.includes('رائد') ||
    (s.includes('maj') && !s.includes('mg') && !s.includes('major general')) ||
    s.includes('نقيب') ||
    s.includes('cpt') ||
    s.includes('ملازم') ||
    (s.includes('lt') && !s.includes('ltg')) ||
    s.includes('رقيب') ||
    s.includes('sgt') ||
    s.includes('عريف') ||
    s.includes('cpl') ||
    s.includes('جندي') ||
    s.includes('pvt') ||
    s.includes('pfc')
  ) {
    // Only true if it genuinely also has a high rank designation
    const isCol = s.includes('عقيد') || /\[col\s*\|/i.test(s) || (/\bcol\b/i.test(s) && !s.includes('ltc'));
    const isBrig = s.includes('عميد') || /\[(bgd|brig)\s*\|/i.test(s) || /\b(bgd|brig)\b/i.test(s);
    const isMG = s.includes('لواء') || /\[mg\s*\|/i.test(s) || /\bmg\b/i.test(s) || s.includes('major general');
    const isHigher = s.includes('فريق') || s.includes('مشير') || /\[(ltg|gen|fm)\s*\|/i.test(s);
    return isCol || isBrig || isMG || isHigher;
  }

  // Positive matches for Colonel to Major General
  const isCol = s.includes('عقيد') || /\[col\s*\|/i.test(s) || /\bcol\b/i.test(s);
  const isBrig = s.includes('عميد') || /\[(bgd|brig)\s*\|/i.test(s) || /\b(bgd|brig)\b/i.test(s);
  const isMG = s.includes('لواء') || /\[mg\s*\|/i.test(s) || /\bmg\b/i.test(s) || s.includes('major general');
  const isHigher = s.includes('فريق') || s.includes('مشير') || /\[(ltg|gen|fm)\s*\|/i.test(s);

  return isCol || isBrig || isMG || isHigher;
};

/**
 * Checks if a rank holds Staff Officer / أركان حرب qualification
 */
export const isStaffRank = (rank?: string): boolean => {
  if (!rank) return false;
  return (
    rank.includes('أركان حرب') ||
    rank.includes('اركان حرب') ||
    rank.includes('أ.ح') ||
    rank.includes('ا.ح') ||
    rank.toLowerCase().includes('staff') ||
    rank.toLowerCase().includes('p.s.c')
  );
};

/**
 * Returns role badge text: "Command" from Colonel to Major General, otherwise "Squad Operator"
 */
export const getRoleTitle = (rank?: string, role?: string): string => {
  if (isCommandRank(rank)) {
    return 'Command';
  }
  if (role === 'instructor') {
    return 'Lead Operator';
  }
  return 'Squad Operator';
};

