// server/models/Complaint.js | Complaint model and indexes | Author: SmartComplain | Date: 2026-05-19
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Water Supply', 'Electricity', 'Roads', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other']
  },
  location: { type: String, required: [true, 'Location is required'], trim: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  aiAnalysis: {
    urgency: { type: String },
    department: { type: String },
    autoResponse: { type: String },
    summary: { type: String },
    priorityScore: { type: Number },
    analyzedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ComplaintSchema.index({ location: 1 });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ user: 1 });

ComplaintSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', ComplaintSchema);