import React, { useState, useEffect } from 'react';
import { 
  COMMANDER_NAME, 
  INITIAL_MEMBERS, 
  INITIAL_MISSIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { 
  Mission, 
  SquadMember, 
  BroadcastNotification, 
  UserRole, 
  UserAccount, 
  MissionAttendanceStatus, 
  QualificationStatus, 
  QualificationEntry,
  TrainingBooking
} from './types';
import { ThunderboltApp } from './components/ThunderboltApp';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { SignUpModal } from './components/SignUpModal';
import { IncomingAlertBanner } from './components/IncomingAlertBanner';
import { PendingClearanceScreen } from './components/PendingClearanceScreen';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { tacticalAudio, sendBrowserNotification } from './utils/audio';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  auth,
  syncUserAccountToFirestore, 
  updateClearanceInFirestore, 
  subscribeToUserAccount, 
  subscribeToAllUserAccounts,
  syncTrainingBookingToFirestore,
  updateTrainingBookingStatusInFirestore,
  subscribeToTrainingBookings
} from './utils/firebase';

const DEFAULT_USER: UserAccount = {
  id: 'usr-01',
  username: 'Dragon',
  rank: '[MG | لواء أ.ح]',
  role: 'instructor',
  approvalStatus: 'approved',
  email: 'dragon@thunderbolt.unit',
  unitServiceId: 'TU-9198',
  steamUid: '76561198000009198',
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
    unitServiceId: 'TU-8412',
    steamUid: '76561198084120391',
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
    unitServiceId: 'TU-1840',
    steamUid: '76561198018409382',
    joinedDate: '2026-10-23',
    isRegistered: true,
  },
];

const INITIAL_TRAINING_BOOKINGS: TrainingBooking[] = [
  {
    id: 'tb-demo-01',
    qualificationId: '01.1',
    qualificationTitle: 'Basic Combat Marksmanship (الرماية الأساسية)',
    candidateId: 'usr-member-01',
    candidateName: 'Tariq',
    candidateEmail: 'tariq@thunderbolt.unit',
    candidateRank: '[PFC | جندي أول]',
    year: 2026,
    month: 11,
    day: 15,
    timeSlot: '09:00 - 12:00',
    slotLabel: '0900 - 1200 hrs (Morning Slot)',
    companionEmail: 'ahmed@thunderbolt.unit',
    companionName: 'Ahmed',
    notes: 'Live-fire ARMA qualification lane readiness test with companion operator.',
    status: 'pending',
    createdAt: '2026-10-24T10:00:00Z',
  }
];

export default function App() {
  // Navigation & View States (English default)
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('thunderbolt_is_logged_in') === 'true';
  });
  const [showSignUpGate, setShowSignUpGate] = useState<boolean>(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(() => auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setFirebaseUser(usr);
    });
    return () => unsub();
  }, []);

  // Helper to normalize rank formatting to Arabic military rank format [CODE | Arabic Rank]
  const normalizeRank = (rk: string): string => {
    if (!rk) return '[PFC | جندي أول]';
    const clean = rk.replace(/\s*I\s*/g, ' | ');
    const isStaff = clean.includes('أركان حرب') || clean.includes('اركان حرب') || clean.includes('أ.ح') || clean.includes('ا.ح');

    if (clean.includes('لواء') || clean.includes('MG') || clean.includes('Major General')) {
      return isStaff ? '[MG | لواء أ.ح]' : '[MG | لواء]';
    }
    if (clean.includes('عميد') || clean.includes('BGD') || clean.includes('Brigadier')) {
      return isStaff ? '[BGD | عميد أ.ح]' : '[BGD | عميد]';
    }
    if (clean.includes('عقيد') || (clean.includes('COL') && !clean.includes('LTC')) || (clean.includes('Colonel') && !clean.includes('Lieutenant'))) {
      return isStaff ? '[COL | عقيد أ.ح]' : '[COL | عقيد]';
    }
    if (clean.includes('مقدم') || clean.includes('LTC') || clean.includes('Lieutenant Colonel')) {
      return isStaff ? '[LTC | مقدم أ.ح]' : '[LTC | مقدم]';
    }
    if (clean.includes('رائد') || clean.includes('MAJ') || (clean.includes('Major') && !clean.includes('General'))) {
      return isStaff ? '[MAJ | رائد أ.ح]' : '[MAJ | رائد]';
    }
    if (clean.includes('نقيب') || clean.includes('CPT') || clean.includes('Captain')) return '[CPT | نقيب]';
    if (clean.includes('ملازم أول') || clean.includes('1LT') || clean.includes('1st Lieutenant')) return '[1LT | ملازم أول]';
    if (clean.includes('ملازم') || clean.includes('2LT') || clean.includes('2nd Lieutenant')) return '[2LT | ملازم]';
    if (clean.includes('رقيب أول') || clean.includes('MSG') || clean.includes('Master Sergeant')) return '[MSG | رقيب أول]';
    if (clean.includes('رقيب') || clean.includes('SGT') || clean.includes('Sergeant')) return '[SGT | رقيب]';
    if (clean.includes('عريف') || clean.includes('CPL') || clean.includes('Corporal')) return '[CPL | عريف]';
    if (clean.includes('جندي أول') || clean.includes('PFC') || clean.includes('Private First Class')) return '[PFC | جندي أول]';
    if (clean.includes('جندي') || clean.includes('PVT') || clean.includes('Private')) return '[PVT | جندي]';
    return clean;
  };

  // Registered Accounts (Multi-account support for Instructors & Members)
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('thunderbolt_user_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((acc: UserAccount, idx: number) => {
            const cleanAcc = { ...acc };
            if (cleanAcc.username === 'Mahmoud Osama') {
              cleanAcc.username = 'Mahmoud';
            }
            if (cleanAcc.rank) {
              cleanAcc.rank = normalizeRank(cleanAcc.rank);
            }
            if (cleanAcc.requestedRank) {
              cleanAcc.requestedRank = normalizeRank(cleanAcc.requestedRank);
            }
            if ((cleanAcc.role as string) === 'client') {
              cleanAcc.role = 'member';
            }
            if (!cleanAcc.unitServiceId) {
              cleanAcc.unitServiceId = cleanAcc.username.toLowerCase() === 'dragon' ? 'TU-9198' : `TU-${8000 + idx * 317}`;
            }
            if (!cleanAcc.steamUid) {
              cleanAcc.steamUid = `7656119800000${cleanAcc.unitServiceId.replace(/\D/g, '') || '9198'}`;
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
          parsed.rank = '[MG | لواء أ.ح]';
        }
        if ((parsed.role as string) === 'client') {
          parsed.role = 'member';
        }
        if (!parsed.unitServiceId) {
          parsed.unitServiceId = parsed.username?.toLowerCase() === 'dragon' ? 'TU-9198' : 'TU-9198';
        }
        if (!parsed.steamUid) {
          parsed.steamUid = '76561198000009198';
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: SquadMember) => ({
            ...m,
            rank: normalizeRank(m.rank),
          }));
        }
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

  // Training Bookings (Calendar Appointments for Qualification Assessment)
  const [trainingBookings, setTrainingBookings] = useState<TrainingBooking[]>(() => {
    const saved = localStorage.getItem('thunderbolt_training_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRAINING_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('thunderbolt_training_bookings', JSON.stringify(trainingBookings));
  }, [trainingBookings]);

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

  // Real-time subscription to the current user's document in Firestore (only when authenticated with Firebase)
  useEffect(() => {
    if (!firebaseUser || !isLoggedIn || !currentUser?.id) return;
    const unsubscribe = subscribeToUserAccount(currentUser.id, (remoteAccount) => {
      if (remoteAccount) {
        setCurrentUser(prev => {
          if (prev.approvalStatus === 'pending' && remoteAccount.approvalStatus === 'approved') {
            tacticalAudio.playSuccessBeep();
          }
          return { ...prev, ...remoteAccount };
        });
        if (remoteAccount.role) {
          setUserRole(remoteAccount.role);
          localStorage.setItem('thunderbolt_user_role', remoteAccount.role);
        }
      }
    });
    return () => unsubscribe();
  }, [firebaseUser, isLoggedIn, currentUser?.id]);

  // Real-time subscription for Instructors to sync all user accounts & pending applications
  useEffect(() => {
    if (!firebaseUser || !isLoggedIn || userRole !== 'instructor') return;
    const unsubscribe = subscribeToAllUserAccounts((remoteAccounts) => {
      if (remoteAccounts && remoteAccounts.length > 0) {
        setAccounts(prev => {
          const merged = [...prev];
          remoteAccounts.forEach(ra => {
            const idx = merged.findIndex(a => a.id === ra.id || (a.email && a.email.toLowerCase() === ra.email?.toLowerCase()));
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...ra };
            } else {
              merged.push(ra);
            }
          });
          return merged;
        });
      }
    });
    return () => unsubscribe();
  }, [firebaseUser, isLoggedIn, userRole]);

  // Real-time subscription to Training Bookings from Firestore
  useEffect(() => {
    if (!firebaseUser || !isLoggedIn) return;
    const unsubscribe = subscribeToTrainingBookings((remoteBookings) => {
      if (remoteBookings && remoteBookings.length > 0) {
        setTrainingBookings(prev => {
          const merged = [...prev];
          remoteBookings.forEach(rb => {
            const idx = merged.findIndex(b => b.id === rb.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...rb };
            } else {
              merged.push(rb);
            }
          });
          return merged;
        });
      }
    });
    return () => unsubscribe();
  }, [firebaseUser, isLoggedIn]);

  const handleSaveTrainingBooking = (booking: TrainingBooking) => {
    tacticalAudio.playSuccessBeep();
    setTrainingBookings(prev => {
      const idx = prev.findIndex(b => b.id === booking.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = booking;
        return next;
      }
      return [booking, ...prev];
    });
    // Sync to Firebase Firestore cloud database
    syncTrainingBookingToFirestore(booking);
  };

  const handleApproveTrainingBooking = (bookingId: string) => {
    tacticalAudio.playSuccessBeep();
    const approvedByName = currentUser.username || 'Dragon';
    const approvedAtIso = new Date().toISOString();
    setTrainingBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'confirmed',
              approvedBy: approvedByName,
              approvedAt: approvedAtIso,
            }
          : b
      )
    );
    // Sync status change to Firebase Firestore cloud database
    updateTrainingBookingStatusInFirestore(bookingId, 'confirmed', approvedByName);
  };

  const handleRejectTrainingBooking = (bookingId: string) => {
    tacticalAudio.playRadioClick();
    const approvedByName = currentUser.username || 'Dragon';
    setTrainingBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'rejected',
              approvedBy: approvedByName,
              approvedAt: new Date().toISOString(),
            }
          : b
      )
    );
    // Sync status change to Firebase Firestore cloud database
    updateTrainingBookingStatusInFirestore(bookingId, 'rejected', approvedByName);
  };

  // Add a new account (e.g. recruit signup or leader adding member)
  const handleAddAccount = (newAccount: UserAccount, autoSwitch: boolean = true) => {
    // Force pending approval for any self sign up unless an instructor is logged in
    const isCommanderAdmin = userRole === 'instructor';
    const finalizedAccount: UserAccount = {
      ...newAccount,
      approvalStatus: isCommanderAdmin ? (newAccount.approvalStatus || 'approved') : 'pending',
      role: isCommanderAdmin ? newAccount.role : 'member',
    };

    setAccounts(prev => {
      const existing = prev.find(a => a.id === finalizedAccount.id || a.username.toLowerCase() === finalizedAccount.username.toLowerCase());
      if (existing) {
        return prev.map(a => a.id === existing.id ? finalizedAccount : a);
      }
      return [finalizedAccount, ...prev];
    });

    // Sync to Firestore cloud database
    syncUserAccountToFirestore(finalizedAccount);

    // If account is already approved (e.g. created by leader), add to squad members roster
    if (finalizedAccount.approvalStatus !== 'pending' && finalizedAccount.approvalStatus !== 'rejected') {
      setMembers(prev => {
        if (prev.some(m => m.id === finalizedAccount.id || m.name.toLowerCase() === finalizedAccount.username.toLowerCase())) {
          return prev;
        }
        const newMember: SquadMember = {
          id: finalizedAccount.id,
          name: finalizedAccount.username,
          rank: finalizedAccount.rank,
          role: finalizedAccount.role === 'instructor' ? 'Tactical Instructor' : 'Squad Operator',
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
        title: `⚡ New Recruit Application: ${finalizedAccount.username}`,
        date: 'Today',
        message: `New recruit (${finalizedAccount.username}) requested to join Thunderbolt Unit. Suggested rank: ${finalizedAccount.requestedRank || '[PFC | جندي أول]'}. Commander clearance required.`,
        sender: 'Thunderbolt HQ Command',
        timestamp: 'Just now',
        priority: 'HIGH',
        readByMembers: [],
      };
      setNotifications(prev => [alertNotif, ...prev]);
      setActiveIncomingAlert(alertNotif);
      sendBrowserNotification(`⚡ New Recruit Application: ${finalizedAccount.username}`, {
        body: 'Commander review and military rank commissioning required.',
      });
    }

    if (autoSwitch) {
      setCurrentUser(finalizedAccount);
      setUserRole(finalizedAccount.role);
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

    // Update in Firestore cloud database
    updateClearanceInFirestore(accountId, 'approved', rankFormatted, currentUser.username);

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
      title: `Commission Order: ${targetName}`,
      date: 'Today',
      message: `Administrative Order: Operator (${targetName}) has been officially commissioned with rank ${rankFormatted} by Maj. Gen. Dragon.`,
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

    // Update in Firestore cloud database
    updateClearanceInFirestore(accountId, 'rejected', undefined, currentUser.username);

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
        title: `Rank Update / Promotion: ${targetName}`,
        date: 'Today',
        message: `Command Promotion: Operator (${targetName}) military rank updated to ${rankFormatted} by order of Maj. Gen. Dragon.`,
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

  // Gateway Login & Logout Handlers
  const handleLoginSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    setUserRole(account.role);
    setIsLoggedIn(true);
    localStorage.setItem('thunderbolt_is_logged_in', 'true');
    localStorage.setItem('thunderbolt_user_account', JSON.stringify(account));
    localStorage.setItem('thunderbolt_user_role', account.role);
  };

  const handleLogout = () => {
    tacticalAudio.playRadioClick();
    setIsLoggedIn(false);
    localStorage.removeItem('thunderbolt_is_logged_in');
  };

  const handleSignUpFromGate = (newAccount: UserAccount) => {
    handleAddAccount(newAccount, true);
    setShowSignUpGate(false);
    handleLoginSuccess(newAccount);
  };

  // Update member qualifications (Sa'ka Academy Certification)
  const handleUpdateMemberQualifications = (memberId: string, qualifications: Record<string, QualificationEntry>) => {
    setAccounts(prev =>
      prev.map(acc => (acc.id === memberId ? { ...acc, qualifications } : acc))
    );
    setMembers(prev =>
      prev.map(m => (m.id === memberId ? { ...m, qualifications } : m))
    );
    if (currentUser.id === memberId) {
      const updatedUser = { ...currentUser, qualifications };
      setCurrentUser(updatedUser);
      localStorage.setItem('thunderbolt_user_account', JSON.stringify(updatedUser));
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginPage
          accounts={accounts}
          onLoginSuccess={handleLoginSuccess}
          onOpenSignUp={() => setShowSignUpGate(true)}
          lang={lang}
          onToggleLang={handleToggleLang}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {showSignUpGate && (
          <SignUpModal
            isOpen={showSignUpGate}
            onClose={() => setShowSignUpGate(false)}
            onSignUpComplete={handleSignUpFromGate}
            initialRole="member"
          />
        )}
      </>
    );
  }

  // Military Clearance Gate: All newly registered accounts require instructor approval before entering the app
  if (currentUser.approvalStatus === 'pending' || currentUser.approvalStatus === 'rejected') {
    return (
      <>
        <PendingClearanceScreen
          currentUser={currentUser}
          onRefreshStatus={() => {
            const localAcc = accounts.find(a => a.id === currentUser.id);
            if (localAcc) {
              setCurrentUser(localAcc);
            }
          }}
          onSwitchAccount={() => setShowAccountSwitcher(true)}
          onLogout={handleLogout}
          lang={lang}
        />

        {showAccountSwitcher && (
          <AccountSwitcherModal
            isOpen={showAccountSwitcher}
            onClose={() => setShowAccountSwitcher(false)}
            accounts={accounts}
            currentAccountId={currentUser.id}
            onSwitchAccount={(acc) => {
              handleSwitchAccount(acc);
              setShowAccountSwitcher(false);
            }}
            onOpenAddAccount={(role) => {
              setShowAccountSwitcher(false);
              setShowSignUpGate(true);
            }}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

        {showSignUpGate && (
          <SignUpModal
            isOpen={showSignUpGate}
            onClose={() => setShowSignUpGate(false)}
            onSignUpComplete={handleSignUpFromGate}
            initialRole="member"
          />
        )}
      </>
    );
  }

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

      {/* Main Thunderbolt Unit Application */}
      <ThunderboltApp
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
        onLogout={handleLogout}
        onUpdateMemberQualifications={handleUpdateMemberQualifications}
        trainingBookings={trainingBookings}
        onSaveTrainingBooking={handleSaveTrainingBooking}
        onApproveTrainingBooking={handleApproveTrainingBooking}
        onRejectTrainingBooking={handleRejectTrainingBooking}
      />
    </>
  );
}
