import React, { useState, useEffect } from 'react';
import { 
  COMMANDER_NAME, 
  INITIAL_MEMBERS, 
  INITIAL_MISSIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { Mission, SquadMember, BroadcastNotification, UserRole, UserAccount, MissionAttendanceStatus } from './types';
import { WhackaThunderboltApp } from './components/WhackaThunderboltApp';
import { SplashScreen } from './components/SplashScreen';
import { IncomingAlertBanner } from './components/IncomingAlertBanner';
import { tacticalAudio, sendBrowserNotification } from './utils/audio';

const DEFAULT_USER: UserAccount = {
  id: 'usr-01',
  username: 'Mahmoud',
  rank: '[CPT | نقيب]',
  role: 'instructor',
  approvalStatus: 'approved',
  email: 'mahmoud@thunderbolt.unit',
  joinedDate: '2026-10-22',
  isRegistered: true,
};

const INITIAL_ACCOUNTS: UserAccount[] = [
  DEFAULT_USER,
  {
    id: 'usr-member-01',
    username: 'Tariq',
    rank: '[PFC | جندي أول]',
    role: 'member',
    approvalStatus: 'approved',
    email: 'tariq@thunderbolt.unit',
    joinedDate: '2026-10-22',
    isRegistered: true,
  },
  {
    id: 'usr-pending-01',
    username: 'Ahmed',
    rank: '[PVT | جندي]',
    role: 'member',
    approvalStatus: 'pending',
    requestedRank: '[PFC | جندي أول]',
    email: 'ahmed@thunderbolt.unit',
    joinedDate: '2026-10-23',
    isRegistered: true,
  },
];

export default function App() {
  // Navigation & View States (default English for mission display)
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Helper to normalize rank formatting to [CODE | الرتبة]
  const normalizeRank = (rk: string): string => {
    if (!rk) return '[PFC | جندي أول]';
    return rk.replace(/\s*I\s*/g, ' | ');
  };

  // Registered Accounts (Multi-account support for Instructors & Members)
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('thunderbolt_user_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((acc: UserAccount) => {
            const cleanAcc = { ...acc };
            if (cleanAcc.username === 'Mahmoud Osama') {
              cleanAcc.username = 'Mahmoud';
            }
            if (cleanAcc.rank) {
              cleanAcc.rank = normalizeRank(cleanAcc.rank);
            }
            if ((cleanAcc.role as string) === 'client') {
              cleanAcc.role = 'member';
            }
            return cleanAcc;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACCOUNTS;
  });

  // User Account (Username, Rank, and Role)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('thunderbolt_user_account');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.username === 'Mahmoud Osama') {
          parsed.username = 'Mahmoud';
        }
        if (parsed.rank) {
          parsed.rank = normalizeRank(parsed.rank);
        } else {
          parsed.rank = '[CPT | نقيب]';
        }
        if ((parsed.role as string) === 'client') {
          parsed.role = 'member';
        }
        localStorage.setItem('thunderbolt_user_account', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER;
  });

  // User Role (Instructor can post/edit missions, Member views and opens Discord)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('thunderbolt_user_role');
    const role = (saved as UserRole) || currentUser.role || 'instructor';
    return role === 'client' ? 'member' : role;
  });

  // App Data State (persisted with initialData)
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('thunderbolt_missions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].attendance) {
          return INITIAL_MISSIONS;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MISSIONS;
  });

  const [members, setMembers] = useState<SquadMember[]>(() => {
    const saved = localStorage.getItem('thunderbolt_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].rank && !parsed[0].rank.startsWith('[')) {
          return INITIAL_MEMBERS;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MEMBERS;
  });

  const [notifications, setNotifications] = useState<BroadcastNotification[]>(() => {
    const saved = localStorage.getItem('thunderbolt_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeIncomingAlert, setActiveIncomingAlert] = useState<BroadcastNotification | null>(null);

  useEffect(() => {
    localStorage.setItem('thunderbolt_user_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('thunderbolt_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('thunderbolt_user_account', JSON.stringify(currentUser));
  }, [currentUser]);

  const handleSetUserRole = (newRole: UserRole) => {
    setUserRole(newRole);
    setCurrentUser(prev => ({ ...prev, role: newRole }));
    setAccounts(prev =>
      prev.map(acc => (acc.id === currentUser.id ? { ...acc, role: newRole } : acc))
    );
  };

  const handleUpdateUserAccount = (account: UserAccount) => {
    setCurrentUser(account);
    setUserRole(account.role);
    setAccounts(prev => {
      const idx = prev.findIndex(a => a.id === account.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = account;
        return next;
      }
      return [account, ...prev];
    });
    localStorage.setItem('thunderbolt_user_account', JSON.stringify(account));
    localStorage.setItem('thunderbolt_user_role', account.role);
  };

  // Add a new account (e.g. recruit signup or leader adding member)
  const handleAddAccount = (newAccount: UserAccount, autoSwitch: boolean = true) => {
    setAccounts(prev => {
      const existing = prev.find(a => a.id === newAccount.id || a.username.toLowerCase() === newAccount.username.toLowerCase());
      if (existing) {
        return prev.map(a => a.id === existing.id ? newAccount : a);
      }
      return [newAccount, ...prev];
    });

    // If account is already approved (e.g. created by leader), add to squad members roster
    if (newAccount.approvalStatus !== 'pending' && newAccount.approvalStatus !== 'rejected') {
      setMembers(prev => {
        if (prev.some(m => m.id === newAccount.id || m.name.toLowerCase() === newAccount.username.toLowerCase())) {
          return prev;
        }
        const newMember: SquadMember = {
          id: newAccount.id,
          name: newAccount.username,
          rank: newAccount.rank,
          role: newAccount.role === 'instructor' ? 'Tactical Instructor' : 'Squad Operator',
          status: 'READY',
          acknowledgedMissions: [],
          lastSeen: 'Just now',
          deviceType: 'Mobile Pager',
        };
        return [...prev, newMember];
      });
    } else {
      // If pending, notify the leader about new applicant
      const alertNotif: BroadcastNotification = {
        id: `notif-req-${Date.now()}`,
        missionId: 'msn-approval',
        missionCode: 'RECRUIT APPLICATION',
        title: `⚡ طلب انضمام جديد: المقاتل ${newAccount.username}`,
        date: 'Today',
        message: `مقاتل جديد (${newAccount.username}) يطلب الانضمام لوحدة الصاعقة. الرتبة المقترحة: ${newAccount.requestedRank || '[PFC | جندي أول]'}. مطلوب مراجعة واعتماد القائد.`,
        sender: 'Thunderbolt HQ Command',
        timestamp: 'Just now',
        priority: 'HIGH',
        readByMembers: [],
      };
      setNotifications(prev => [alertNotif, ...prev]);
      setActiveIncomingAlert(alertNotif);
      sendBrowserNotification(`⚡ طلب انضمام جديد: ${newAccount.username}`, {
        body: 'مطلوب مراجعة واعتماد القائد وتحديد الرتبة العسكرية.',
      });
    }

    if (autoSwitch) {
      setCurrentUser(newAccount);
      setUserRole(newAccount.role);
    }
  };

  // Approve a pending account & bestow leader-assigned military rank
  const handleApproveAccount = (accountId: string, assignedRank: string) => {
    const rankFormatted = normalizeRank(assignedRank);
    
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            approvalStatus: 'approved',
            rank: rankFormatted,
          };
        }
        return acc;
      })
    );

    // Find the account to add to members roster
    const target = accounts.find(a => a.id === accountId);
    const targetName = target ? target.username : 'Unknown';

    setMembers(prev => {
      const existingIdx = prev.findIndex(m => m.id === accountId || m.name.toLowerCase() === targetName.toLowerCase());
      const newSquadMember: SquadMember = {
        id: accountId,
        name: targetName,
        rank: rankFormatted,
        role: target?.role === 'instructor' ? 'Tactical Instructor' : 'Squad Operator',
        status: 'READY',
        acknowledgedMissions: [],
        lastSeen: 'Just now',
        deviceType: 'Mobile Pager',
      };
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = newSquadMember;
        return next;
      }
      return [...prev, newSquadMember];
    });

    if (currentUser.id === accountId) {
      setCurrentUser(prev => ({
        ...prev,
        approvalStatus: 'approved',
        rank: rankFormatted,
      }));
    }

    // Add command notification
    const orderNotif: BroadcastNotification = {
      id: `notif-appr-${Date.now()}`,
      missionId: 'msn-roster',
      missionCode: 'COMMISSION ORDER',
      title: `اعتماد المقاتل: ${targetName}`,
      date: 'Today',
      message: `أمر إداري: تم اعتماد وقبول المقاتل (${targetName}) وتعيين رتبته العسكرية رسمياً: ${rankFormatted} بواسطة اللواء أ.ح Dragon.`,
      sender: COMMANDER_NAME,
      timestamp: 'Just now',
      priority: 'HIGH',
      readByMembers: [],
    };
    setNotifications(prev => [orderNotif, ...prev]);
  };

  // Reject a pending account
  const handleRejectAccount = (accountId: string) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            approvalStatus: 'rejected',
          };
        }
        return acc;
      })
    );
    setMembers(prev => prev.filter(m => m.id !== accountId));
    if (currentUser.id === accountId) {
      setCurrentUser(prev => ({
        ...prev,
        approvalStatus: 'rejected',
      }));
    }
  };

  // Update / Promote a member's rank (Leader only command)
  const handleUpdateMemberRank = (accountId: string, newRank: string) => {
    const rankFormatted = normalizeRank(newRank);

    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            rank: rankFormatted,
          };
        }
        return acc;
      })
    );

    const targetAcc = accounts.find(a => a.id === accountId);
    const targetName = targetAcc ? targetAcc.username : '';

    setMembers(prev =>
      prev.map(m => {
        if (m.id === accountId || (targetName && m.name.toLowerCase() === targetName.toLowerCase())) {
          return {
            ...m,
            rank: rankFormatted,
          };
        }
        return m;
      })
    );

    if (currentUser.id === accountId) {
      setCurrentUser(prev => ({
        ...prev,
        rank: rankFormatted,
      }));
    }

    if (targetName) {
      const promoNotif: BroadcastNotification = {
        id: `notif-promo-${Date.now()}`,
        missionId: 'msn-roster',
        missionCode: 'PROMOTION ORDER',
        title: `ترقية وتعديل رتبة: ${targetName}`,
        date: 'Today',
        message: `أمر ترقية عسكري: تم ترقية وتعديل رتبة المقاتل (${targetName}) إلى ${rankFormatted} بأمر من اللواء أ.ح Dragon.`,
        sender: COMMANDER_NAME,
        timestamp: 'Just now',
        priority: 'TACTICAL',
        readByMembers: [],
      };
      setNotifications(prev => [promoNotif, ...prev]);
    }
  };

  // Switch between existing registered accounts
  const handleSwitchAccount = (account: UserAccount) => {
    setCurrentUser(account);
    setUserRole(account.role);
    localStorage.setItem('thunderbolt_user_account', JSON.stringify(account));
    localStorage.setItem('thunderbolt_user_role', account.role);
  };

  // Delete an account (if more than 1 exists)
  const handleDeleteAccount = (accountId: string) => {
    if (accounts.length <= 1) return;
    const remaining = accounts.filter(a => a.id !== accountId);
    setAccounts(remaining);
    if (currentUser.id === accountId) {
      const nextUser = remaining[0];
      setCurrentUser(nextUser);
      setUserRole(nextUser.role);
    }
  };

  useEffect(() => {
    localStorage.setItem('thunderbolt_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('thunderbolt_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('thunderbolt_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Audio mute sync
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    tacticalAudio.setMuted(next);
    if (!next) {
      tacticalAudio.playRadioClick();
    }
  };

  const handleToggleLang = () => {
    tacticalAudio.playRadioClick();
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  // Broadcast Alert for a Mission to all squad members
  const handleBroadcastAlert = (mission: Mission) => {
    tacticalAudio.playTacticalAlert();

    const newNotification: BroadcastNotification = {
      id: `notif-${Date.now()}`,
      missionId: mission.id,
      missionCode: mission.codeName,
      title: `⚡ New mission: ${mission.title}`,
      date: `${mission.dayName}, ${mission.date}`,
      message: `Attention all operators! Under command of Maj. Gen. dragon: ${mission.title} scheduled for ${mission.dayName} ${mission.date} at ${mission.time}. Location: ${mission.targetSector}.`,
      sender: COMMANDER_NAME,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: mission.priority,
      readByMembers: members.slice(0, 4).map(m => m.id),
    };

    setNotifications(prev => [newNotification, ...prev]);

    setMissions(prev =>
      prev.map(m =>
        m.id === mission.id
          ? { ...m, broadcastCount: m.broadcastCount + 1, lastBroadcastTime: 'Just now' }
          : m
      )
    );

    setActiveIncomingAlert(newNotification);

    sendBrowserNotification(`⚡ Thunderbolt Unit: ${mission.title}`, {
      body: `Mission on ${mission.dayName} ${mission.date} at ${mission.time}. Dispatched by Maj. Gen. dragon.`,
    });
  };

  // Dispatch a brand new mission
  const handleDispatchNewMission = (newMission: Mission) => {
    tacticalAudio.playTacticalAlert();
    setMissions(prev => [newMission, ...prev]);
    handleBroadcastAlert(newMission);
  };

  // Update attendance status (Ready, Late, Absence, Bench) for a member in a mission
  const handleUpdateMissionAttendance = (missionId: string, memberId: string, status: MissionAttendanceStatus) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          const attendance = { ...(m.attendance || {}) };
          attendance[memberId] = status;
          return { ...m, attendance };
        }
        return m;
      })
    );
  };

  // Toggle user's acknowledgment of a mission
  const handleToggleAcknowledge = (missionId: string) => {
    const activeUserId = currentUser.id || 'mem-01';
    setMembers(prev =>
      prev.map(m => {
        if (m.id === activeUserId || m.name.toLowerCase() === currentUser.username.toLowerCase()) {
          const has = m.acknowledgedMissions.includes(missionId);
          return {
            ...m,
            acknowledgedMissions: has
              ? m.acknowledgedMissions.filter(id => id !== missionId)
              : [...m.acknowledgedMissions, missionId],
          };
        }
        return m;
      })
    );
    // Also sync attendance to READY if acknowledged
    handleUpdateMissionAttendance(missionId, activeUserId, 'READY');
  };

  return (
    <>
      {/* Start / Splash Screen (Initial Entry with Logo & Sound) */}
      {showSplash && (
        <SplashScreen
          onEnter={() => setShowSplash(false)}
          onDirectToMission={() => setShowSplash(false)}
          commanderName="Maj. Gen. dragon"
        />
      )}

      {/* Floating Alert Banner when siren or notification is dispatched */}
      {activeIncomingAlert && (
        <IncomingAlertBanner
          notification={activeIncomingAlert}
          onOpenBriefing={() => setActiveIncomingAlert(null)}
          onDismiss={() => setActiveIncomingAlert(null)}
          lang={lang}
        />
      )}

      {/* Main Thunderbolt Unit Application matching whacka layout */}
      <WhackaThunderboltApp
        missions={missions}
        members={members}
        notifications={notifications}
        onDispatchMission={handleDispatchNewMission}
        onBroadcastAlert={handleBroadcastAlert}
        onToggleAcknowledge={handleToggleAcknowledge}
        onUpdateAttendance={handleUpdateMissionAttendance}
        lang={lang}
        onToggleLang={handleToggleLang}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onShowSplash={() => setShowSplash(true)}
        userRole={userRole}
        onSetUserRole={handleSetUserRole}
        currentUser={currentUser}
        onUpdateUserAccount={handleUpdateUserAccount}
        accounts={accounts}
        onAddAccount={handleAddAccount}
        onSwitchAccount={handleSwitchAccount}
        onDeleteAccount={handleDeleteAccount}
        onApproveAccount={handleApproveAccount}
        onRejectAccount={handleRejectAccount}
        onUpdateMemberRank={handleUpdateMemberRank}
      />
    </>
  );
}
