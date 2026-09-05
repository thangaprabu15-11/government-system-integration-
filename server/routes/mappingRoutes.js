const express = require('express');
const router = express.Router();
const { getMappingDemoData } = require('../controllers/mappingController');

router.get('/demo', getMappingDemoData);

module.exports = router;
