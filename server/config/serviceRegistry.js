/**
 * CivicBridge AI – Comprehensive Service Configuration Registry
 * Defines service-specific schemas, available data sources, consent scopes,
 * missing-information questions with validation rules, auto-fill sections, and application prefixes.
 */

const SERVICE_REGISTRY = {
  // 1. FIRST-GENERATION GRADUATE BENEFIT
  'SRV-FGB-01': {
    serviceId: 'SRV-FGB-01',
    id: 'SRV-FGB-01',
    serviceName: 'First-Generation Graduate Benefit',
    department: 'Department of Higher Education',
    category: 'Education & Admissions',
    applicationPrefix: 'CIV-FGB-2026',
    description: 'Financial concession & tuition fee waiver for students who are the first in their immediate family to pursue higher education.',
    purpose: 'Help a citizen determine whether they may qualify for a first-generation graduate-related education benefit and prepare the application.',
    prototypeStatusText: 'Potentially Eligible – additional parent education and income verification required.',
    apiConnector: 'EducationConnector',
    endpoint: '/mock-api/education/fgb-verify',
    icon: 'GraduationCap',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address', 'aadhaarMasked'] },
      { name: 'Higher Education EMIS (System C)', fields: ['collegeName', 'educationLevel'] }
    ],
    consentScopes: [
      { id: 'edu_data', label: 'Education Information', detail: 'Enrolled Institution, Current Education Level' },
      { id: 'inc_data', label: 'Income Information', detail: 'Household Annual Family Income' },
      { id: 'addr_data', label: 'Address Information', detail: 'Permanent Residential Address' },
      { id: 'cert_data', label: 'Certificate & Identity Data', detail: 'Masked Aadhaar Token Reference' }
    ],
    consentPurpose: 'To verify service-specific requirements and prepare the First-Generation Graduate Benefit application.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'address', 'collegeName', 'educationLevel', 'aadhaarMasked'],
    missingInformationQuestions: [
      {
        key: 'parentEducation',
        label: 'Parent / Guardian Highest Education Level',
        type: 'select',
        options: [
          'Non-Graduate (School-level 10th Standard)',
          'Non-Graduate (School-level 12th Standard)',
          'Illiterate / No Formal Schooling',
          'Graduate Degree Holder (B.A/B.Sc/B.E/etc.)'
        ],
        required: true,
        placeholder: 'Select parent education level',
        defaultValue: 'Non-Graduate (School-level 10th Standard)',
        helperText: 'Required to determine first-generation graduate eligibility status.'
      },
      {
        key: 'firstGenStatus',
        label: 'First-Generation Graduate Declaration',
        type: 'select',
        options: ['Yes – First candidate in immediate family', 'No – Sibling or parent is already a graduate'],
        required: true,
        placeholder: 'Confirm first-generation status',
        defaultValue: 'Yes – First candidate in immediate family',
        helperText: 'Self-declaration confirming no elder sibling or parent has a degree.'
      },
      {
        key: 'annualFamilyIncome',
        label: 'Annual Household Family Income (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 180000',
        defaultValue: '180000',
        min: 10000,
        max: 2000000,
        helperText: 'Income threshold criteria must be less than or equal to ₹3,00,000 / year.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Applicant Personal & Identity Information',
        fields: [
          { key: 'fullName', label: 'Applicant Full Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', source: 'Identity Register (System A)' },
          { key: 'address', label: 'Residential Address', type: 'text', source: 'Population Registry (System A)' },
          { key: 'aadhaarMasked', label: 'Aadhaar Reference (Masked)', type: 'text', source: 'UIDAI Token Vault', disabled: true }
        ]
      },
      {
        sectionTitle: 'Academic & Higher Education Profile',
        fields: [
          { key: 'collegeName', label: 'Enrolled Institution', type: 'text', source: 'Higher Education API (System C)' },
          { key: 'educationLevel', label: 'Current Education Level', type: 'text', source: 'Higher Education API (System C)' }
        ]
      },
      {
        sectionTitle: 'First-Generation & Income Verification',
        fields: [
          { key: 'parentEducation', label: 'Parent Education Level', type: 'text', source: 'Citizen Declared Requirement' },
          { key: 'firstGenStatus', label: 'First-Gen Status', type: 'text', source: 'Citizen Declared Requirement' },
          { key: 'annualFamilyIncome', label: 'Annual Family Income (₹)', type: 'text', source: 'Revenue Assessment' }
        ]
      }
    ]
  },

  // 2. ENGINEERING COUNSELLING
  'SRV-ENG-02': {
    serviceId: 'SRV-ENG-02',
    id: 'SRV-ENG-02',
    serviceName: 'Engineering Counselling',
    department: 'Directorate of Technical Education (DoTE)',
    category: 'Education & Admissions',
    applicationPrefix: 'CIV-TEC-2026',
    description: 'Single-window online engineering admissions counselling & seat allocation system.',
    purpose: 'Prepare engineering counselling registration and compute official cut-off mark for single-window seat allocation.',
    prototypeStatusText: 'Application requirements partially complete – examination marks and contact details required.',
    apiConnector: 'CounsellingConnector',
    endpoint: '/mock-api/counselling/apply',
    icon: 'Compass',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address'] },
      { name: 'Higher Education / School Examination Registry (System C)', fields: ['collegeName'] }
    ],
    consentScopes: [
      { id: 'edu_data', label: 'Education Data', detail: 'HSC Examination Records, Board Marks' },
      { id: 'addr_data', label: 'Address Data', detail: 'Domicile Residential Address' }
    ],
    consentPurpose: 'To retrieve education information and prepare engineering counselling registration.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'address'],
    missingInformationQuestions: [
      {
        key: 'mobile',
        label: 'Candidate Mobile Number (for OTP & Allotment SMS)',
        type: 'text',
        required: true,
        placeholder: '+91 98765 43210',
        defaultValue: '+91 98765 43210',
        validationRegex: '^\\+?[0-9\\s-]{10,15}$',
        helperText: 'Essential for choice filling alerts and provisional allotment letters.'
      },
      {
        key: 'email',
        label: 'Candidate Email ID',
        type: 'email',
        required: true,
        placeholder: 'candidate@domain.com',
        defaultValue: 'thangaprabu@student.edu',
        helperText: 'Used for online counselling login credentials.'
      },
      {
        key: 'mathsMarks',
        label: 'Mathematics Marks (Out of 100)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 95',
        defaultValue: '94',
        min: 35,
        max: 100,
        helperText: 'Core cut-off subject (100% weightage in TNEA formula).'
      },
      {
        key: 'physicsMarks',
        label: 'Physics Marks (Out of 100)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 90',
        defaultValue: '92',
        min: 35,
        max: 100,
        helperText: 'Weighted at 50% in TNEA cut-off calculation.'
      },
      {
        key: 'chemistryMarks',
        label: 'Chemistry Marks (Out of 100)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 88',
        defaultValue: '90',
        min: 35,
        max: 100,
        helperText: 'Weighted at 50% in TNEA cut-off calculation.'
      },
      {
        key: 'community',
        label: 'Community Reservation Category',
        type: 'select',
        options: ['OC (Open Competition)', 'BC (Backward Class)', 'BCM (BC Muslim)', 'MBC / DNC', 'SC', 'SCA', 'ST'],
        required: true,
        placeholder: 'Select community category',
        defaultValue: 'BC (Backward Class)',
        helperText: 'Determines seat matrix reservation quota.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Candidate Personal Information',
        fields: [
          { key: 'fullName', label: 'Candidate Full Name', type: 'text', source: 'Population Register (System A)' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', source: 'Identity Register (System A)' },
          { key: 'mobile', label: 'Mobile Number', type: 'text', source: 'Provided Requirement' },
          { key: 'email', label: 'Email ID', type: 'text', source: 'Provided Requirement' },
          { key: 'address', label: 'Residential Address', type: 'text', source: 'Population Register (System A)' },
          { key: 'community', label: 'Community Category', type: 'text', source: 'Provided Requirement' }
        ]
      },
      {
        sectionTitle: 'HSC Examination Marks & Computed Cut-off',
        fields: [
          { key: 'mathsMarks', label: 'Mathematics (100)', type: 'number', source: 'HSC Board Marks' },
          { key: 'physicsMarks', label: 'Physics (100)', type: 'number', source: 'HSC Board Marks' },
          { key: 'chemistryMarks', label: 'Chemistry (100)', type: 'number', source: 'HSC Board Marks' },
          { key: 'cutoffMark', label: 'Computed Engineering Cut-Off (200)', type: 'text', source: 'DoTE Cut-Off Algorithm: Maths + (Physics/2) + (Chemistry/2)' }
        ]
      }
    ]
  },

  // 3. STUDENT SCHOLARSHIP
  'SRV-SCH-03': {
    serviceId: 'SRV-SCH-03',
    id: 'SRV-SCH-03',
    serviceName: 'Student Scholarship',
    department: 'BC & Minority Welfare Department',
    category: 'Scholarships',
    applicationPrefix: 'CIV-SCH-2026',
    description: 'Financial assistance grant for post-secondary students pursuing degree & diploma courses.',
    purpose: 'Determine whether the student qualifies for post-matric scholarship & maintenance allowance and prepare the DBT grant application.',
    prototypeStatusText: 'Potentially Eligible – academic percentage, annual family income, and DBT bank account required.',
    apiConnector: 'ScholarshipConnector',
    endpoint: '/mock-api/scholarship/apply',
    icon: 'Award',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address'] },
      { name: 'Higher Education Registry (System C)', fields: ['collegeName'] }
    ],
    consentScopes: [
      { id: 'edu_data', label: 'Education Data', detail: 'Course Enrollment, Academic Performance' },
      { id: 'inc_data', label: 'Income Data', detail: 'Verified Annual Family Income' },
      { id: 'cert_data', label: 'Certificate Data', detail: 'Community and Welfare Category' },
      { id: 'addr_data', label: 'Address Data', detail: 'Residential Address' }
    ],
    consentPurpose: 'To assist with scholarship eligibility assessment and application preparation.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'address', 'collegeName'],
    missingInformationQuestions: [
      {
        key: 'coursePreferred',
        label: 'Degree Programme / Course Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. B.E. Computer Science and Engineering',
        defaultValue: 'B.E. Computer Science and Engineering',
        helperText: 'Must be an AICTE / UGC approved full-time degree programme.'
      },
      {
        key: 'twelfthPercentage',
        label: 'Previous Academic Marks Percentage (%)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 89.5',
        defaultValue: '89.5',
        min: 50,
        max: 100,
        helperText: 'Minimum 50% required for state post-matric scholarship entitlement.'
      },
      {
        key: 'annualFamilyIncome',
        label: 'Annual Household Family Income (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 180000',
        defaultValue: '180000',
        min: 10000,
        max: 500000,
        helperText: 'Income ceiling limit: ₹2,50,000 / annum.'
      },
      {
        key: 'bankAccountNo',
        label: 'Aadhaar-Seeded Bank Account Number (DBT Disbursement)',
        type: 'text',
        required: true,
        placeholder: 'e.g. 123456789012',
        defaultValue: '908123456789',
        helperText: 'Required for direct benefit transfer (DBT) scholarship maintenance stipend.'
      },
      {
        key: 'bankIfsc',
        label: 'Bank Branch IFSC Code',
        type: 'text',
        required: true,
        placeholder: 'e.g. SBIN0001234',
        defaultValue: 'SBIN0004521',
        helperText: 'IFSC of the active savings bank account.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Student Personal Information',
        fields: [
          { key: 'fullName', label: 'Student Full Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', source: 'Identity Register (System A)' },
          { key: 'address', label: 'Residential Address', type: 'text', source: 'Population Registry (System A)' }
        ]
      },
      {
        sectionTitle: 'Academic Details & Merit',
        fields: [
          { key: 'collegeName', label: 'Enrolled Institution', type: 'text', source: 'Higher Education API (System C)' },
          { key: 'coursePreferred', label: 'Programme / Course', type: 'text', source: 'Provided Requirement' },
          { key: 'twelfthPercentage', label: 'Academic Percentage (%)', type: 'text', source: 'Provided Requirement' }
        ]
      },
      {
        sectionTitle: 'Welfare & DBT Disbursement Information',
        fields: [
          { key: 'annualFamilyIncome', label: 'Verified Annual Income (₹)', type: 'text', source: 'Revenue Verified' },
          { key: 'bankAccountNo', label: 'DBT Bank Account', type: 'text', source: 'Aadhaar Seeded DBT Portal' },
          { key: 'bankIfsc', label: 'Branch IFSC', type: 'text', source: 'Bank Master Registry' }
        ]
      }
    ]
  },

  // 4. INCOME CERTIFICATE
  'SRV-INC-04': {
    serviceId: 'SRV-INC-04',
    id: 'SRV-INC-04',
    serviceName: 'Income Certificate',
    department: 'Revenue & Land Administration Department',
    category: 'Certificates',
    applicationPrefix: 'CIV-INC-2026',
    description: 'Official government certification verifying annual household family income for government schemes.',
    purpose: 'Prepare an official income certificate application for revenue inspection and Tahsildar issuance.',
    prototypeStatusText: 'Information incomplete – family income source and occupation details required.',
    apiConnector: 'IncomeConnector',
    endpoint: '/mock-api/income/apply',
    icon: 'FileText',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address', 'district'] }
    ],
    consentScopes: [
      { id: 'id_data', label: 'Identity/Profile Data', detail: 'Citizen Full Name, Date of Birth' },
      { id: 'addr_data', label: 'Address Data', detail: 'Residential Address, District, Taluk' },
      { id: 'inc_data', label: 'Income-related information', detail: 'Family Income Self-Declaration' }
    ],
    consentPurpose: 'To prepare the income certificate application.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'address', 'district'],
    missingInformationQuestions: [
      {
        key: 'annualFamilyIncome',
        label: 'Total Household Annual Family Income (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 180000',
        defaultValue: '180000',
        min: 1000,
        max: 5000000,
        helperText: 'Cumulative income of all earning members of the family.'
      },
      {
        key: 'incomeSource',
        label: 'Primary Income Source / Sector',
        type: 'select',
        options: ['Private Sector Salaried', 'Government Service', 'Agriculture & Cultivation', 'Self-Employed / Small Business', 'Daily Wage / Labour', 'Professional Services'],
        required: true,
        placeholder: 'Select source of income',
        defaultValue: 'Private Sector Salaried',
        helperText: 'Source will be verified during village administrative officer (VAO) field inquiry.'
      },
      {
        key: 'applicantOccupation',
        label: 'Head of Household / Applicant Occupation',
        type: 'text',
        required: true,
        placeholder: 'e.g. Technical Staff / Farmer / Merchant',
        defaultValue: 'Private Employee',
        helperText: 'Occupation description recorded in revenue records.'
      },
      {
        key: 'rationCardNo',
        label: 'Smart Family Ration Card Number',
        type: 'text',
        required: true,
        placeholder: 'e.g. 33/08/1234567',
        defaultValue: '33/08/1234567',
        helperText: 'Used to verify family members in Civil Supplies database.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Applicant Identity & Residence',
        fields: [
          { key: 'fullName', label: 'Applicant Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', source: 'Identity Register (System A)' },
          { key: 'address', label: 'Permanent Address', type: 'text', source: 'Population Registry (System A)' },
          { key: 'district', label: 'Revenue District', type: 'text', source: 'Revenue Register (System B)' }
        ]
      },
      {
        sectionTitle: 'Income Assessment Details',
        fields: [
          { key: 'annualFamilyIncome', label: 'Declared Annual Income (₹)', type: 'text', source: 'Provided Requirement' },
          { key: 'incomeSource', label: 'Primary Income Source', type: 'text', source: 'Provided Requirement' },
          { key: 'applicantOccupation', label: 'Occupation', type: 'text', source: 'Provided Requirement' },
          { key: 'rationCardNo', label: 'Ration Card Number', type: 'text', source: 'Civil Supplies Master' }
        ]
      }
    ]
  },

  // 5. DOMICILE / NATIVITY CERTIFICATE
  'SRV-NAT-07': {
    serviceId: 'SRV-NAT-07',
    id: 'SRV-NAT-07',
    serviceName: 'Nativity / Domicile Certificate',
    department: 'Revenue & Disaster Management Department',
    category: 'Certificates',
    applicationPrefix: 'CIV-NAT-2026',
    description: 'Official legal verification validating permanent residential domicile status in the state for quota admissions and government services.',
    purpose: 'Prepare the residence/domicile application for legal residency authentication.',
    prototypeStatusText: 'Information incomplete – residence duration and supporting residence proof required.',
    apiConnector: 'RevenueConnector',
    endpoint: '/mock-api/revenue/nativity-verify',
    icon: 'FileText',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address', 'district', 'state'] }
    ],
    consentScopes: [
      { id: 'id_data', label: 'Identity/Profile Data', detail: 'Citizen Full Name, Date of Birth' },
      { id: 'addr_data', label: 'Address Data', detail: 'Permanent Residential Address & District' }
    ],
    consentPurpose: 'To prepare the residence/domicile application.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'address', 'district', 'state'],
    missingInformationQuestions: [
      {
        key: 'periodOfResidence',
        label: 'Continuous Period of Residence in State (Years)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 18',
        defaultValue: '18',
        min: 1,
        max: 100,
        helperText: 'Number of consecutive years living at the permanent address.'
      },
      {
        key: 'nativePlace',
        label: 'Native Village / Town & Taluk',
        type: 'text',
        required: true,
        placeholder: 'e.g. Thanthondrimalai, Karur Taluk',
        defaultValue: 'Thanthondrimalai, Karur Taluk',
        helperText: 'Place of ancestral origin / birth.'
      },
      {
        key: 'residenceProofType',
        label: 'Supporting Residence Proof Document Type',
        type: 'select',
        options: ['Smart Family Ration Card', 'School Transfer Certificate (5+ Years studied in State)', 'Electoral Photo Identity Card (EPIC)', 'Electricity / Property Tax Receipt'],
        required: true,
        placeholder: 'Select residence document',
        defaultValue: 'Smart Family Ration Card',
        helperText: 'Official document presented for VAO / Revenue Inspector verification.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Citizen Identity & State Domicile',
        fields: [
          { key: 'fullName', label: 'Applicant Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', source: 'Identity Register (System A)' },
          { key: 'address', label: 'Permanent Address', type: 'text', source: 'Population Registry (System A)' },
          { key: 'district', label: 'District', type: 'text', source: 'Revenue Register (System B)' },
          { key: 'state', label: 'State of Domicile', type: 'text', source: 'Population Register (System A)' }
        ]
      },
      {
        sectionTitle: 'Residency Verification Details',
        fields: [
          { key: 'periodOfResidence', label: 'Duration of Residence', type: 'text', source: 'Provided Requirement' },
          { key: 'nativePlace', label: 'Native Town / Taluk', type: 'text', source: 'Provided Requirement' },
          { key: 'residenceProofType', label: 'Submitted Proof Type', type: 'text', source: 'Provided Requirement' }
        ]
      }
    ]
  },

  // 6. CASTE / COMMUNITY CERTIFICATE
  'SRV-COM-05': {
    serviceId: 'SRV-COM-05',
    id: 'SRV-COM-05',
    serviceName: 'Community Certificate',
    department: 'Revenue & Disaster Management Department',
    category: 'Certificates',
    applicationPrefix: 'CIV-COM-2026',
    description: 'Government issued certificate validating community status for affirmative action reservations.',
    purpose: 'Prepare the caste/community certificate application for reservation entitlement in admissions & recruitment.',
    prototypeStatusText: 'Requirements incomplete – sub-caste specification and father community reference required.',
    apiConnector: 'CertificateConnector',
    endpoint: '/mock-api/certificate/apply',
    icon: 'ShieldCheck',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address', 'district'] }
    ],
    consentScopes: [
      { id: 'id_data', label: 'Identity/Profile Data', detail: 'Citizen Full Name, Date of Birth' },
      { id: 'addr_data', label: 'Address Data', detail: 'Residential Address, District' },
      { id: 'cert_data', label: 'Certificate Data', detail: 'Existing Family Community Reference' }
    ],
    consentPurpose: 'To prepare the caste/community certificate application.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'address', 'district'],
    missingInformationQuestions: [
      {
        key: 'communityGroup',
        label: 'Community Broad Group',
        type: 'select',
        options: ['BC (Backward Class)', 'MBC (Most Backward Class)', 'DNC (De-notified Community)', 'SC (Scheduled Caste)', 'ST (Scheduled Tribe)'],
        required: true,
        placeholder: 'Select community category',
        defaultValue: 'BC (Backward Class)',
        helperText: 'Broad category of affirmative reservation.'
      },
      {
        key: 'subCasteName',
        label: 'Specific Sub-Caste Name (As per Gazette List)',
        type: 'text',
        required: true,
        placeholder: 'e.g. Kongu Vellalar / Gounder / Nadar / etc.',
        defaultValue: 'Kongu Vellalar',
        helperText: 'Required for exact community gazette serial matching.'
      },
      {
        key: 'fatherCommunity',
        label: "Father's / Guardian's Verified Community",
        type: 'text',
        required: true,
        placeholder: "e.g. BC - Kongu Vellalar",
        defaultValue: "BC - Kongu Vellalar",
        helperText: "Community is legally inherited from paternal bloodline."
      },
      {
        key: 'familyCertRef',
        label: "Existing Family Member Community Certificate Number",
        type: 'text',
        required: true,
        placeholder: 'e.g. COM-2021-884210',
        defaultValue: 'COM-2021-884210',
        helperText: 'Parent / sibling certificate number for expedited digital verification.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Applicant Identity Information',
        fields: [
          { key: 'fullName', label: 'Applicant Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', source: 'Identity Register (System A)' },
          { key: 'address', label: 'Residential Address', type: 'text', source: 'Population Registry (System A)' },
          { key: 'district', label: 'Revenue District', type: 'text', source: 'Revenue Register (System B)' }
        ]
      },
      {
        sectionTitle: 'Community & Paternal Lineage Verification',
        fields: [
          { key: 'communityGroup', label: 'Community Group', type: 'text', source: 'Provided Requirement' },
          { key: 'subCasteName', label: 'Sub-Caste Specification', type: 'text', source: 'Provided Requirement' },
          { key: 'fatherCommunity', label: 'Father Community', type: 'text', source: 'Provided Requirement' },
          { key: 'familyCertRef', label: 'Family Certificate Reference', type: 'text', source: 'Revenue Digital Archives' }
        ]
      }
    ]
  },

  // 7. STARTUP & STUDENT INNOVATION SEED FUND (EDII) - THE CORE CUSTOM SERVICE
  'SRV-ENT-11': {
    serviceId: 'SRV-ENT-11',
    id: 'SRV-ENT-11',
    serviceName: 'Startup & Student Innovation Seed Fund (EDII)',
    department: 'Micro, Small & Medium Enterprises (MSME) Department',
    category: 'Business & Startups',
    applicationPrefix: 'CIV-EDII-2026',
    description: 'Innovation grant seed funding up to ₹10 Lakhs for student-led technology prototypes, hardware projects, and deep-tech startup ventures.',
    purpose: 'Demonstrate student innovation/startup support involving idea evaluation, prototype development and entrepreneurial seed funding.',
    prototypeStatusText: 'Potentially Suitable for Application – innovation details, prototype status and funding requirements are required.',
    apiConnector: 'MSMEConnector',
    endpoint: '/mock-api/msme/startup-grant',
    icon: 'ShieldCheck',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth'] },
      { name: 'Higher Education / College Registry (System C)', fields: ['collegeName', 'coursePreferred'] }
    ],
    consentScopes: [
      { id: 'student_profile', label: 'Student Profile', detail: 'Full Name, Date of Birth, Contact Details' },
      { id: 'inst_info', label: 'Institution Information', detail: 'Enrolled College, Academic Programme' }
    ],
    consentPurpose: 'To pre-fill student information and prepare the innovation/startup support application.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'collegeName'],
    missingInformationQuestions: [
      {
        key: 'projectTitle',
        label: 'Project / Innovation Title',
        type: 'text',
        required: true,
        placeholder: 'e.g. CivicBridge AI – Cross-Government Service Orchestrator',
        defaultValue: 'CivicBridge AI – Cross-Government Service Orchestrator',
        helperText: 'A clear, descriptive title of your innovative startup technology.'
      },
      {
        key: 'problemStatement',
        label: 'Problem Statement',
        type: 'textarea',
        required: true,
        placeholder: 'What core societal, governance, or industrial problem does this solve?',
        defaultValue: 'Citizens face fragmented, repetitive paperwork across siloed government departments, causing administrative delays and welfare leakage.',
        helperText: 'Clearly describe the specific pain point addressed by your project.'
      },
      {
        key: 'proposedSolution',
        label: 'Proposed Solution & Innovation',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your technical innovation and how it solves the problem.',
        defaultValue: 'A unified interoperability orchestration layer with automated schema mapping, consent management, and ML intent routing.',
        helperText: 'Explain the unique value proposition and novelty.'
      },
      {
        key: 'technologyUsed',
        label: 'Technology Stack / Key Technologies Used',
        type: 'text',
        required: true,
        placeholder: 'e.g. Node.js, Python, Scikit-Learn, Hugging Face Transformers, React',
        defaultValue: 'Python, Scikit-Learn, Hugging Face Transformers, React, REST Connectors',
        helperText: 'Primary programming languages, frameworks, hardware, or AI models.'
      },
      {
        key: 'prototypeStage',
        label: 'Current Development / Prototype Stage',
        type: 'select',
        options: ['Idea / Concept', 'Working Prototype / MVP', 'Lab Tested / Pilot Stage', 'Early Market Traction'],
        required: true,
        placeholder: 'Select development stage',
        defaultValue: 'Working Prototype / MVP',
        helperText: 'Grant tier is calibrated based on prototype maturity.'
      },
      {
        key: 'teamSize',
        label: 'Total Team Size (Members)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 4',
        defaultValue: '4',
        min: 1,
        max: 20,
        helperText: 'Number of active student founders and developers.'
      },
      {
        key: 'targetUsers',
        label: 'Target Users / Market Use Case',
        type: 'text',
        required: true,
        placeholder: 'e.g. E-Governance departments, citizens, and public welfare bodies',
        defaultValue: 'State e-Governance agencies, students, and welfare scheme applicants',
        helperText: 'Who will adopt or purchase this technology.'
      },
      {
        key: 'expectedImpact',
        label: 'Expected Social / Economic Impact',
        type: 'textarea',
        required: true,
        placeholder: 'Quantify the expected benefit (e.g. 80% paperwork reduction, faster delivery).',
        defaultValue: 'Eliminates 80% of redundant document filing and reduces citizen service application cycle from 14 days to under 5 minutes.',
        helperText: 'Anticipated societal and economic outcome.'
      },
      {
        key: 'fundingRequirement',
        label: 'Estimated Seed Funding Requirement (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 500000',
        defaultValue: '500000',
        min: 50000,
        max: 1000000,
        helperText: 'Seed fund grant tier: Up to ₹10,00,000 for student innovation prototypes.'
      },
      {
        key: 'useOfFunds',
        label: 'Proposed Use of Funds Breakdown',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. Cloud infrastructure (30%), hardware sensors (40%), pilot testing (30%)',
        defaultValue: 'Server cloud infrastructure (35%), API security audit & penetration testing (35%), pilot university deployment (30%)',
        helperText: 'Brief budget allocation plan.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Student Founder & Institution Information',
        fields: [
          { key: 'fullName', label: 'Lead Student Innovator', type: 'text', source: 'Population Registry (System A)' },
          { key: 'collegeName', label: 'Enrolled College / Incubator', type: 'text', source: 'Higher Education API (System C)' },
          { key: 'coursePreferred', label: 'Academic Programme', type: 'text', source: 'Higher Education API (System C)' },
          { key: 'teamSize', label: 'Founding Team Size', type: 'text', source: 'Provided Requirement' }
        ]
      },
      {
        sectionTitle: 'Startup Innovation & Technology Details',
        fields: [
          { key: 'projectTitle', label: 'Innovation Project Title', type: 'text', source: 'Provided Requirement' },
          { key: 'technologyUsed', label: 'Technology Stack', type: 'text', source: 'Provided Requirement' },
          { key: 'prototypeStage', label: 'Current Prototype Stage', type: 'text', source: 'Provided Requirement' },
          { key: 'problemStatement', label: 'Problem Statement', type: 'textarea', source: 'Provided Requirement' },
          { key: 'proposedSolution', label: 'Proposed Solution', type: 'textarea', source: 'Provided Requirement' }
        ]
      },
      {
        sectionTitle: 'Market Impact & Seed Funding Requirement',
        fields: [
          { key: 'targetUsers', label: 'Target Beneficiaries', type: 'text', source: 'Provided Requirement' },
          { key: 'expectedImpact', label: 'Projected Societal Impact', type: 'textarea', source: 'Provided Requirement' },
          { key: 'fundingRequirement', label: 'Requested Seed Grant (₹)', type: 'text', source: 'EDII Seed Grant Matrix' },
          { key: 'useOfFunds', label: 'Fund Utilization Plan', type: 'textarea', source: 'Provided Requirement' }
        ]
      }
    ]
  },

  // 8. YOUTH UPSKILLING & INDUSTRY 4.0
  'SRV-SKL-08': {
    serviceId: 'SRV-SKL-08',
    id: 'SRV-SKL-08',
    serviceName: 'Youth Upskilling & Industry 4.0 Certification',
    department: 'Department of Employment & Training / TNSDC',
    category: 'Skilling & Employment',
    applicationPrefix: 'CIV-SKL-2026',
    description: 'Fully subsidized Industry 4.0 technical skill certifications with campus placement drives.',
    purpose: 'Enroll student in specialized high-tech courses and process state-sponsored certification vouchers.',
    prototypeStatusText: 'Potentially Eligible – technical specialization track and placement preference required.',
    apiConnector: 'EmploymentConnector',
    endpoint: '/mock-api/employment/skill-enroll',
    icon: 'Cpu',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth'] },
      { name: 'Higher Education Registry (System C)', fields: ['collegeName'] }
    ],
    consentScopes: [
      { id: 'student_profile', label: 'Student Profile', detail: 'Student Name, Date of Birth' },
      { id: 'edu_data', label: 'Education Data', detail: 'Enrolled Institution, Degree Course' }
    ],
    consentPurpose: 'To verify student enrollment and enroll in subsidized Industry 4.0 courses.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'collegeName'],
    missingInformationQuestions: [
      {
        key: 'skillTrack',
        label: 'Preferred Industry 4.0 Specialization Track',
        type: 'select',
        options: [
          'Artificial Intelligence & Machine Learning Engineering',
          'Cloud Architecture & DevOps (AWS / GCP / Azure)',
          'Cybersecurity & Threat Intelligence',
          'Full-Stack Web & Microservices Development',
          'Data Engineering & Big Data Analytics'
        ],
        required: true,
        placeholder: 'Select skill specialization',
        defaultValue: 'Artificial Intelligence & Machine Learning Engineering',
        helperText: 'Includes government voucher for global certification exams.'
      },
      {
        key: 'careerPlacementInterest',
        label: 'Placement Drive & Internship Interest',
        type: 'select',
        options: ['Yes – Mandatory participation in campus placement drives', 'Skill Certification Only'],
        required: true,
        placeholder: 'Select placement option',
        defaultValue: 'Yes – Mandatory participation in campus placement drives',
        helperText: 'Connects profile directly with 500+ hiring tech companies.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Student Profile & Institute',
        fields: [
          { key: 'fullName', label: 'Student Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'collegeName', label: 'Enrolled College', type: 'text', source: 'Higher Education API (System C)' }
        ]
      },
      {
        sectionTitle: 'Skilling Course & Certification Track',
        fields: [
          { key: 'skillTrack', label: 'Selected Tech Course', type: 'text', source: 'TNSDC / Naan Mudhalvan Master' },
          { key: 'careerPlacementInterest', label: 'Placement Preference', type: 'text', source: 'Provided Requirement' }
        ]
      }
    ]
  },

  // 9. HEALTH INSURANCE CMCHIS
  'SRV-HLT-09': {
    serviceId: 'SRV-HLT-09',
    id: 'SRV-HLT-09',
    serviceName: 'Chief Minister Comprehensive Health Insurance (CMCHIS / Ayushman)',
    department: 'Health & Family Welfare Department',
    category: 'Health & Social Welfare',
    applicationPrefix: 'CIV-HLT-2026',
    description: 'Cashless medical treatment insurance coverage up to ₹5,00,000 per family per year.',
    purpose: 'Link household with state cashless health insurance safety net and issue digital health e-card.',
    prototypeStatusText: 'Information incomplete – Smart Ration Card reference and dependent family details required.',
    apiConnector: 'HealthConnector',
    endpoint: '/mock-api/health/cmchis-enroll',
    icon: 'Award',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address', 'district'] }
    ],
    consentScopes: [
      { id: 'id_data', label: 'Identity/Profile Data', detail: 'Citizen Full Name, Date of Birth' },
      { id: 'addr_data', label: 'Address Data', detail: 'Residential Address, District' },
      { id: 'inc_data', label: 'Income Information', detail: 'Verified Annual Family Income' },
      { id: 'ration_data', label: 'Ration Card Data', detail: 'Smart Ration Card Family Structure' }
    ],
    consentPurpose: 'To verify family income and link health insurance with Smart Ration Card.',
    requiredProfileKeys: ['fullName', 'dateOfBirth', 'address', 'district'],
    missingInformationQuestions: [
      {
        key: 'rationCardNo',
        label: 'Smart Family Ration Card Number',
        type: 'text',
        required: true,
        placeholder: 'e.g. 33/08/1234567',
        defaultValue: '33/08/1234567',
        helperText: 'Essential identifier for family cashless medical entitlement.'
      },
      {
        key: 'dependentMembersCount',
        label: 'Total Number of Family Members to be Covered',
        type: 'number',
        required: true,
        placeholder: 'e.g. 4',
        defaultValue: '4',
        min: 1,
        max: 15,
        helperText: 'All listed members on ration card receive cashless coverage.'
      },
      {
        key: 'annualFamilyIncome',
        label: 'Annual Household Income (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 180000',
        defaultValue: '180000',
        min: 10000,
        max: 500000,
        helperText: 'Income ceiling eligibility: ₹1,20,000 - ₹3,00,000 / year.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Primary Policyholder Information',
        fields: [
          { key: 'fullName', label: 'Beneficiary Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', source: 'Identity Register (System A)' },
          { key: 'address', label: 'Permanent Address', type: 'text', source: 'Population Registry (System A)' },
          { key: 'district', label: 'District', type: 'text', source: 'Revenue Register (System B)' }
        ]
      },
      {
        sectionTitle: 'Coverage & Ration Card Association',
        fields: [
          { key: 'rationCardNo', label: 'Smart Ration Card', type: 'text', source: 'Civil Supplies Portal' },
          { key: 'dependentMembersCount', label: 'Insured Family Members', type: 'text', source: 'Provided Requirement' },
          { key: 'annualFamilyIncome', label: 'Verified Annual Income (₹)', type: 'text', source: 'Revenue Verified' }
        ]
      }
    ]
  },

  // 10. FARMER AGRICULTURAL SUBSIDY
  'SRV-AGR-10': {
    serviceId: 'SRV-AGR-10',
    id: 'SRV-AGR-10',
    serviceName: 'Farmer Agricultural Input Subsidy & PM-KISAN Portal',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Agriculture & Rural Welfare',
    applicationPrefix: 'CIV-AGR-2026',
    description: 'Direct financial assistance (₹6,000/yr) and subsidized farm inputs for farming households.',
    purpose: 'Authenticate agricultural land holdings and disburse direct input subsidies.',
    prototypeStatusText: 'Requirements incomplete – Land Patta/Chitta number and crop details required.',
    apiConnector: 'AgricultureConnector',
    endpoint: '/mock-api/agriculture/subsidy-apply',
    icon: 'Compass',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'address', 'district'] }
    ],
    consentScopes: [
      { id: 'id_data', label: 'Identity/Profile Data', detail: 'Farmer Full Name, Date of Birth' },
      { id: 'addr_data', label: 'Address Data', detail: 'Village / Taluk Location' },
      { id: 'land_data', label: 'Land Record Data', detail: 'Patta, Chitta & Land Holding Registry' },
      { id: 'bank_data', label: 'Bank DBT Data', detail: 'Aadhaar Linked Direct Benefit Account' }
    ],
    consentPurpose: 'To authenticate land holdings and disburse agricultural input subsidy.',
    requiredProfileKeys: ['fullName', 'address', 'district'],
    missingInformationQuestions: [
      {
        key: 'pattaNumber',
        label: 'Revenue Land Patta / Chitta Number',
        type: 'text',
        required: true,
        placeholder: 'e.g. PATTA-KAR-88210',
        defaultValue: 'PATTA-KAR-88210',
        helperText: 'Digital land revenue record reference.'
      },
      {
        key: 'landAreaAcres',
        label: 'Total Cultivable Land Area (Acres)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 2.5',
        defaultValue: '2.5',
        min: 0.1,
        max: 50.0,
        helperText: 'Small & marginal farmers (< 5 acres) qualify for 100% input subsidy.'
      },
      {
        key: 'cropType',
        label: 'Current Sown Agricultural Crop',
        type: 'select',
        options: ['Paddy / Rice', 'Millets (Ragi/Bajra)', 'Cotton', 'Sugarcane', 'Pulses / Oilseeds', 'Horticulture Vegetables'],
        required: true,
        placeholder: 'Select crop type',
        defaultValue: 'Paddy / Rice',
        helperText: 'Used for seasonal seed and fertilizer allocation.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Farmer Profile & Address',
        fields: [
          { key: 'fullName', label: 'Farmer Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'address', label: 'Village Address', type: 'text', source: 'Population Registry (System A)' },
          { key: 'district', label: 'Agricultural District', type: 'text', source: 'Revenue Register (System B)' }
        ]
      },
      {
        sectionTitle: 'Land Holdings & Crop Information',
        fields: [
          { key: 'pattaNumber', label: 'Patta Number', type: 'text', source: 'e-Adangal Land Portal' },
          { key: 'landAreaAcres', label: 'Land Holding (Acres)', type: 'text', source: 'Revenue Records' },
          { key: 'cropType', label: 'Cultivated Crop', type: 'text', source: 'Provided Requirement' }
        ]
      }
    ]
  },

  // 11. EDUCATION ASSISTANCE GRANT
  'SRV-EDA-06': {
    serviceId: 'SRV-EDA-06',
    id: 'SRV-EDA-06',
    serviceName: 'Education Assistance Grant',
    department: 'Social Welfare & Nutritious Meal Programme Department',
    category: 'Education & Welfare',
    applicationPrefix: 'CIV-EDA-2026',
    description: 'Special annual financial support grant for laptop/books for meritorious engineering students.',
    purpose: 'Verify academic merit and process student educational equipment allowance.',
    prototypeStatusText: 'Potentially Eligible – academic score and college bonafide reference required.',
    apiConnector: 'EducationConnector',
    endpoint: '/mock-api/education/assistance',
    icon: 'BookOpen',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address'] },
      { name: 'Higher Education Registry (System C)', fields: ['collegeName'] }
    ],
    consentScopes: [
      { id: 'edu_data', label: 'Education Data', detail: 'HSC Percentage, College Bonafide' },
      { id: 'inc_data', label: 'Income Data', detail: 'Annual Household Family Income' }
    ],
    consentPurpose: 'To verify academic merit and process student educational allowance.',
    requiredProfileKeys: ['fullName', 'collegeName'],
    missingInformationQuestions: [
      {
        key: 'twelfthPercentage',
        label: '12th Standard Board Score Percentage (%)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 89.5',
        defaultValue: '89.5',
        min: 60,
        max: 100,
        helperText: 'Minimum 80% cut-off for state merit laptop/book grant.'
      },
      {
        key: 'collegeAdmissionId',
        label: 'College Roll Number / Admission ID',
        type: 'text',
        required: true,
        placeholder: 'e.g. VSB-2024-CSE-042',
        defaultValue: 'VSB-2024-CSE-042',
        helperText: 'Used to verify regular attendance and bonafide status.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Student Beneficiary Information',
        fields: [
          { key: 'fullName', label: 'Student Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'collegeName', label: 'Enrolled College', type: 'text', source: 'Higher Education API (System C)' }
        ]
      },
      {
        sectionTitle: 'Merit Assessment & Student ID',
        fields: [
          { key: 'twelfthPercentage', label: '12th Board Score (%)', type: 'text', source: 'HSC Examination Portal' },
          { key: 'collegeAdmissionId', label: 'College ID', type: 'text', source: 'Provided Requirement' }
        ]
      }
    ]
  },

  // 12. AFFORDABLE HOUSING PMAY
  'SRV-HOU-12': {
    serviceId: 'SRV-HOU-12',
    id: 'SRV-HOU-12',
    serviceName: 'Affordable Housing & Shelter Scheme (PMAY)',
    department: 'Housing & Urban Development Department',
    category: 'Housing & Urban Development',
    applicationPrefix: 'CIV-HOU-2026',
    description: 'Credit-linked interest subsidy up to ₹2.67 Lakhs and pucca housing entitlement for economically weaker sections (EWS/LIG).',
    purpose: 'Assess housing entitlement under PMAY guidelines and register for credit-linked subsidy.',
    prototypeStatusText: 'Requirements incomplete – current housing tenure and urban jurisdiction details required.',
    apiConnector: 'HousingConnector',
    endpoint: '/mock-api/housing/pmay-apply',
    icon: 'BookOpen',
    availableDataSources: [
      { name: 'National Population Register (System A)', fields: ['fullName', 'dateOfBirth', 'address', 'district'] }
    ],
    consentScopes: [
      { id: 'id_data', label: 'Identity/Profile Data', detail: 'Applicant Full Name, Date of Birth' },
      { id: 'addr_data', label: 'Address Data', detail: 'Current Residential Address' },
      { id: 'inc_data', label: 'Income Information', detail: 'Household Annual Family Income' }
    ],
    consentPurpose: 'To verify housing entitlement under PMAY guidelines.',
    requiredProfileKeys: ['fullName', 'address', 'district'],
    missingInformationQuestions: [
      {
        key: 'currentHousingStatus',
        label: 'Current Housing Type / Tenure',
        type: 'select',
        options: ['Rented Accommodation', 'Kutcha / Temporary House', 'Living with Relatives', 'No Permanent House'],
        required: true,
        placeholder: 'Select housing status',
        defaultValue: 'Rented Accommodation',
        helperText: 'Applicant must not own a pucca house anywhere in India.'
      },
      {
        key: 'annualFamilyIncome',
        label: 'Total Annual Household Income (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 180000',
        defaultValue: '180000',
        min: 10000,
        max: 600000,
        helperText: 'EWS category (< ₹3,00,000) qualifies for maximum subsidy.'
      }
    ],
    autoFillSections: [
      {
        sectionTitle: 'Applicant Identity & Current Residence',
        fields: [
          { key: 'fullName', label: 'Applicant Name', type: 'text', source: 'Population Registry (System A)' },
          { key: 'address', label: 'Current Address', type: 'text', source: 'Population Registry (System A)' },
          { key: 'district', label: 'District', type: 'text', source: 'Revenue Register (System B)' }
        ]
      },
      {
        sectionTitle: 'Housing Need & Income Assessment',
        fields: [
          { key: 'currentHousingStatus', label: 'Current Housing Tenure', type: 'text', source: 'Provided Requirement' },
          { key: 'annualFamilyIncome', label: 'Household Income (₹)', type: 'text', source: 'Revenue Verified' }
        ]
      }
    ]
  }
};

const normalizeService = (srv) => {
  if (!srv) return srv;
  const missingQKeys = (srv.missingInformationQuestions || []).map(q => q.label || q.key);
  const profileKeys = (srv.requiredProfileKeys || []).map(k => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
  
  const allReqFields = (srv.requiredFields && srv.requiredFields.length > 0) 
    ? srv.requiredFields 
    : [...new Set([...profileKeys, ...missingQKeys])];

  const allReqDocs = (srv.requiredDocuments && srv.requiredDocuments.length > 0)
    ? srv.requiredDocuments
    : ['Identity Proof (Masked Aadhaar)', 'Institution / Bonafide Proof', 'Income / Revenue Self-Declaration'];

  return {
    ...srv,
    requiredFields: allReqFields,
    requiredDocuments: allReqDocs
  };
};

const getServiceConfig = (serviceId) => {
  const srv = SERVICE_REGISTRY[serviceId] || SERVICE_REGISTRY['SRV-FGB-01'];
  return normalizeService(srv);
};

const getAllServicesList = () => {
  return Object.values(SERVICE_REGISTRY).map(normalizeService);
};

module.exports = {
  SERVICE_REGISTRY,
  getServiceConfig,
  getAllServicesList
};
