const store = require('../utils/store');

class IncomeConnector {
  static async fetchIncomeData(citizenId) {
    const citizen = store.profiles.find(p => p.mobile === citizenId || p.userId === citizenId) || store.profiles[0];
    return {
      system_origin: 'MOCK_REVENUE_INCOME_PORTAL_SYS_B',
      incomeCertNo: 'INC-2026-88192',
      candidateName: citizen.fullName,
      dateOfBirth: citizen.dateOfBirth,
      fatherName: citizen.fatherName,
      verifiedAnnualIncome: citizen.annualFamilyIncome,
      householdDistrict: citizen.district
    };
  }

  static async submitIncomeCertApplication(payload) {
    return {
      success: true,
      ackId: `INC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Submitted'
    };
  }
}

module.exports = IncomeConnector;
