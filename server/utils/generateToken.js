// server/utils/generateToken.js | JWT token generation utility | Author: SmartComplain | Date: 2026-05-19
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

module.exports = generateToken;