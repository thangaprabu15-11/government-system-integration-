const express = require('express');
const router = express.Router();
const store = require('../utils/store');

// Helper to log API request metrics for admin dashboard
const logApiRequest = (service, connector, endpoint, method, status, responseTimeMs, isSuccess = true, errorMessage = null) => {
  const newLog = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: new Date(),
    service,
    connector,
    endpoint,
    method,
    status,
    responseTimeMs,
    isSuccess,
    errorMessage
  };
  store.apiLogs.unshift(newLog);
  // Keep last 100 logs
  if (store.apiLogs.length > 100) store.apiLogs.pop();
  return newLog;
};

// 1. Citizen Data API (Simulating National/State Population Register System A)
// Uses format: { full_name, date_of_birth, mobile_number, residential_address }
router.get('/citizen/:id', (req, res) => {
  const startTime = Date.now();
  const citizen = store.profiles.find(p => p.mobile === req.params.id || p.userId === req.params.id) || store.profiles[0];
  
  const responseData = {
    system_origin: 'MOCK_GOV_CITIZEN_REGISTRY_SYS_A',
    citizen_uid: 'UID-90218842',
    full_name: citizen.fullName,
    date_of_birth: citizen.dateOfBirth,
    mobile_number: citizen.mobile,
    email_id: citizen.email,
    residential_address: citizen.address,
    district_code: citizen.district,
    state_code: citizen.state
  };

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 150 + 100);
  logApiRequest('Citizen Registry API (System A)', 'CitizenConnector', `/mock-api/citizen/${req.params.id}`, 'GET', 200, responseTime);

  res.json({
    success: true,
    data: responseData,
    meta: { responseTimeMs: responseTime, schema: 'SystemA_v1' }
  });
});

// 2. Revenue Income API (Simulating Revenue Department System B)
// Uses format: { candidateName, dateOfBirth, verifiedAnnualIncome, householdDistrict }
router.get('/income/:id', (req, res) => {
  const startTime = Date.now();
  const citizen = store.profiles.find(p => p.mobile === req.params.id || p.userId === req.params.id) || store.profiles[0];

  const responseData = {
    system_origin: 'MOCK_REVENUE_INCOME_PORTAL_SYS_B',
    incomeCertNo: 'INC-2026-88192',
    candidateName: citizen.fullName,
    dateOfBirth: citizen.dateOfBirth,
    fatherName: citizen.fatherName,
    verifiedAnnualIncome: citizen.annualFamilyIncome,
    householdDistrict: citizen.district,
    issuingAuthority: 'Tahsildar, Revenue Department',
    validUntil: '2027-06-30'
  };

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 200 + 120);
  logApiRequest('Revenue Income API (System B)', 'IncomeConnector', `/mock-api/income/${req.params.id}`, 'GET', 200, responseTime);

  res.json({
    success: true,
    data: responseData,
    meta: { responseTimeMs: responseTime, schema: 'SystemB_v2' }
  });
});

// 3. Education Department API (Simulating Higher Education System C)
// Uses format: { applicant_name, dob, secondary_school_pct, college_enrolled, parents_higher_edu_status }
router.get('/education/:id', (req, res) => {
  const startTime = Date.now();
  const citizen = store.profiles.find(p => p.mobile === req.params.id || p.userId === req.params.id) || store.profiles[0];

  const responseData = {
    system_origin: 'MOCK_DO_HIGHER_EDUCATION_SYS_C',
    emis_student_id: 'EMIS-10928374',
    applicant_name: citizen.fullName,
    dob: citizen.dateOfBirth,
    secondary_school_pct: citizen.twelfthPercentage,
    college_enrolled: citizen.collegeName,
    preferred_course: citizen.coursePreferred,
    parents_higher_edu_status: citizen.parentEducation,
    first_gen_graduate_eligible_flag: citizen.isFirstGenerationGraduateCandidate ? 'YES' : 'NO'
  };

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 180 + 90);
  logApiRequest('Higher Education API (System C)', 'EducationConnector', `/mock-api/education/${req.params.id}`, 'GET', 200, responseTime);

  res.json({
    success: true,
    data: responseData,
    meta: { responseTimeMs: responseTime, schema: 'SystemC_v1' }
  });
});

// 4. Caste & Community Certificate API
router.get('/certificate/:id', (req, res) => {
  const startTime = Date.now();
  const citizen = store.profiles.find(p => p.mobile === req.params.id || p.userId === req.params.id) || store.profiles[0];

  const responseData = {
    system_origin: 'MOCK_CASTE_COMMUNITY_REGISTRY',
    certificateNumber: 'COM-2026-11029',
    applicantName: citizen.fullName,
    casteCommunityGroup: citizen.community,
    issuedDistrict: citizen.district,
    status: 'ACTIVE_VALIDATED'
  };

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 140 + 80);
  logApiRequest('Community Certificate API', 'CertificateConnector', `/mock-api/certificate/${req.params.id}`, 'GET', 200, responseTime);

  res.json({
    success: true,
    data: responseData,
    meta: { responseTimeMs: responseTime, schema: 'CasteRegistry_v1' }
  });
});

// 5. Engineering Counselling Application Submission API
router.post('/counselling/apply', (req, res) => {
  const startTime = Date.now();
  const payload = req.body;
  const ackId = `ACK-COUN-${Math.floor(10000 + Math.random() * 90000)}`;

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 250 + 150);
  logApiRequest('Engineering Counselling API', 'CounsellingConnector', '/mock-api/counselling/apply', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Application registered with State Engineering Admissions System',
    ackId,
    cutoffMarks: (payload.twelfthPercentage ? payload.twelfthPercentage * 2 : 180).toFixed(1),
    timestamp: new Date()
  });
});

// 6. Post-Matric Scholarship Submission API
router.post('/scholarship/apply', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-SCH-${Math.floor(10000 + Math.random() * 90000)}`;

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 300 + 100);
  logApiRequest('Post-Matric Scholarship API', 'ScholarshipConnector', '/mock-api/scholarship/apply', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Scholarship application received and forwarded to District Welfare Officer',
    ackId,
    disbursementStatus: 'PROVISIONAL_ELIGIBLE',
    timestamp: new Date()
  });
});

// 7. General Certificate Application Submission API
router.post('/certificate/apply', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-CERT-${Math.floor(10000 + Math.random() * 90000)}`;

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 220 + 120);
  logApiRequest('Certificate Portal API', 'CertificateConnector', '/mock-api/certificate/apply', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Certificate application dispatched to Revenue E-Sevai Queue',
    ackId,
    estimatedIssueDays: 3,
    timestamp: new Date()
  });
});

// 8. Nativity & Domicile Verification API
router.post('/revenue/nativity-verify', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-NAT-${Math.floor(10000 + Math.random() * 90000)}`;
  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 150 + 100);
  logApiRequest('Revenue Nativity API', 'RevenueConnector', '/mock-api/revenue/nativity-verify', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Nativity / Domicile application verified by Revenue Authority',
    ackId,
    domicileStatus: 'AUTHENTICATED_STATE_RESIDENT',
    timestamp: new Date()
  });
});

// 9. Employment & Skill Enrollment API
router.post('/employment/skill-enroll', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-SKL-${Math.floor(10000 + Math.random() * 90000)}`;
  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 160 + 110);
  logApiRequest('Employment & Skilling API', 'EmploymentConnector', '/mock-api/employment/skill-enroll', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Enrolled in Naan Mudhalvan / Skill India Industry 4.0 Course Track',
    ackId,
    courseTrack: 'AI & Full-Stack Cloud Engineering',
    voucherStatus: 'SUBSIDY_APPROVED_100%',
    timestamp: new Date()
  });
});

// 10. CMCHIS / Ayushman Health Insurance Enrollment API
router.post('/health/cmchis-enroll', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-HLT-${Math.floor(10000 + Math.random() * 90000)}`;
  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 200 + 120);
  logApiRequest('Health Insurance API', 'HealthConnector', '/mock-api/health/cmchis-enroll', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Health Insurance card linked with Smart Ration Card',
    ackId,
    sumAssured: '₹ 5,00,000 / family / year',
    coverageStatus: 'ACTIVE_CASHLESS',
    timestamp: new Date()
  });
});

// 11. Agriculture & Farmer Subsidy API
router.post('/agriculture/subsidy-apply', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-AGR-${Math.floor(10000 + Math.random() * 90000)}`;
  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 180 + 130);
  logApiRequest('Agriculture Portal API', 'AgricultureConnector', '/mock-api/agriculture/subsidy-apply', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Agricultural Input Subsidy application queued for Tahsildar approval',
    ackId,
    pmKisanLinked: true,
    timestamp: new Date()
  });
});

// 12. MSME Startup Seed Grant API
router.post('/msme/startup-grant', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-ENT-${Math.floor(10000 + Math.random() * 90000)}`;
  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 220 + 140);
  logApiRequest('MSME Startup API', 'MSMEConnector', '/mock-api/msme/startup-grant', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'Startup Seed Fund application registered with EDII Incubation Portal',
    ackId,
    seedTier: 'Tier 1 Student Prototype Grant (Up to ₹10 Lakhs)',
    timestamp: new Date()
  });
});

// 13. Housing PMAY Scheme API
router.post('/housing/pmay-apply', (req, res) => {
  const startTime = Date.now();
  const ackId = `ACK-HOU-${Math.floor(10000 + Math.random() * 90000)}`;
  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 240 + 150);
  logApiRequest('Housing Portal API', 'HousingConnector', '/mock-api/housing/pmay-apply', 'POST', 200, responseTime);

  res.json({
    success: true,
    message: 'PMAY Housing Subsidy application recorded and queued for verification',
    ackId,
    entitlementCategory: 'EWS Housing Subsidy',
    timestamp: new Date()
  });
});

// 14. Application Status Tracking Query API
router.get('/application/:id', (req, res) => {
  const startTime = Date.now();
  const app = store.applications.find(a => a.applicationId === req.params.id || a.id === req.params.id);

  const responseTime = Date.now() - startTime + Math.floor(Math.random() * 100 + 50);

  if (!app) {
    logApiRequest('Unified Application Tracking API', 'TrackingConnector', `/mock-api/application/${req.params.id}`, 'GET', 404, responseTime, false, 'Application ID not found');
    return res.status(404).json({ success: false, message: 'Application not found in mock government registry' });
  }

  logApiRequest('Unified Application Tracking API', 'TrackingConnector', `/mock-api/application/${req.params.id}`, 'GET', 200, responseTime);

  res.json({
    success: true,
    data: {
      applicationId: app.applicationId,
      serviceName: app.serviceName,
      department: app.department,
      status: app.status,
      appliedDate: app.appliedDate,
      connectorUsed: app.connectorUsed,
      mockApiResponse: app.mockApiResponse
    }
  });
});

module.exports = router;
