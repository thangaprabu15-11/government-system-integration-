const store = require('../utils/store');
const { getServiceConfig } = require('../config/serviceRegistry');
const { standardizeAndAggregate } = require('../integrations/standardizer');
const firebaseSync = require('../config/firebase');

// 1. Determine Required Data Availability & Reusable Data
const getRequiredDataStatus = (req, res) => {
  const { serviceId } = req.params;
  const userId = req.user ? req.user.id : store.users[0].id;
  const profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const config = getServiceConfig(serviceId);

  const availableFields = [];
  const missingFields = [];

  // Evaluate baseline profile against required profile keys
  (config.requiredProfileKeys || []).forEach(key => {
    let isAvail = profile[key] !== undefined && profile[key] !== null && profile[key] !== '';
    let val = isAvail ? profile[key] : null;

    if (key === 'aadhaar' || key === 'aadhaarMasked') {
      isAvail = true;
      val = 'XXXX XXXX 7142';
    }

    if (isAvail) {
      availableFields.push({ key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), value: val });
    } else {
      missingFields.push({ key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) });
    }
  });

  // Questions that must be answered
  (config.missingInformationQuestions || []).forEach(q => {
    missingFields.push({ key: q.key, label: q.label, type: q.type, helperText: q.helperText });
  });

  res.json({
    success: true,
    serviceId: config.serviceId,
    serviceName: config.serviceName,
    department: config.department,
    availableCount: availableFields.length,
    missingCount: missingFields.length,
    availableFields,
    missingFields,
    missingQuestions: config.missingInformationQuestions || [],
    consentScopes: config.consentScopes,
    consentPurpose: config.consentPurpose,
    citizenPreview: {
      fullName: profile.fullName || 'Thanga Prabu N',
      dateOfBirth: profile.dateOfBirthFormatted || '05/01/2007',
      collegeName: profile.collegeName || 'VSB Engineering College',
      address: profile.address || 'Thanthondrimalai, Karur',
      aadhaarMasked: 'XXXX XXXX 7142'
    }
  });
};

// 2. Prepare Auto-Fill Form Application
const prepareApplication = (req, res) => {
  const { serviceId, providedInputs } = req.body;
  const userId = req.user ? req.user.id : store.users[0].id;
  const user = store.users.find(u => u.id === userId) || store.users[0];
  let profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const config = getServiceConfig(serviceId);

  // Aggregate profile baseline and standardize into Common Data Model
  const commonModel = standardizeAndAggregate(profile, {
    systemA: { full_name: profile.fullName, mobile_number: profile.mobile, residential_address: profile.address },
    systemB: { candidateName: profile.fullName, verifiedAnnualIncome: profile.annualFamilyIncome, householdDistrict: profile.district },
    systemC: { applicant_name: profile.fullName, secondary_school_pct: profile.twelfthPercentage, parents_higher_edu_status: profile.parentEducation }
  });

  // Retrieve any previously verified/saved draft for this user & service
  const draftKey = `${userId}_${serviceId}`;
  const existingDraft = store.userRequirementsDrafts[draftKey] || null;

  // Construct service-specific auto-filled dataset
  const autoFilledForm = {
    fullName: profile.fullName || 'Thanga Prabu N',
    dateOfBirth: profile.dateOfBirthFormatted || '05/01/2007',
    collegeName: profile.collegeName || 'VSB Engineering College',
    address: profile.address || 'Thanthondrimalai, Karur',
    district: profile.district || 'Karur',
    state: profile.state || 'Tamil Nadu',
    aadhaarMasked: 'XXXX XXXX 7142',
    educationLevel: profile.educationLevel || '12th Standard',
    coursePreferred: profile.coursePreferred || 'B.E. Computer Science and Engineering',
    annualFamilyIncome: profile.annualFamilyIncome ? `₹ ${profile.annualFamilyIncome.toLocaleString('en-IN')}` : '₹ 1,80,000',
    parentEducation: profile.parentEducation || 'Non-Graduate (School-level 10th Standard)',
    community: profile.community || 'BC (Backward Class)',
    mobile: profile.mobile || '+91 98765 43210',
    ...(existingDraft?.verifiedInputs || {}),
    ...(providedInputs || {})
  };

  const availableInfoList = [
    { label: 'Name', value: autoFilledForm.fullName, source: 'Population Registry (System A)' },
    { label: 'Date of Birth', value: autoFilledForm.dateOfBirth, source: 'Identity Register (System A)' },
    { label: 'Enrolled Institution', value: autoFilledForm.collegeName, source: 'Higher Education API (System C)' },
    { label: 'Residential Address', value: autoFilledForm.address, source: 'Revenue Register (System B)' },
    { label: 'Aadhaar Reference', value: 'XXXX XXXX 7142', source: 'UIDAI Masked Vault' }
  ];

  const missingInfoList = (config.missingInformationQuestions || []).map(q => ({
    key: q.key,
    label: q.label,
    value: autoFilledForm[q.key] || q.defaultValue || 'Provided by Citizen',
    source: 'Citizen Requirement Input'
  }));

  res.json({
    success: true,
    service: config,
    commonModel,
    autoFilledForm,
    rawProfile: profile,
    availableInfoList,
    missingInfoList,
    autoFillSections: config.autoFillSections,
    consentScopes: config.consentScopes,
    consentPurpose: config.consentPurpose
  });
};

// 3. User Confirm & Submit Application to Mock Government API
const submitApplication = async (req, res) => {
  const { serviceId, applicantData, connectorUsed } = req.body;
  const userId = req.user ? req.user.id : store.users[0].id;
  const user = store.users.find(u => u.id === userId) || store.users[0];
  let profile = store.profiles.find(p => p.userId === userId) || store.profiles[0];
  const config = getServiceConfig(serviceId);

  const prefix = config.applicationPrefix || 'CIV-2026';
  const newAppId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
  const currentExactDate = new Date().toISOString();

  const finalApplicantData = applicantData || {
    fullName: user.name || profile.fullName || 'Thanga Prabu N',
    dateOfBirth: profile.dateOfBirthFormatted || '05/01/2007',
    collegeName: profile.collegeName || 'VSB Engineering College',
    address: profile.address || 'Thanthondrimalai, Karur',
    aadhaarMasked: 'XXXX XXXX 7142'
  };

  // Extract service-specific data used labels
  const dataUsedLabels = (config.consentScopes || []).map(s => s.label);
  if (dataUsedLabels.length === 0) {
    dataUsedLabels.push('Candidate Profile', 'Institution Information', 'Aadhaar Reference');
  }

  const newApplication = {
    id: `app_${Date.now()}`,
    applicationId: newAppId,
    userId,
    serviceId: config.serviceId,
    serviceName: config.serviceName,
    department: config.department,
    category: config.category,
    appliedDate: currentExactDate,
    status: 'Submitted / Under Review',
    consentStatus: 'Granted',
    dataUsed: dataUsedLabels,
    applicantData: finalApplicantData,
    statusHistory: [
      { status: 'Requirements Checked', timestamp: new Date(Date.now() - 480000).toISOString(), notes: `Verified citizen profile against ${config.serviceName} rules.` },
      { status: 'Missing Information Completed', timestamp: new Date(Date.now() - 420000).toISOString(), notes: 'Citizen provided required service-specific pending fields.' },
      { status: 'Consent Granted', timestamp: new Date(Date.now() - 360000).toISOString(), notes: `Authorized data scopes: ${dataUsedLabels.join(', ')}.` },
      { status: 'Data Retrieved', timestamp: new Date(Date.now() - 300000).toISOString(), notes: 'Retrieved standardized records via Mock Government APIs.' },
      { status: 'Data Standardized', timestamp: new Date(Date.now() - 240000).toISOString(), notes: 'Records transformed into Common Citizen Data Model.' },
      { status: 'Application Auto-Filled', timestamp: new Date(Date.now() - 180000).toISOString(), notes: 'Mapped normalized data fields into target department application form.' },
      { status: 'Citizen Reviewed', timestamp: new Date(Date.now() - 60000).toISOString(), notes: 'Citizen reviewed and confirmed application details.' },
      { status: 'Application Submitted', timestamp: new Date().toISOString(), notes: `Payload successfully dispatched to ${config.department} API.` },
      { status: 'Under Review', timestamp: new Date().toISOString(), notes: 'Application placed in department verification queue.' }
    ],
    connectorUsed: connectorUsed || config.apiConnector || 'EducationConnector',
    mockApiResponse: {
      ackId: `ACK-${config.serviceId.replace('SRV-', '')}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'RECEIVED_UNDER_REVIEW',
      queuePosition: Math.floor(Math.random() * 10 + 1),
      dispatchedTimestamp: currentExactDate
    }
  };

  store.applications.unshift(newApplication);

  // Audit log
  const auditEntry = {
    id: `aud_${Date.now()}`,
    timestamp: new Date(),
    userName: user.name || profile.fullName || 'Thanga Prabu N',
    userId,
    action: 'Application Submitted',
    serviceName: newApplication.serviceName,
    dataAccessed: Object.keys(newApplication.applicantData),
    consentStatus: 'Granted',
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1'
  };
  store.auditLogs.unshift(auditEntry);

  // 🔥 Non-blocking background sync to Firebase Firestore (brototype-79697)
  firebaseSync.saveApplication(newApplication).catch(e => console.warn('Firebase saveApplication:', e.message));
  firebaseSync.saveAuditLog(auditEntry).catch(e => console.warn('Firebase saveAuditLog:', e.message));

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully to Mock Government API and synced with Firebase Firestore',
    applicationId: newAppId,
    application: newApplication,
    mockResponse: newApplication.mockApiResponse
  });
};

// 4. Get User Applications List
const getUserApplications = (req, res) => {
  const userId = req.user ? req.user.id : store.users[0].id;
  const apps = store.applications.filter(a => a.userId === userId || a.userId === 'user_citizen_001');

  res.json({
    success: true,
    count: apps.length,
    applications: apps
  });
};

// 5. Get Application Details by ID
const getApplicationById = (req, res) => {
  const app = store.applications.find(a => a.applicationId === req.params.id || a.id === req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  res.json({
    success: true,
    application: app
  });
};

module.exports = {
  getRequiredDataStatus,
  prepareApplication,
  submitApplication,
  getUserApplications,
  getApplicationById
};
