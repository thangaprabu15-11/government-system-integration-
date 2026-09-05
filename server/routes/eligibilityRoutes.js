const express = require('express');
const router = express.Router();
const { checkEligibility, verifyRequirements, getRecommendations } = require('../controllers/eligibilityController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/check', authenticateToken, checkEligibility);
router.post('/check/:serviceId', authenticateToken, checkEligibility);
router.get('/check/:serviceId', authenticateToken, checkEligibility);
router.post('/verify/:serviceId', authenticateToken, verifyRequirements);
router.get('/recommendations', authenticateToken, getRecommendations);

module.exports = router;
