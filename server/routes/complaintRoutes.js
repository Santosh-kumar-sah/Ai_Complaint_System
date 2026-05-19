// server/routes/complaintRoutes.js | Complaint routes | Author: SmartComplain | Date: 2026-05-19
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
  createValidators,
  updateValidators
} = require('../controllers/complaintController');

router.use(protect);

router.get('/search', searchComplaints);
router.get('/', getComplaints);
router.post('/', createValidators, validate, createComplaint);
router.get('/:id', getComplaintById);
router.put('/:id', updateValidators, validate, updateComplaint);
router.delete('/:id', adminOnly, deleteComplaint);

module.exports = router;