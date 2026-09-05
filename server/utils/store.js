const bcrypt = require('bcryptjs');
const { getAllServicesList } = require('../config/serviceRegistry');

// Pre-hashed passwords for demo speed ('Demo@123' and 'Admin@123')
const hashPassword = (password) => bcrypt.hashSync(password, 10);

const demoCitizenId = 'user_citizen_001';
const demoAdminId = 'user_admin_001';

const store = {
  users: [
    {
      id: demoCitizenId,
      name: 'Thanga Prabu N',
      email: 'demo@civicbridge.ai',
      password: hashPassword('Demo@123'),
      role: 'citizen',
      createdAt: new Date('2026-01-15T10:00:00Z')
    },
    {
      id: demoAdminId,
      name: 'System Administrator',
      email: 'admin@civicbridge.ai',
      password: hashPassword('Admin@123'),
      role: 'admin',
      createdAt: new Date('2026-01-01T08:00:00Z')
    }
  ],

  profiles: [
    {
      userId: demoCitizenId,
      fullName: 'Thanga Prabu N',
      dateOfBirth: '2007-01-05',
      dateOfBirthFormatted: '05/01/2007',
      gender: 'Male',
      mobile: '+91 98765 43210',
      email: 'demo@civicbridge.ai',
      address: 'Thanthondrimalai, Karur',
      district: 'Karur',
      state: 'Tamil Nadu',
      pincode: '639005',
      educationLevel: '12th Standard',
      twelfthPercentage: 89.5,
      cutoffMark: 185.0,
      currentInstitute: 'VSB Engineering College',
      collegeName: 'VSB Engineering College',
      coursePreferred: 'B.E. Computer Science and Engineering',
      fatherName: 'Natarajan',
      motherName: 'Lakshmi N',
      parentEducation: 'Non-Graduate (School-level 10th Standard)',
      isFirstGenerationGraduateCandidate: true,
      annualFamilyIncome: 180000,
      community: 'BC (Backward Class)',
      aadhaarMasked: 'XXXX XXXX 7142',
      aadhaarLast4: '7142',
      panNumber: 'ABCDE1234F',
      rationCardNo: '33/08/1234567',
      completionPercentage: 94,
      updatedAt: new Date('2026-09-02T08:00:00Z')
    }
  ],

  services: getAllServicesList(),

  documents: [
    {
      id: 'doc_101',
      userId: demoCitizenId,
      documentName: '10th Marksheet',
      documentType: 'Academic',
      fileName: '10th_marksheet_thanga_prabu.pdf',
      fileSize: '1.2 MB',
      uploadedDate: '2026-02-10',
      verificationStatus: 'Verified',
      issuer: 'State Board of School Examinations'
    },
    {
      id: 'doc_102',
      userId: demoCitizenId,
      documentName: '12th Marksheet',
      documentType: 'Academic',
      fileName: '12th_marksheet_thanga_prabu.pdf',
      fileSize: '1.4 MB',
      uploadedDate: '2026-06-15',
      verificationStatus: 'Verified',
      issuer: 'State Board of Higher Secondary Education'
    },
    {
      id: 'doc_103',
      userId: demoCitizenId,
      documentName: 'Income Certificate',
      documentType: 'Government Certificate',
      fileName: 'income_certificate_2026.pdf',
      fileSize: '850 KB',
      uploadedDate: '2026-07-01',
      verificationStatus: 'Verified',
      issuer: 'Revenue Department (Tahsil Office, Karur)'
    },
    {
      id: 'doc_104',
      userId: demoCitizenId,
      documentName: 'Community Certificate',
      documentType: 'Government Certificate',
      fileName: 'community_cert_karur.pdf',
      fileSize: '920 KB',
      uploadedDate: '2026-05-20',
      verificationStatus: 'Verified',
      issuer: 'Revenue Department'
    },
    {
      id: 'doc_105',
      userId: demoCitizenId,
      documentName: 'Transfer Certificate',
      documentType: 'Academic',
      fileName: 'transfer_certificate.pdf',
      fileSize: '640 KB',
      uploadedDate: '2026-06-18',
      verificationStatus: 'Verified',
      issuer: 'VSB Higher Secondary School'
    },
    {
      id: 'doc_106',
      userId: demoCitizenId,
      documentName: 'Parent Education Affidavit',
      documentType: 'Declaration',
      fileName: 'first_gen_affidavit.pdf',
      fileSize: '510 KB',
      uploadedDate: '2026-07-10',
      verificationStatus: 'Verified',
      issuer: 'Notary Public'
    }
  ],

  applications: [
    {
      id: 'app_001',
      applicationId: 'CIV-FGB-2026-001',
      userId: demoCitizenId,
      serviceId: 'SRV-FGB-01',
      serviceName: 'First-Generation Graduate Benefit',
      department: 'Department of Higher Education',
      appliedDate: '2026-09-02T08:30:00Z',
      status: 'Under Review',
      consentStatus: 'Granted',
      dataUsed: ['Name', 'Date of Birth', 'Institution', 'Address', 'Aadhaar Reference'],
      applicantData: {
        fullName: 'Thanga Prabu N',
        dateOfBirth: '05/01/2007',
        collegeName: 'VSB Engineering College',
        address: 'Thanthondrimalai, Karur',
        aadhaarMasked: 'XXXX XXXX 7142',
        educationLevel: '12th Standard',
        parentEducation: 'Non-Graduate (School-level 10th Standard)',
        annualFamilyIncome: 180000
      },
      statusHistory: [
        { status: 'Application Started', timestamp: '2026-09-02T08:20:00Z', notes: 'Citizen initiated First-Generation Graduate Benefit discovery via AI assistant.' },
        { status: 'Consent Granted', timestamp: '2026-09-02T08:22:00Z', notes: 'Citizen authorized read access for Education, Income, and Address records.' },
        { status: 'Data Retrieved', timestamp: '2026-09-02T08:24:00Z', notes: 'Fetched standardized records from Higher Education & Revenue APIs.' },
        { status: 'Application Auto-Filled', timestamp: '2026-09-02T08:25:00Z', notes: 'Form fields auto-populated using Common Citizen Data Model.' },
        { status: 'Citizen Confirmed', timestamp: '2026-09-02T08:28:00Z', notes: 'Citizen reviewed and confirmed application details.' },
        { status: 'Application Submitted', timestamp: '2026-09-02T08:30:00Z', notes: 'Payload dispatched to Department of Higher Education API.' },
        { status: 'Under Review', timestamp: '2026-09-02T08:35:00Z', notes: 'Application is currently under review by Department Officials.' }
      ],
      connectorUsed: 'EducationConnector',
      mockApiResponse: {
        ackId: 'ACK-EDU-882910',
        status: 'UNDER_REVIEW',
        queuePosition: 3
      }
    },
    {
      id: 'app_002',
      applicationId: 'CIV-TEC-2026-002',
      userId: demoCitizenId,
      serviceId: 'SRV-ENG-02',
      serviceName: 'Engineering Counselling',
      department: 'Directorate of Technical Education (DoTE)',
      appliedDate: '2026-09-01T10:15:00Z',
      status: 'Submitted',
      consentStatus: 'Granted',
      dataUsed: ['Name', 'Date of Birth', 'Institution', 'Address', 'HSC Marks'],
      applicantData: {
        fullName: 'Thanga Prabu N',
        dateOfBirth: '05/01/2007',
        collegeName: 'VSB Engineering College',
        address: 'Thanthondrimalai, Karur',
        aadhaarMasked: 'XXXX XXXX 7142',
        twelfthPercentage: 89.5,
        community: 'BC (Backward Class)'
      },
      statusHistory: [
        { status: 'Application Started', timestamp: '2026-09-01T10:00:00Z', notes: 'Application started' },
        { status: 'Consent Granted', timestamp: '2026-09-01T10:05:00Z', notes: 'Consent granted for counselling data exchange' },
        { status: 'Data Retrieved', timestamp: '2026-09-01T10:08:00Z', notes: 'Retrieved 12th marksheet metrics from TNEA system' },
        { status: 'Application Auto-Filled', timestamp: '2026-09-01T10:10:00Z', notes: 'Standardized details auto-filled' },
        { status: 'Citizen Confirmed', timestamp: '2026-09-01T10:12:00Z', notes: 'Citizen confirmed registration details' },
        { status: 'Application Submitted', timestamp: '2026-09-01T10:15:00Z', notes: 'Transmitted to DoTE Counselling seat allocation pool' }
      ],
      connectorUsed: 'CounsellingConnector',
      mockApiResponse: {
        ackId: 'ACK-COUN-44912',
        status: 'SUBMITTED',
        cutoffMarks: 185.0
      }
    },
    {
      id: 'app_003',
      applicationId: 'CIV-SCH-2026-003',
      userId: demoCitizenId,
      serviceId: 'SRV-SCH-03',
      serviceName: 'Student Scholarship',
      department: 'Department of Backward Classes & Minority Welfare',
      appliedDate: '2026-08-28T14:20:00Z',
      status: 'Approved',
      consentStatus: 'Granted',
      dataUsed: ['Name', 'Date of Birth', 'Institution', 'Address', 'Income Details'],
      applicantData: {
        fullName: 'Thanga Prabu N',
        dateOfBirth: '05/01/2007',
        collegeName: 'VSB Engineering College',
        address: 'Thanthondrimalai, Karur',
        annualFamilyIncome: 180000,
        community: 'BC'
      },
      statusHistory: [
        { status: 'Application Started', timestamp: '2026-08-28T14:00:00Z', notes: 'Application started' },
        { status: 'Consent Granted', timestamp: '2026-08-28T14:05:00Z', notes: 'Consent granted' },
        { status: 'Data Retrieved', timestamp: '2026-08-28T14:10:00Z', notes: 'Income & academic data retrieved' },
        { status: 'Application Auto-Filled', timestamp: '2026-08-28T14:15:00Z', notes: 'Auto-fill completed' },
        { status: 'Citizen Confirmed', timestamp: '2026-08-28T14:18:00Z', notes: 'Confirmed by citizen' },
        { status: 'Application Submitted', timestamp: '2026-08-28T14:20:00Z', notes: 'Submitted to BC & Minority Welfare Department' },
        { status: 'Approved', timestamp: '2026-08-30T16:00:00Z', notes: 'Scholarship sanctioned and approval certificate generated' }
      ],
      connectorUsed: 'ScholarshipConnector',
      mockApiResponse: {
        ackId: 'ACK-SCH-90211',
        status: 'APPROVED',
        sanctionOrder: 'SO-BCW-2026-881'
      }
    }
  ],

  consents: [
    {
      id: 'cst_001',
      userId: demoCitizenId,
      serviceId: 'SRV-FGB-01',
      serviceName: 'First-Generation Graduate Benefit',
      department: 'Department of Higher Education',
      requestedFields: ['Education Information', 'Income Information', 'Address Information', 'Certificate Information'],
      scopes: ['Education Data', 'Income Data', 'Certificate Data', 'Address Data'],
      purpose: 'Eligibility verification and application preparation for tuition fee waiver.',
      grantedAt: new Date('2026-09-02T08:22:00Z'),
      status: 'Active'
    },
    {
      id: 'cst_002',
      userId: demoCitizenId,
      serviceId: 'SRV-ENG-02',
      serviceName: 'Engineering Counselling',
      department: 'Directorate of Technical Education (DoTE)',
      requestedFields: ['Education Information', 'Address Information', 'Identity Information'],
      scopes: ['Education Data', 'Address Data'],
      purpose: 'Application auto-fill and counselling registration.',
      grantedAt: new Date('2026-09-01T10:05:00Z'),
      status: 'Active'
    },
    {
      id: 'cst_003',
      userId: demoCitizenId,
      serviceId: 'SRV-SCH-03',
      serviceName: 'Student Scholarship',
      department: 'Department of Backward Classes & Minority Welfare',
      requestedFields: ['Education Information', 'Income Information', 'Community Information'],
      scopes: ['Education Data', 'Income Data', 'Community Data'],
      purpose: 'Re-using Income & Education verification records from connected APIs.',
      grantedAt: new Date('2026-08-28T14:05:00Z'),
      status: 'Active'
    }
  ],

  apiLogs: [
    {
      id: 'log_901',
      requestId: 'REQ-92831',
      timestamp: new Date('2026-09-02T08:24:10Z'),
      service: 'Higher Education API (DoTE)',
      connector: 'EducationConnector',
      endpoint: '/mock-api/education/citizen/9876543210',
      method: 'GET',
      status: 200,
      responseTimeMs: 242,
      isSuccess: true
    },
    {
      id: 'log_902',
      requestId: 'REQ-92832',
      timestamp: new Date('2026-09-02T08:24:00Z'),
      service: 'Revenue Income API (Karur)',
      connector: 'IncomeConnector',
      endpoint: '/mock-api/income/citizen/9876543210',
      method: 'GET',
      status: 200,
      responseTimeMs: 310,
      isSuccess: true
    },
    {
      id: 'log_903',
      requestId: 'REQ-92833',
      timestamp: new Date('2026-09-01T10:15:22Z'),
      service: 'Engineering Counselling API',
      connector: 'CounsellingConnector',
      endpoint: '/mock-api/counselling/apply',
      method: 'POST',
      status: 200,
      responseTimeMs: 289,
      isSuccess: true
    },
    {
      id: 'log_904',
      requestId: 'REQ-92834',
      timestamp: new Date('2026-08-28T14:20:15Z'),
      service: 'Scholarship API',
      connector: 'ScholarshipConnector',
      endpoint: '/mock-api/scholarship/apply',
      method: 'POST',
      status: 200,
      responseTimeMs: 512,
      isSuccess: true
    }
  ],

  auditLogs: [
    {
      id: 'aud_101',
      timestamp: new Date('2026-09-02T08:30:00Z'),
      userName: 'Thanga Prabu N',
      userId: demoCitizenId,
      action: 'Application Submitted',
      serviceName: 'First-Generation Graduate Benefit',
      dataAccessed: ['fullName', 'dateOfBirth', 'collegeName', 'address', 'aadhaarMasked', 'annualFamilyIncome'],
      consentStatus: 'Granted',
      status: 'Success',
      ipAddress: '192.168.1.42'
    },
    {
      id: 'aud_102',
      timestamp: new Date('2026-09-02T08:22:00Z'),
      userName: 'Thanga Prabu N',
      userId: demoCitizenId,
      action: 'Consent Granted',
      serviceName: 'First-Generation Graduate Benefit',
      dataAccessed: ['Education Information', 'Income Information', 'Address Information'],
      consentStatus: 'Granted',
      status: 'Success',
      ipAddress: '192.168.1.42'
    },
    {
      id: 'aud_103',
      timestamp: new Date('2026-09-02T08:20:00Z'),
      userName: 'Thanga Prabu N',
      userId: demoCitizenId,
      action: 'Eligibility Check Evaluated',
      serviceName: 'First-Generation Graduate Benefit',
      dataAccessed: ['annualFamilyIncome', 'parentEducation', 'educationLevel'],
      consentStatus: 'System Internal',
      status: 'Success',
      ipAddress: '192.168.1.42'
    },
    {
      id: 'aud_104',
      timestamp: new Date('2026-09-02T08:18:00Z'),
      userName: 'Thanga Prabu N',
      userId: demoCitizenId,
      action: 'AI Intent Discovery',
      serviceName: 'Service Discovery Engine',
      dataAccessed: ['Natural Language Query: First-generation graduate benefits'],
      consentStatus: 'N/A',
      status: 'Success',
      ipAddress: '192.168.1.42'
    },
    {
      id: 'aud_105',
      timestamp: new Date('2026-09-01T10:00:00Z'),
      userName: 'System Administrator',
      userId: demoAdminId,
      action: 'Admin Viewed System API Monitoring',
      serviceName: 'Integration Dashboard',
      dataAccessed: ['API Health Metrics', 'Success Rate'],
      consentStatus: 'Admin Permission',
      status: 'Success',
      ipAddress: '10.0.0.1'
    }
  ],

  // Store for verified service-specific requirement inputs per user
  userRequirementsDrafts: {}
};

module.exports = store;
