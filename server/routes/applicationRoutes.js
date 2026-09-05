const express = require('express');
const router = express.Router();
const {
  getRequiredDataStatus,
  prepareApplication,
  submitApplication,
  getUserApplications,
  getApplicationById
} = require('../controllers/applicationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/required/:serviceId', authenticateToken, getRequiredDataStatus);
router.post('/prepare', authenticateToken, prepareApplication);
router.post('/submit', authenticateToken, submitApplication);
router.get('/', authenticateToken, getUserApplications);
router.get('/:id', authenticateToken, getApplicationById);

module.exports = router;
