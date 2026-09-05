const axios = require('axios');
const store = require('../utils/store');

class EducationConnector {
  static async fetchEducationData(citizenId) {
    try {
      // In internal server environment, simulate direct internal API dispatcher
      const citizen = store.profiles.find(p => p.mobile === citizenId || p.userId === citizenId) || store.profiles[0];
      return {
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
    } catch (error) {
      console.error('[EducationConnector] Error:', error.message);
      throw error;
    }
  }

  static async submitFirstGenerationGraduateApp(payload) {
    return {
      success: true,
      ackId: `FGB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Submitted',
      message: 'Application disaptched to Department of Higher Education portal.'
    };
  }
}

module.exports = EducationConnector;
