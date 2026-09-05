/**
 * CivicBridge AI Data Standardization & Mapping Engine
 * 
 * Takes heterogeneous data formats from distinct government department APIs
 * and normalizes them into the CivicBridge Common Citizen Data Model.
 */

// CivicBridge Common Citizen Data Schema
const createEmptyCommonModel = () => ({
  fullName: '',
  dateOfBirth: '',
  gender: '',
  mobile: '',
  email: '',
  address: '',
  district: '',
  state: '',
  educationLevel: '',
  twelfthPercentage: null,
  collegeName: '',
  coursePreferred: '',
  parentEducation: '',
  annualFamilyIncome: null,
  community: '',
  documents: [],
  sourceMetadata: {}
});

// Map System A (Citizen Registry / Population Register)
const mapSystemAToCommon = (rawSystemAData) => {
  return {
    fullName: rawSystemAData.full_name || '',
    dateOfBirth: rawSystemAData.date_of_birth || '',
    gender: rawSystemAData.gender_code || 'Specified in Profile',
    mobile: rawSystemAData.mobile_number || '',
    email: rawSystemAData.email_id || '',
    address: rawSystemAData.residential_address || '',
    district: rawSystemAData.district_code || '',
    state: rawSystemAData.state_code || 'Tamil Nadu',
    sourceMetadata: {
      systemOrigin: rawSystemAData.system_origin || 'MOCK_GOV_CITIZEN_REGISTRY_SYS_A',
      uid: rawSystemAData.citizen_uid
    }
  };
};

// Map System B (Revenue Income Portal)
const mapSystemBToCommon = (rawSystemBData) => {
  return {
    fullName: rawSystemBData.candidateName || '',
    dateOfBirth: rawSystemBData.dateOfBirth || '',
    annualFamilyIncome: rawSystemBData.verifiedAnnualIncome !== undefined ? rawSystemBData.verifiedAnnualIncome : null,
    district: rawSystemBData.householdDistrict || '',
    fatherName: rawSystemBData.fatherName || '',
    sourceMetadata: {
      systemOrigin: rawSystemBData.system_origin || 'MOCK_REVENUE_INCOME_PORTAL_SYS_B',
      certificateNo: rawSystemBData.incomeCertNo
    }
  };
};

// Map System C (Higher Education / DoTE Portal)
const mapSystemCToCommon = (rawSystemCData) => {
  return {
    fullName: rawSystemCData.applicant_name || '',
    dateOfBirth: rawSystemCData.dob || '',
    twelfthPercentage: rawSystemCData.secondary_school_pct !== undefined ? rawSystemCData.secondary_school_pct : null,
    collegeName: rawSystemCData.college_enrolled || '',
    coursePreferred: rawSystemCData.preferred_course || '',
    parentEducation: rawSystemCData.parents_higher_edu_status || '',
    isFirstGenerationGraduateCandidate: rawSystemCData.first_gen_graduate_eligible_flag === 'YES',
    sourceMetadata: {
      systemOrigin: rawSystemCData.system_origin || 'MOCK_DO_HIGHER_EDUCATION_SYS_C',
      emisId: rawSystemCData.emis_student_id
    }
  };
};

// Map Caste Registry
const mapCasteRegistryToCommon = (rawCasteData) => {
  return {
    fullName: rawCasteData.applicantName || '',
    community: rawCasteData.casteCommunityGroup || '',
    district: rawCasteData.issuedDistrict || '',
    sourceMetadata: {
      systemOrigin: rawCasteData.system_origin || 'MOCK_CASTE_COMMUNITY_REGISTRY',
      certificateNumber: rawCasteData.certificateNumber
    }
  };
};

/**
 * Merge multiple heterogeneous API payloads into a single, cohesive Common Citizen Model
 */
const standardizeAndAggregate = (profile, apiResults = {}) => {
  const common = createEmptyCommonModel();

  // 1. Seed with citizen profile baseline
  if (profile) {
    Object.assign(common, {
      fullName: profile.fullName || '',
      dateOfBirth: profile.dateOfBirth || '',
      gender: profile.gender || '',
      mobile: profile.mobile || '',
      email: profile.email || '',
      address: profile.address || '',
      district: profile.district || '',
      state: profile.state || '',
      educationLevel: profile.educationLevel || '',
      twelfthPercentage: profile.twelfthPercentage || null,
      collegeName: profile.collegeName || '',
      coursePreferred: profile.coursePreferred || '',
      parentEducation: profile.parentEducation || '',
      annualFamilyIncome: profile.annualFamilyIncome || null,
      community: profile.community || ''
    });
  }

  // 2. Merge System A if present
  if (apiResults.systemA) {
    const stdA = mapSystemAToCommon(apiResults.systemA);
    if (stdA.fullName) common.fullName = stdA.fullName;
    if (stdA.mobile) common.mobile = stdA.mobile;
    if (stdA.address) common.address = stdA.address;
  }

  // 3. Merge System B (Income) if present
  if (apiResults.systemB) {
    const stdB = mapSystemBToCommon(apiResults.systemB);
    if (stdB.annualFamilyIncome !== null) common.annualFamilyIncome = stdB.annualFamilyIncome;
    if (stdB.fatherName) common.fatherName = stdB.fatherName;
  }

  // 4. Merge System C (Education) if present
  if (apiResults.systemC) {
    const stdC = mapSystemCToCommon(apiResults.systemC);
    if (stdC.twelfthPercentage) common.twelfthPercentage = stdC.twelfthPercentage;
    if (stdC.parentEducation) common.parentEducation = stdC.parentEducation;
    if (stdC.collegeName) common.collegeName = stdC.collegeName;
  }

  // 5. Merge Caste Registry if present
  if (apiResults.casteRegistry) {
    const stdCaste = mapCasteRegistryToCommon(apiResults.casteRegistry);
    if (stdCaste.community) common.community = stdCaste.community;
  }

  return common;
};

// Map Common Citizen Model into Target Department Format for Form Auto-Fill
const mapCommonToTargetServiceFormat = (commonModel, serviceId) => {
  switch (serviceId) {
    case 'SRV-FGB-01':
      return {
        applicant_full_name: commonModel.fullName,
        date_of_birth_iso: commonModel.dateOfBirth,
        educational_qualification: commonModel.educationLevel,
        enrolled_institution: commonModel.collegeName,
        parents_educational_attainment: commonModel.parentEducation,
        verified_annual_family_income: commonModel.annualFamilyIncome,
        residential_address_full: commonModel.address
      };

    case 'SRV-ENG-02':
      return {
        candidateName: commonModel.fullName,
        dob_ddmmyyyy: commonModel.dateOfBirth ? commonModel.dateOfBirth.split('-').reverse().join('/') : '',
        cutoff_marks: commonModel.twelfthPercentage ? (commonModel.twelfthPercentage * 2).toFixed(1) : '',
        communityCategory: commonModel.community,
        contactMobile: commonModel.mobile,
        permanentAddress: commonModel.address
      };

    case 'SRV-SCH-03':
      return {
        student_name: commonModel.fullName,
        dob: commonModel.dateOfBirth,
        institution_name: commonModel.collegeName,
        course_name: commonModel.coursePreferred,
        family_income: commonModel.annualFamilyIncome,
        category: commonModel.community
      };

    default:
      return {
        fullName: commonModel.fullName,
        dateOfBirth: commonModel.dateOfBirth,
        annualIncome: commonModel.annualFamilyIncome,
        community: commonModel.community,
        address: commonModel.address
      };
  }
};

module.exports = {
  mapSystemAToCommon,
  mapSystemBToCommon,
  mapSystemCToCommon,
  mapCasteRegistryToCommon,
  standardizeAndAggregate,
  mapCommonToTargetServiceFormat
};
