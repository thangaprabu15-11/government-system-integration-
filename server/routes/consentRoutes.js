const express = require('express');
const router = express.Router();
const { getConsents, grantConsent, revokeConsent } = require('../controllers/consentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getConsents);
router.post('/', authenticateToken, grantConsent);
router.post('/grant', authenticateToken, grantConsent);
router.post('/revoke', authenticateToken, revokeConsent);
router.delete('/:id', authenticateToken, revokeConsent);

module.exports = router;

