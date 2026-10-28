export type Priority = 'CRITICAL' | 'HIGH' | 'TACTICAL' | 'ROUTINE';

export type MissionStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'STANDBY';

export type MemberStatus = 'READY' | 'DEPLOYED' | 'STANDBY' | 'ACKNOWLEDGED';

export type UserRole = 'instructor' | 'member' | 'client';

export type AccountApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface UserAccount {
  id: string;
  username: string; // Single name, e.g. "Mahmoud"
  rank: string; // e.g. "[PFC | جندي أول]", "[CPT | نقيب]"
  role: UserRole; // 'instructor' | 'member'
  approvalStatus?: AccountApprovalStatus; // 'approved' | 'pending' | 'rejected'
  requestedRank?: string;
  email?: string;
  joinedDate: string;
  isRegistered: boolean;
}

export interface SquadMember {
  id: string;
  name: string;
  rank: string;
  role: string;
  avatarUrl?: string;
  status: MemberStatus;
  acknowledgedMissions: string[]; // Mission IDs
  lastSeen: string;
  deviceType: 'Tactical Radio' | 'Satellite Terminal' | 'Mobile Pager' | 'Command HUD';
}

export interface TacticalObjective {
  id: string;
  text: string;
  completed: boolean;
  assignedRole?: string;
}

export type MissionAttendanceStatus = 'READY' | 'LATE' | 'ABSENCE' | 'BENCH';

export interface Mission {
  id: string;
  codeName: string;
  title: string;
  date: string; // e.g. "2026-10-22"
  dayName: string; // e.g. "Thursday"
  time: string; // e.g. "06:00 UTC+2"
  targetSector: string;
  coordinates: string;
  priority: Priority;
  status: MissionStatus;
  commander: string; // "Maj. Gen. Staff Dragon"
  summary: string;
  briefingOverview: string;
  rulesOfEngagement: string;
  weatherConditions: string;
  assignedSquad: string[];
  equipmentList: string[];
  objectives: TacticalObjective[];
  broadcastCount: number;
  lastBroadcastTime?: string;
  discordUrl?: string; // Discord event / registration link
  attendance?: Record<string, MissionAttendanceStatus>;
}

export interface BroadcastNotification {
  id: string;
  missionId: string;
  missionCode: string;
  title: string;
  date: string;
  message: string;
  sender: string;
  timestamp: string;
  priority: Priority;
  readByMembers: string[];
}
