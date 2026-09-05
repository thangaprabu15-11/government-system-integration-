const store = require('../utils/store');
const { processNaturalLanguageIntent } = require('../ai/intentEngine');
const { recommendEligibleServices } = require('../services/eligibilityEngine');

const understandIntent = async (req, res) => {
  const { query } = req.body;
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const docs = store.documents.filter(d => d.userId === userId || d.userId === 'user_citizen_001');

  if (!query) {
    return res.status(400).json({ success: false, message: 'Please provide a natural language query' });
  }

  const result = await processNaturalLanguageIntent(query, profile, docs);

  // Audit log
  store.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    timestamp: new Date(),
    userName: profile.fullName || 'Ravi Kumar',
    userId,
    action: 'AI Service Discovery Intent',
    serviceName: 'CivicBridge AI Intent Assistant',
    dataAccessed: [query],
    consentStatus: 'System Internal',
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    result
  });
};

const recommendServices = (req, res) => {
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const docs = store.documents.filter(d => d.userId === userId || d.userId === 'user_citizen_001');

  const recommendations = recommendEligibleServices(profile, docs);

  res.json({
    success: true,
    recommendations
  });
};

module.exports = { understandIntent, recommendServices };
