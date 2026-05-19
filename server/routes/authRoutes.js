// server/routes/authRoutes.js | Authentication routes | Author: SmartComplain | Date: 2026-05-19
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { register, login, getMe, registerValidators, loginValidators } = require('../controllers/authController');

router.post('/register', registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);
router.get('/me', protect, getMe);

module.exports = router;