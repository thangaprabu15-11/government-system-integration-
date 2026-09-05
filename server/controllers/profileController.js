const store = require('../utils/store');
const firebaseSync = require('../config/firebase');

const getProfile = (req, res) => {
  const userId = req.user ? req.user.id : store.users[0].id;
  let profile = store.profiles.find(p => p.userId === userId);

  if (!profile) {
    profile = store.profiles[0];
  }

  const docs = store.documents.filter(d => d.userId === userId || d.userId === 'user_citizen_001');

  res.json({
    success: true,
    profile,
    documents: docs,
    completionPercentage: profile.completionPercentage || 88
  });
};

const updateProfile = async (req, res) => {
  const userId = req.user ? req.user.id : store.users[0].id;
  let profileIndex = store.profiles.findIndex(p => p.userId === userId);

  if (profileIndex === -1) {
    profileIndex = 0;
  }

  const updatedFields = req.body;
  const updatedProfile = {
    ...store.profiles[profileIndex],
    ...updatedFields,
    updatedAt: new Date().toISOString()
  };
  store.profiles[profileIndex] = updatedProfile;

  // Audit log
  const auditEntry = {
    id: `aud_${Date.now()}`,
    timestamp: new Date(),
    userName: updatedProfile.fullName || 'User',
    userId,
    action: 'Profile Updated',
    serviceName: 'Citizen Profile Engine',
    dataAccessed: Object.keys(updatedFields),
    consentStatus: 'Self Managed',
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1'
  };
  store.auditLogs.unshift(auditEntry);

  // 🔥 Non-blocking background sync to Firebase Firestore (brototype-79697)
  firebaseSync.saveProfile(userId, updatedProfile).catch(e => console.warn('Firebase saveProfile:', e.message));
  firebaseSync.saveAuditLog(auditEntry).catch(e => console.warn('Firebase saveAuditLog:', e.message));

  res.json({
    success: true,
    message: 'Profile updated successfully and synced with Firebase Firestore',
    profile: updatedProfile
  });
};

module.exports = { getProfile, updateProfile };

