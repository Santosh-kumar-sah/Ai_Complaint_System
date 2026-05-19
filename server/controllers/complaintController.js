// server/controllers/complaintController.js | Complaint CRUD controller | Author: SmartComplain | Date: 2026-05-19
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

const complaintCategories = ['Water Supply', 'Electricity', 'Roads', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other'];
const complaintStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const complaintPriorities = ['Low', 'Medium', 'High', 'Critical'];

const createValidators = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Email is required'),
  body('title').notEmpty().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').notEmpty().trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category').notEmpty().isIn(complaintCategories).withMessage('Category is required'),
  body('location').notEmpty().trim().withMessage('Location is required')
];

const updateValidators = [
  body('status').optional().isIn(complaintStatuses),
  body('priority').optional().isIn(complaintPriorities),
  body('title').optional().isLength({ min: 5 }),
  body('description').optional().isLength({ min: 20 }),
  body('category').optional().isIn(complaintCategories),
  body('location').optional().trim()
];

const buildSearchFilter = (req, baseFilter) => {
  const filter = { ...baseFilter };
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { location: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
  return filter;
};

const createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const complaint = await Complaint.create({
    user: req.user.id,
    name: req.body.name,
    email: req.body.email,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: req.body.location
  });

  return res.status(201).json({ success: true, complaint });
};

const getComplaints = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const baseFilter = isAdmin ? {} : { user: req.user.id };
  const filter = buildSearchFilter(req, baseFilter);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Complaint.countDocuments(filter)
  ]);

  return res.status(200).json({
    success: true,
    complaints,
    total,
    page,
    pages: Math.ceil(total / limit)
  });
};

const getComplaintById = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate('user', 'name email role');
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const isOwner = String(complaint.user._id) === String(req.user.id);
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  return res.status(200).json({ success: true, complaint });
};

const updateComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const isOwner = String(complaint.user) === String(req.user.id);
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  if (req.user.role !== 'admin' && (req.body.status || req.body.priority)) {
    return res.status(403).json({ success: false, message: 'Only admins can change status or priority' });
  }

  if (req.user.role === 'admin') {
    if (req.body.status) complaint.status = req.body.status;
    if (req.body.priority) complaint.priority = req.body.priority;
  }

  if (isOwner && complaint.status === 'Pending') {
    if (req.body.title) complaint.title = req.body.title;
    if (req.body.description) complaint.description = req.body.description;
    if (req.body.category) complaint.category = req.body.category;
    if (req.body.location) complaint.location = req.body.location;
  }

  await complaint.save();
  const populated = await Complaint.findById(complaint._id).populate('user', 'name email role');
  return res.status(200).json({ success: true, complaint: populated });
};

const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const isOwner = String(complaint.user) === String(req.user.id);
  const canDelete = req.user.role === 'admin' || (isOwner && complaint.status === 'Pending');
  if (!canDelete) {
    return res.status(403).json({ success: false, message: 'You can delete only your pending complaints' });
  }

  await complaint.deleteOne();
  return res.status(200).json({ success: true, message: 'Complaint deleted' });
};

const searchComplaints = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const filter = isAdmin ? {} : { user: req.user.id };
  if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
  if (req.query.category) filter.category = req.query.category;
  const complaints = await Complaint.find(filter).populate('user', 'name email role').sort({ createdAt: -1 });
  return res.status(200).json({ success: true, complaints });
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
  createValidators,
  updateValidators
};