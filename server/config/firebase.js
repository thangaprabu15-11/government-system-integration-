const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBsHaH16j3WOAu9cHw4HXmdTxU6pRo5ziQ",
  authDomain: "brototype-79697.firebaseapp.com",
  projectId: "brototype-79697",
  storageBucket: "brototype-79697.firebasestorage.app",
  messagingSenderId: "401160775515",
  appId: "1:401160775515:web:9806bb20db548843be5c7e"
};

let app = null;
let db = null;
let isConnected = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isConnected = true;
  console.log('🔥 [Backend Firebase]: Connected to Cloud Firestore (brototype-79697)');
} catch (err) {
  console.error('⚠️ [Backend Firebase Init Error]:', err.message);
}

const withTimeout = (promise, ms = 2500) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Firebase operation timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

/**
 * Robust Firebase Firestore Sync Helpers for CivicBridge AI
 */
const firebaseSync = {
  db,
  isConnected,

  // 1. Sync user upon Registration or creation
  saveUser: async (user) => {
    if (!db) return;
    try {
      const docId = user.id || `user_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const userRef = doc(db, 'users', docId);
      await withTimeout(setDoc(userRef, {
        uid: user.id || docId,
        name: user.name || 'Citizen User',
        email: (user.email || '').toLowerCase().trim(),
        role: user.role || 'citizen',
        registeredAt: user.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        platform: 'CivicBridge AI',
        status: 'Active',
        updatedAt: new Date().toISOString()
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Synced user "${user.email}" to 'users' collection (ID: ${docId})`);
    } catch (e) {
      console.warn('⚠️ [Firebase saveUser error]:', e.message);
    }
  },

  // 2. Sync user login activity
  recordLogin: async (user, ip = '127.0.0.1') => {
    if (!db) return;
    try {
      const docId = user.id || `user_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const userRef = doc(db, 'users', docId);
      await withTimeout(setDoc(userRef, {
        lastLogin: new Date().toISOString(),
        lastLoginIp: ip,
        loginCountIncrement: new Date().toISOString()
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Updated login timestamp for "${user.email}" in Firestore`);
    } catch (e) {
      console.warn('⚠️ [Firebase recordLogin error]:', e.message);
    }
  },

  // 3. Sync citizen profile data
  saveProfile: async (userId, profileData) => {
    if (!db) return;
    try {
      const profileRef = doc(db, 'citizens', userId || 'user_citizen_001');
      await withTimeout(setDoc(profileRef, {
        userId,
        ...profileData,
        syncedAt: new Date().toISOString()
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Synced profile for "${userId}" to 'citizens' collection`);
    } catch (e) {
      console.warn('⚠️ [Firebase saveProfile error]:', e.message);
    }
  },

  // 4. Sync submitted application
  saveApplication: async (appData) => {
    if (!db) return;
    try {
      const appId = appData.applicationId || appData.id || `APP-2026-${Date.now()}`;
      const appRef = doc(db, 'applications', appId);
      await withTimeout(setDoc(appRef, {
        ...appData,
        applicationId: appId,
        submittedAt: new Date().toISOString(),
        platform: 'CivicBridge AI Orchestration Grid'
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Synced application "${appId}" to 'applications' collection`);
    } catch (e) {
      console.warn('⚠️ [Firebase saveApplication error]:', e.message);
    }
  },

  // 5. Sync digital consent authorization
  saveConsent: async (consentData) => {
    if (!db) return;
    try {
      const consentId = consentData.id || consentData.consentId || `CST-${Date.now()}`;
      const consentRef = doc(db, 'consents', consentId);
      await withTimeout(setDoc(consentRef, {
        ...consentData,
        consentId,
        complianceStandard: 'DPDP Act 2023',
        grantedAt: new Date().toISOString()
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Synced consent "${consentId}" to 'consents' collection`);
    } catch (e) {
      console.warn('⚠️ [Firebase saveConsent error]:', e.message);
    }
  },

  // 6. Sync immutable audit activity
  saveAuditLog: async (auditData) => {
    if (!db) return;
    try {
      const logId = auditData.id || `AUD-${Date.now()}`;
      const logRef = doc(db, 'audit_logs', logId);
      await withTimeout(setDoc(logRef, {
        ...auditData,
        id: logId,
        timestamp: new Date().toISOString(),
        hash: auditData.hash || `SHA256:${Buffer.from(`${logId}-${Date.now()}`).toString('hex').slice(0, 16).toUpperCase()}`
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Synced audit event "${auditData.action}" to 'audit_logs' collection`);
    } catch (e) {
      console.warn('⚠️ [Firebase saveAuditLog error]:', e.message);
    }
  },

  // 7. Sync rule eligibility evaluation
  saveEligibilityCheck: async (evalData) => {
    if (!db) return;
    try {
      const checkId = `CHK-${Date.now()}`;
      const checkRef = doc(db, 'eligibility_evaluations', checkId);
      await withTimeout(setDoc(checkRef, {
        ...evalData,
        checkId,
        timestamp: new Date().toISOString()
      }, { merge: true }));
      console.log(`🔥 [Firebase]: Synced eligibility check for "${evalData.serviceName || evalData.serviceId}" to Firestore`);
    } catch (e) {
      console.warn('⚠️ [Firebase saveEligibilityCheck error]:', e.message);
    }
  }
};

module.exports = firebaseSync;
