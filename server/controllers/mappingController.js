const store = require('../utils/store');
const { mapSystemAToCommon, mapSystemBToCommon, mapSystemCToCommon, mapCommonToTargetServiceFormat } = require('../integrations/standardizer');

const getMappingDemoData = (req, res) => {
  const citizen = store.profiles[0];

  // 1. Raw Heterogeneous Payloads from System A, B, and C
  const systemAPayload = {
    system_origin: 'MOCK_GOV_CITIZEN_REGISTRY_SYS_A',
    citizen_uid: 'UID-90218842',
    full_name: citizen.fullName,
    date_of_birth: citizen.dateOfBirth,
    mobile_number: citizen.mobile,
    residential_address: citizen.address
  };

  const systemBPayload = {
    system_origin: 'MOCK_REVENUE_INCOME_PORTAL_SYS_B',
    incomeCertNo: 'INC-2026-88192',
    candidateName: citizen.fullName,
    dateOfBirth: citizen.dateOfBirth,
    verifiedAnnualIncome: citizen.annualFamilyIncome,
    householdDistrict: citizen.district
  };

  const systemCPayload = {
    system_origin: 'MOCK_DO_HIGHER_EDUCATION_SYS_C',
    emis_student_id: 'EMIS-10928374',
    applicant_name: citizen.fullName,
    dob: citizen.dateOfBirth,
    secondary_school_pct: citizen.twelfthPercentage,
    parents_higher_edu_status: citizen.parentEducation
  };

  // 2. Standardized Common Data Model
  const standardizedModel = {
    fullName: citizen.fullName,
    dateOfBirth: citizen.dateOfBirth,
    mobile: citizen.mobile,
    address: citizen.address,
    district: citizen.district,
    annualFamilyIncome: citizen.annualFamilyIncome,
    twelfthPercentage: citizen.twelfthPercentage,
    parentEducation: citizen.parentEducation,
    community: citizen.community
  };

  // 3. Target Department Form Mappings
  const targetDepartmentPayloads = {
    firstGenerationGraduateDepartment: mapCommonToTargetServiceFormat(standardizedModel, 'SRV-FGB-01'),
    engineeringCounsellingSystem: mapCommonToTargetServiceFormat(standardizedModel, 'SRV-ENG-02'),
    postMatricScholarshipSystem: mapCommonToTargetServiceFormat(standardizedModel, 'SRV-SCH-03')
  };

  res.json({
    success: true,
    title: 'CivicBridge AI Multi-Department Interoperability Mapping Demonstration',
    sources: [
      { name: 'Government System A (Population Register)', rawData: systemAPayload, fieldMap: { full_name: 'fullName', date_of_birth: 'dateOfBirth', mobile_number: 'mobile', residential_address: 'address' } },
      { name: 'Government System B (Revenue Income Portal)', rawData: systemBPayload, fieldMap: { candidateName: 'fullName', dateOfBirth: 'dateOfBirth', verifiedAnnualIncome: 'annualFamilyIncome', householdDistrict: 'district' } },
      { name: 'Government System C (Higher Education Portal)', rawData: systemCPayload, fieldMap: { applicant_name: 'fullName', dob: 'dateOfBirth', secondary_school_pct: 'twelfthPercentage', parents_higher_edu_status: 'parentEducation' } }
    ],
    commonDataModel: standardizedModel,
    targets: [
      { department: 'Department of Higher Education (First Gen Benefit)', payload: targetDepartmentPayloads.firstGenerationGraduateDepartment },
      { department: 'Directorate of Technical Education (Engineering Counselling)', payload: targetDepartmentPayloads.engineeringCounsellingSystem },
      { department: 'BC & Minority Welfare (Post-Matric Scholarship)', payload: targetDepartmentPayloads.postMatricScholarshipSystem }
    ]
  });
};

module.exports = { getMappingDemoData };
