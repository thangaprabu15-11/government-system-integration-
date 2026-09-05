const store = require('../utils/store');
const { getServiceConfig } = require('../config/serviceRegistry');
const { evaluateServiceEligibility, recommendEligibleServices } = require('../services/eligibilityEngine');
const firebaseSync = require('../config/firebase');

const checkEligibility = async (req, res) => {
  const serviceId = req.params.serviceId || req.body.serviceId;
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const docs = store.documents.filter(d => d.userId === userId || d.userId === 'user_citizen_001');
  
  // Retrieve any previously verified/saved draft for this user & service
  const draftKey = `${userId}_${serviceId}`;
  const existingDraft = store.userRequirementsDrafts[draftKey] || null;

  const requestInputs = req.body.providedInputs || (req.query.providedInputs ? (typeof req.query.providedInputs === 'string' ? JSON.parse(req.query.providedInputs) : req.query.providedInputs) : null);

  // Combine draft inputs with any newly provided inputs
  const effectiveInputs = {
    ...(existingDraft?.verifiedInputs || {}),
    ...(requestInputs || {})
  };

  const service = store.services.find(s => s.serviceId === serviceId || s.id === serviceId);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  const result = evaluateServiceEligibility(service, profile, docs, effectiveInputs);

  // If there's an existing verified draft, preserve verified status
  if (existingDraft?.requirementsVerified) {
    result.requirementsVerified = true;
    result.requirementsStatus = 'VERIFIED';
    result.eligibilityStatus = 'VERIFIED';
  }

  // Audit log
  const auditEntry = {
    id: `aud_${Date.now()}`,
    timestamp: new Date(),
    userName: profile.fullName || 'Thanga Prabu N',
    userId,
    action: 'Service Eligibility Evaluated',
    serviceName: service.serviceName,
    dataAccessed: ['Identity Register', 'Higher Education EMIS'],
    consentStatus: 'Rule Evaluated',
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1'
  };
  store.auditLogs.unshift(auditEntry);

  // Sync to Firebase in background
  firebaseSync.saveAuditLog(auditEntry).catch(() => {});
  firebaseSync.saveEligibilityCheck({
    userId,
    userName: profile.fullName,
    serviceId,
    serviceName: service.serviceName,
    eligible: result.eligible || result.isEligible,
    status: result.eligibilityStatus,
    missingFields: result.missingFields || []
  }).catch(() => {});

  res.json({
    success: true,
    evaluation: result,
    persistedDraft: existingDraft
  });
};

/**
 * Explicit Service Requirements Verification Endpoint
 * Validates submitted missing fields and sets requirementsVerified = true permanently in session store
 */
const verifyRequirements = (req, res) => {
  const serviceId = req.params.serviceId || req.body.serviceId;
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const docs = store.documents.filter(d => d.userId === userId || d.userId === 'user_citizen_001');
  const providedInputs = req.body.providedInputs || {};

  const config = getServiceConfig(serviceId);
  if (!config) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  // Validation
  const errors = {};
  const missingFields = [];
  const invalidFields = [];

  (config.missingInformationQuestions || []).forEach(q => {
    const val = providedInputs[q.key];
    if (q.required && (val === undefined || val === null || String(val).trim() === '')) {
      errors[q.key] = `${q.label} is required.`;
      missingFields.push(q.label);
    } else if (q.type === 'number' && val !== undefined && val !== '') {
      const num = Number(val);
      if (isNaN(num)) {
        errors[q.key] = `${q.label} must be a valid number.`;
        invalidFields.push(q.label);
      } else if (q.min !== undefined && num < q.min) {
        errors[q.key] = `${q.label} must be at least ${q.min}.`;
        invalidFields.push(q.label);
      } else if (q.max !== undefined && num > q.max) {
        errors[q.key] = `${q.label} cannot exceed ${q.max}.`;
        invalidFields.push(q.label);
      }
    }
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      requirementsStatus: 'INVALID',
      requirementsVerified: false,
      errors,
      missingFields,
      invalidFields,
      message: 'Verification incomplete: Some required fields are missing or invalid.'
    });
  }

  // Success: Persist verified requirements permanently in backend store
  const draftKey = `${userId}_${serviceId}`;
  store.userRequirementsDrafts[draftKey] = {
    serviceId,
    userId,
    requirementsStatus: 'VERIFIED',
    requirementsVerified: true,
    verifiedInputs: providedInputs,
    verifiedAt: new Date().toISOString()
  };

  const evalResult = evaluateServiceEligibility(config, profile, docs, providedInputs);
  evalResult.requirementsStatus = 'VERIFIED';
  evalResult.requirementsVerified = true;
  evalResult.eligibilityStatus = 'VERIFIED';

  res.json({
    success: true,
    requirementsStatus: 'VERIFIED',
    requirementsVerified: true,
    message: 'All required information has been successfully verified.',
    evaluation: evalResult
  });
};

const getRecommendations = (req, res) => {
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const docs = store.documents.filter(d => d.userId === userId || d.userId === 'user_citizen_001');

  const recommendations = recommendEligibleServices(profile, docs);

  res.json({
    success: true,
    recommendations
  });
};

module.exports = {
  checkEligibility,
  verifyRequirements,
  getRecommendations
};
