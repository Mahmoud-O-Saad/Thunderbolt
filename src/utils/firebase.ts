import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserAccount, TrainingBooking } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Verify connection on boot per Firebase skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is offline or checking connection.');
    }
  }
}
testConnection();

/**
 * Sign in with Google using popup
 */
export async function signInWithGooglePopup(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
      // User closed popup or cancelled sign-in intentionally
      return null;
    }
    console.warn('Google Sign In note:', err?.message || err);
    return null;
  }
}

/**
 * Sign out from Firebase
 */
export async function logoutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

/**
 * Sync or create a UserAccount document in Firestore
 */
export async function syncUserAccountToFirestore(account: UserAccount): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  const userDocRef = doc(db, 'users', account.id);
  const path = `users/${account.id}`;
  try {
    await setDoc(userDocRef, {
      ...account,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update clearance/rank for an account (Instructor action)
 */
export async function updateClearanceInFirestore(
  accountId: string, 
  approvalStatus: 'approved' | 'pending' | 'rejected',
  assignedRank?: string,
  approvedBy?: string
): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  const userDocRef = doc(db, 'users', accountId);
  const path = `users/${accountId}`;
  const updates: Record<string, any> = {
    approvalStatus,
    approvedAt: new Date().toISOString()
  };
  if (assignedRank) updates.rank = assignedRank;
  if (approvedBy) updates.approvedBy = approvedBy;

  try {
    await updateDoc(userDocRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Real-time subscription to a single user document
 */
export function subscribeToUserAccount(
  accountId: string, 
  onUpdate: (account: UserAccount | null) => void
): Unsubscribe {
  // Only attach onSnapshot if Firebase Auth is ready and authenticated
  if (!auth.currentUser) {
    return () => {};
  }

  const userDocRef = doc(db, 'users', accountId);
  const path = `users/${accountId}`;

  return onSnapshot(
    userDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserAccount);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Real-time subscription to all registered users (for Instructors)
 */
export function subscribeToAllUserAccounts(
  onUpdate: (accounts: UserAccount[]) => void
): Unsubscribe {
  // Only attach onSnapshot if Firebase Auth is ready and authenticated
  if (!auth.currentUser) {
    return () => {};
  }

  const usersCollectionRef = collection(db, 'users');
  const path = 'users';

  return onSnapshot(
    usersCollectionRef,
    (snapshot) => {
      const list: UserAccount[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as UserAccount);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Create or sync a TrainingBooking in Firestore
 */
export async function syncTrainingBookingToFirestore(booking: TrainingBooking): Promise<void> {
  if (!auth.currentUser) return;
  const bookingDocRef = doc(db, 'trainingBookings', booking.id);
  const path = `trainingBookings/${booking.id}`;
  try {
    await setDoc(bookingDocRef, {
      ...booking,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update TrainingBooking status (Instructor approval/rejection)
 */
export async function updateTrainingBookingStatusInFirestore(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'rejected',
  approvedBy?: string
): Promise<void> {
  if (!auth.currentUser) return;
  const bookingDocRef = doc(db, 'trainingBookings', bookingId);
  const path = `trainingBookings/${bookingId}`;
  const updates: Record<string, any> = {
    status,
    updatedAt: new Date().toISOString()
  };
  if (approvedBy) updates.approvedBy = approvedBy;
  if (status === 'confirmed') updates.approvedAt = new Date().toISOString();

  try {
    await updateDoc(bookingDocRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Real-time subscription to training bookings
 */
export function subscribeToTrainingBookings(
  onUpdate: (bookings: TrainingBooking[]) => void
): Unsubscribe {
  if (!auth.currentUser) {
    return () => {};
  }
  const bookingsCol = collection(db, 'trainingBookings');
  const path = 'trainingBookings';

  return onSnapshot(
    bookingsCol,
    (snapshot) => {
      const list: TrainingBooking[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as TrainingBooking);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

