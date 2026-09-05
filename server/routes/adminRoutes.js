const express = require('express');
const router = express.Router();
const { getDashboardStats, getApiLogs, getAuditLogs, pingConnector } = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, getDashboardStats);
router.get('/api-logs', authenticateToken, getApiLogs);
router.get('/audit-logs', authenticateToken, getAuditLogs);
router.post('/ping', authenticateToken, pingConnector);

module.exports = router;
