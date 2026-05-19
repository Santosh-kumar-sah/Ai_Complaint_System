// server/routes/aiRoutes.js | AI analysis routes | Author: SmartComplain | Date: 2026-05-19
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzeComplaint } = require('../controllers/aiController');

router.post('/analyze', protect, analyzeComplaint);

module.exports = router;