const store = require('../utils/store');

class CounsellingConnector {
  static async submitApplication(payload) {
    return {
      success: true,
      ackId: `COUN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Submitted',
      cutoffMarks: payload.twelfthPercentage ? (payload.twelfthPercentage * 2).toFixed(1) : '182.5'
    };
  }
}

module.exports = CounsellingConnector;
