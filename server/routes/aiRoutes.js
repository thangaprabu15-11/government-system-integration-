const express = require('express');
const router = express.Router();
const { understandIntent, recommendServices } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/understand', authenticateToken, understandIntent);
router.get('/recommend', authenticateToken, recommendServices);

module.exports = router;
