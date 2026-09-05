import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// User's provided Firebase configuration for brototype-79697
export const firebaseConfig = {
  apiKey: "AIzaSyBsHaH16j3WOAu9cHw4HXmdTxU6pRo5ziQ",
  authDomain: "brototype-79697.firebaseapp.com",
  projectId: "brototype-79697",
  storageBucket: "brototype-79697.firebasestorage.app",
  messagingSenderId: "401160775515",
  appId: "1:401160775515:web:9806bb20db548843be5c7e"
};

// Initialize Firebase App
let app = null;
let db = null;
let auth = null;
let isFirebaseConnected = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseConnected = true;
  console.log('🔥 [Firebase]: Successfully initialized Firebase for project brototype-79697');
} catch (error) {
  console.error('⚠️ [Firebase Init Error]:', error.message);
}

export { app, db, auth, isFirebaseConnected };
export default app;
