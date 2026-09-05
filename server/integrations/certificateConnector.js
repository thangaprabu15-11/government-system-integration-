const store = require('../utils/store');

class CertificateConnector {
  static async fetchCommunityCertificate(citizenId) {
    const citizen = store.profiles.find(p => p.mobile === citizenId || p.userId === citizenId) || store.profiles[0];
    return {
      system_origin: 'MOCK_CASTE_COMMUNITY_REGISTRY',
      certificateNumber: 'COM-2026-11029',
      applicantName: citizen.fullName,
      casteCommunityGroup: citizen.community,
      issuedDistrict: citizen.district
    };
  }

  static async submitCertificateApp(payload) {
    return {
      success: true,
      ackId: `COM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Submitted'
    };
  }
}

module.exports = CertificateConnector;
