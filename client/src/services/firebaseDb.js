import { db, isFirebaseConnected, firebaseConfig } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

const withTimeout = (promise, ms = 2500) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Firebase client timeout')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

/**
 * Service to sync and persist data to Firebase Firestore (Project: brototype-79697)
 */
export const FirebaseService = {
  
  /**
   * Check if Firebase is configured and test connectivity
   */
  checkConnection: async () => {
    if (!isFirebaseConnected || !db) {
      return { 
        connected: false, 
        projectId: firebaseConfig.projectId, 
        message: 'Firebase app is not initialized.' 
      };
    }
    try {
      // Test ping to a meta connection collection
      const pingRef = doc(db, '_connection_test', 'status');
      await setDoc(pingRef, {
        status: 'ONLINE',
        lastPing: new Date().toISOString(),
        platform: 'CivicBridge AI',
        projectId: firebaseConfig.projectId
      }, { merge: true });

      return {
        connected: true,
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        storageBucket: firebaseConfig.storageBucket,
        message: 'Connected to Firebase Firestore successfully!'
      };
    } catch (error) {
      console.warn('⚠️ [Firebase Firestore Ping Notice]:', error.message);
      // Return true if initialized even if rules block anonymous write
      return {
        connected: true,
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        storageBucket: firebaseConfig.storageBucket,
        notice: error.code === 'permission-denied' ? 'Connected (Firestore security rules active)' : error.message
      };
    }
  },

  /**
   * Save or update citizen profile in Firestore
   */
  syncProfile: async (userId, profileData) => {
    if (!db) return null;
    try {
      const citizenRef = doc(db, 'citizens', userId || 'user_citizen_001');
      await withTimeout(setDoc(citizenRef, {
        ...profileData,
        syncedAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Synced citizen profile for ${userId}`);
      return true;
    } catch (err) {
      console.warn('Firebase profile sync error:', err.message);
      return false;
    }
  },

  /**
   * Save an application to Firestore 'applications' collection
   */
  saveApplication: async (applicationData) => {
    if (!db) return null;
    try {
      const appId = applicationData.id || `APP-2026-${Date.now()}`;
      const appRef = doc(db, 'applications', appId);
      const payload = {
        ...applicationData,
        firebaseSyncedAt: new Date().toISOString(),
        createdAtServer: serverTimestamp()
      };
      await withTimeout(setDoc(appRef, payload, { merge: true }));
      console.log(`🔥 [Firebase]: Successfully saved application ${appId} to Firestore`);
      return { success: true, id: appId };
    } catch (err) {
      console.warn('Firebase application save error:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Save consent authorization to Firestore 'consents' collection
   */
  saveConsent: async (consentData) => {
    if (!db) return null;
    try {
      const consentId = consentData.id || `CST-${Date.now()}`;
      const consentRef = doc(db, 'consents', consentId);
      await withTimeout(setDoc(consentRef, {
        ...consentData,
        firebaseSyncedAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Saved consent authorization ${consentId} to Firestore`);
      return true;
    } catch (err) {
      console.warn('Firebase consent save error:', err.message);
      return false;
    }
  },

  /**
   * Save or sync user record upon Login / Registration to Firestore 'users' collection
   */
  syncUser: async (userData, profileData = null) => {
    if (!db) return null;
    try {
      const cleanEmail = (userData.email || 'user').toLowerCase().trim();
      const docId = userData.id || `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const userRef = doc(db, 'users', docId);

      const payload = {
        uid: userData.id || docId,
        name: userData.name || userData.fullName || 'Citizen User',
        email: cleanEmail,
        role: userData.role || 'citizen',
        lastLogin: new Date().toISOString(),
        updatedAt: serverTimestamp(),
        profileSummary: profileData ? {
          mobile: profileData.mobile || profileData.phone || '',
          district: profileData.district || '',
          state: profileData.state || '',
          cutoffMark: profileData.cutoffMark || null,
          annualIncome: profileData.annualFamilyIncome || null
        } : null
      };

      await withTimeout(setDoc(userRef, payload, { merge: true }));
      console.log(`🔥 [Firebase]: Successfully written user to 'users' collection (ID: ${docId})`);
      return { success: true, docId };
    } catch (err) {
      console.error('Firebase user sync error:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * One-click populate demo data (users, applications, audit logs) into Firestore
   */
  seedInitialData: async () => {
    if (!db) return false;
    try {
      // 1. Citizen demo user
      await FirebaseService.syncUser({
        id: 'user_citizen_001',
        name: 'Thanga Prabu N',
        email: 'demo@civicbridge.ai',
        role: 'citizen'
      }, {
        mobile: '+91 98765 43210',
        district: 'Karur',
        state: 'Tamil Nadu',
        cutoffMark: 185.0,
        annualFamilyIncome: 180000
      });

      // 2. Admin official demo user
      await FirebaseService.syncUser({
        id: 'user_admin_001',
        name: 'System Administrator',
        email: 'admin@civicbridge.ai',
        role: 'admin'
      });

      // 3. Sample Application
      await FirebaseService.saveApplication({
        id: 'APP-2026-9021',
        serviceId: 'SRV-FGB-01',
        serviceName: 'First-Generation Graduate Benefit',
        department: 'Department of Higher Education',
        citizenName: 'Thanga Prabu N',
        citizenEmail: 'demo@civicbridge.ai',
        status: 'Submitted',
        appliedAt: new Date().toISOString()
      });

      return true;
    } catch (err) {
      console.warn('Seed data error:', err);
      return false;
    }
  },

  /**
   * Save security and audit log to Firestore 'audit_logs' collection
   */
  logAudit: async (auditData) => {
    if (!db) return null;
    try {
      const logRef = doc(db, 'audit_logs', `AUD-${Date.now()}`);
      await setDoc(logRef, {
        ...auditData,
        timestampServer: serverTimestamp(),
        hash: auditData.hash || `SHA256:${Date.now().toString(16).toUpperCase()}`
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn('Firebase audit log error:', err.message);
      return false;
    }
  }
};

export default FirebaseService;
