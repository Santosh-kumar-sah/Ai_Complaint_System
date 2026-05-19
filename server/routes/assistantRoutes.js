// server/routes/assistantRoutes.js | Smart assistant routes | Author: SmartComplain | Date: 2026-05-19
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, messageValidators } = require('../controllers/assistantController');

router.post('/message', protect, messageValidators, validate, sendMessage);

module.exports = router;