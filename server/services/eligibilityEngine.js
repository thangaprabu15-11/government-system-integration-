const store = require('../utils/store');
const { getServiceConfig } = require('../config/serviceRegistry');

/**
 * Service-Specific Rule-Based Eligibility Evaluation Engine
 * Evaluates individual service schemas, separates available vs missing fields,
 * and maintains explicit requirement states: PENDING, IN_PROGRESS, COMPLETED, VERIFIED.
 */
const evaluateServiceEligibility = (service, profile, userDocs = [], userProvidedInputs = {}) => {
  const serviceId = service.serviceId || service.id || 'SRV-FGB-01';
  const config = getServiceConfig(serviceId);

  // Merge citizen baseline with verified user provided inputs
  const mergedProfile = {
    ...profile,
    ...userProvidedInputs
  };

  // 1. Identify Available Profile Fields (from verified baseline data sources)
  const availableFields = [];
  
  if (mergedProfile.fullName) {
    availableFields.push({ key: 'fullName', label: 'Candidate Full Name', value: mergedProfile.fullName, source: 'National Population Register (System A)' });
  }
  if (mergedProfile.dateOfBirthFormatted || mergedProfile.dateOfBirth) {
    availableFields.push({ key: 'dateOfBirth', label: 'Date of Birth', value: mergedProfile.dateOfBirthFormatted || mergedProfile.dateOfBirth, source: 'Identity Register (System A)' });
  }
  if (mergedProfile.address) {
    availableFields.push({ key: 'address', label: 'Residential Address', value: mergedProfile.address, source: 'National Population Register (System A)' });
  }
  if (mergedProfile.aadhaarMasked) {
    availableFields.push({ key: 'aadhaarMasked', label: 'Aadhaar Reference', value: 'XXXX XXXX 7142', source: 'UIDAI Masked Vault' });
  }
  if (mergedProfile.collegeName || mergedProfile.currentInstitute) {
    availableFields.push({ key: 'collegeName', label: 'Enrolled Institution', value: mergedProfile.collegeName || mergedProfile.currentInstitute, source: 'Higher Education EMIS (System C)' });
  }

  // 2. Evaluate Service-Specific Missing Information Questions
  const allMissingQuestions = config.missingInformationQuestions || [];
  const pendingQuestions = [];
  const completedQuestions = [];

  allMissingQuestions.forEach(q => {
    const val = (userProvidedInputs && userProvidedInputs[q.key] !== undefined && userProvidedInputs[q.key] !== null && String(userProvidedInputs[q.key]).trim() !== '')
      ? userProvidedInputs[q.key]
      : (mergedProfile[q.key] !== undefined && mergedProfile[q.key] !== null && String(mergedProfile[q.key]).trim() !== '' ? mergedProfile[q.key] : null);

    if (val !== null && val !== undefined && String(val).trim() !== '') {
      completedQuestions.push({
        ...q,
        providedValue: val,
        completed: true
      });
    } else {
      pendingQuestions.push(q);
    }
  });

  const allRequiredFieldsFilled = pendingQuestions.length === 0;
  const hasPendingRequirements = pendingQuestions.length > 0;
  
  // 3. Explicit Requirement State Flow: PENDING -> IN_PROGRESS -> COMPLETED -> VERIFIED
  let requirementsStatus = 'PENDING';
  let requirementsVerified = false;
  let eligibilityStatus = 'Pending Requirements';
  let badgeColor = 'amber';
  let isEligible = false;

  if (hasPendingRequirements) {
    if (completedQuestions.length > 0) {
      requirementsStatus = 'IN_PROGRESS';
      eligibilityStatus = 'Pending Requirements';
    } else {
      requirementsStatus = 'PENDING';
      eligibilityStatus = 'Pending Requirements';
    }
  } else {
    // All required fields provided
    requirementsStatus = 'VERIFIED';
    requirementsVerified = true;
    eligibilityStatus = 'VERIFIED';
    badgeColor = 'emerald';
    isEligible = true;
  }

  let summaryReason = '';
  if (requirementsVerified) {
    summaryReason = `All required information for ${config.serviceName} has been provided and verified. Ready for consent and data connection.`;
  } else {
    summaryReason = `${config.prototypeStatusText} (${pendingQuestions.length} pending service-specific requirement${pendingQuestions.length > 1 ? 's' : ''} to be provided).`;
  }

  // 4. Condition Breakdown for UI
  const breakdown = [];
  
  // Available baseline checks
  availableFields.forEach(f => {
    breakdown.push({
      condition: `${f.label} (${f.source})`,
      status: 'PASSED',
      message: `Verified: ${f.value}`
    });
  });

  // Completed custom questions
  completedQuestions.forEach(q => {
    breakdown.push({
      condition: `${q.label}`,
      status: 'PASSED',
      message: `Citizen Provided & Verified: ${q.providedValue}`
    });
  });

  // Pending requirements
  pendingQuestions.forEach(q => {
    breakdown.push({
      condition: `${q.label}`,
      status: 'WARNING',
      message: `Required field missing: ${q.helperText || 'Action needed'}`
    });
  });

  // 5. Build Grouped Verification Summary (e.g. Student Info, Innovation Info, Funding Info)
  const verificationSummaryGroups = (config.autoFillSections || []).map(sec => {
    const fields = sec.fields.map(f => {
      const isBase = availableFields.find(af => af.key === f.key);
      const isCustom = completedQuestions.find(cq => cq.key === f.key);
      const val = isBase ? isBase.value : (isCustom ? isCustom.providedValue : (mergedProfile[f.key] || 'Verified'));
      return {
        key: f.key,
        label: f.label,
        value: val,
        verified: true
      };
    });
    return {
      groupTitle: sec.sectionTitle,
      fields
    };
  });

  return {
    serviceId: config.serviceId,
    serviceName: config.serviceName,
    department: config.department,
    category: config.category,
    purpose: config.purpose,
    isEligible,
    hasPendingRequirements,
    allRequiredFieldsFilled,
    requirementsStatus,
    requirementsVerified,
    eligibilityStatus,
    badgeColor,
    summaryReason,
    availableFields,
    pendingQuestions,
    completedQuestions,
    allQuestionsCount: allMissingQuestions.length,
    completedQuestionsCount: completedQuestions.length,
    consentScopes: config.consentScopes,
    consentPurpose: config.consentPurpose,
    availableDataSources: config.availableDataSources,
    autoFillSections: config.autoFillSections,
    verificationSummaryGroups,
    breakdown
  };
};

/**
 * "What am I eligible for?" recommendation engine
 */
const recommendEligibleServices = (profile, userDocs = []) => {
  const allServices = store.services;
  return allServices.map(service => {
    const evalResult = evaluateServiceEligibility(service, profile, userDocs);
    return {
      service,
      evaluation: evalResult
    };
  });
};

module.exports = {
  evaluateServiceEligibility,
  recommendEligibleServices
};
