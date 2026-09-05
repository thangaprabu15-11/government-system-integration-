const store = require('../utils/store');
const firebaseSync = require('../config/firebase');

const getConsents = (req, res) => {
  const userId = req.user ? req.user.id : store.users[0].id;
  const userConsents = store.consents.filter(c => c.userId === userId || c.userId === 'user_citizen_001');

  res.json({
    success: true,
    consents: userConsents
  });
};

const grantConsent = async (req, res) => {
  const { serviceId, requestedFields, scopes, purpose } = req.body;
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const service = store.services.find(s => s.serviceId === serviceId || s.id === serviceId);

  const defaultScopes = ['Education Data', 'Income Data', 'Certificate Data', 'Address Data'];
  const defaultFields = ['Education Information', 'Income Information', 'Address Information', 'Certificate Information'];

  const existingIndex = store.consents.findIndex(c => (c.userId === userId || c.userId === 'user_citizen_001') && c.serviceId === serviceId);

  const newConsent = {
    id: `cst_${Date.now()}`,
    userId,
    serviceId: serviceId || (service ? service.serviceId : 'SRV-FGB-01'),
    serviceName: service ? service.serviceName : 'First-Generation Graduate Benefit',
    department: service ? service.department : 'Department of Higher Education',
    requestedFields: requestedFields || defaultFields,
    scopes: scopes || defaultScopes,
    purpose: purpose || 'Eligibility verification and application preparation for government benefit auto-fill.',
    grantedAt: new Date().toISOString(),
    status: 'Active'
  };

  if (existingIndex !== -1) {
    store.consents[existingIndex] = newConsent;
  } else {
    store.consents.unshift(newConsent);
  }

  // Audit log
  const auditEntry = {
    id: `aud_${Date.now()}`,
    timestamp: new Date(),
    userName: profile.fullName || 'Thanga Prabu N',
    userId,
    action: 'Consent Granted',
    serviceName: newConsent.serviceName,
    dataAccessed: newConsent.requestedFields,
    consentStatus: 'Granted',
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1'
  };
  store.auditLogs.unshift(auditEntry);

  // 🔥 Non-blocking background sync to Firebase Firestore (brototype-79697)
  firebaseSync.saveConsent(newConsent).catch(e => console.warn('Firebase saveConsent:', e.message));
  firebaseSync.saveAuditLog(auditEntry).catch(e => console.warn('Firebase saveAuditLog:', e.message));

  res.json({
    success: true,
    message: 'Consent granted successfully and synced with Firebase Firestore',
    consent: newConsent
  });
};

const revokeConsent = (req, res) => {
  const lookupId = req.params.id || req.body.serviceId || req.body.id;
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];

  const consent = store.consents.find(c => c.id === lookupId || c.serviceId === lookupId);
  if (!consent) {
    return res.status(404).json({ success: false, message: 'Consent record not found' });
  }

  consent.status = 'Revoked';
  consent.revokedAt = new Date();

  // Audit log
  store.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    timestamp: new Date(),
    userName: profile.fullName || 'Thanga Prabu N',
    userId,
    action: 'Consent Revoked',
    serviceName: consent.serviceName,
    dataAccessed: consent.requestedFields || consent.scopes,
    consentStatus: 'Revoked',
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    message: `Consent revoked for ${consent.serviceName}`,
    consent
  });
};

module.exports = { getConsents, grantConsent, revokeConsent };

