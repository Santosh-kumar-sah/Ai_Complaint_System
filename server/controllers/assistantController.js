// server/controllers/assistantController.js | Natural language assistant controller | Author: SmartComplain | Date: 2026-05-19
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const complaintCategories = ['Water Supply', 'Electricity', 'Roads', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other'];
const complaintStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const complaintPriorities = ['Low', 'Medium', 'High', 'Critical'];

const messageValidators = [body('message').notEmpty().trim().withMessage('Message is required')];

const keywordMap = [
  { category: 'Water Supply', words: ['water', 'pipeline', 'leak', 'leakage', 'tap', 'tank'] },
  { category: 'Electricity', words: ['electric', 'power', 'light', 'street light', 'electricity'] },
  { category: 'Roads', words: ['road', 'pothole', 'traffic', 'highway', 'street', 'bridge'] },
  { category: 'Sanitation', words: ['garbage', 'waste', 'drainage', 'sewage', 'sanitation', 'smell'] },
  { category: 'Public Safety', words: ['theft', 'crime', 'safety', 'robbery', 'assault', 'police'] },
  { category: 'Healthcare', words: ['hospital', 'health', 'medical', 'doctor', 'patient'] },
  { category: 'Education', words: ['school', 'college', 'teacher', 'education', 'classroom'] }
];

const normalize = (value = '') => value.toLowerCase().replace(/\s+/g, ' ').trim();

const inferCategory = (message) => {
  const text = normalize(message);
  const match = keywordMap.find((item) => item.words.some((word) => text.includes(word)));
  return match ? match.category : 'Other';
};

const inferPriority = (message) => {
  const text = normalize(message);
  if (['urgent', 'critical', 'danger', 'accident', 'fire', 'theft', 'severe'].some((word) => text.includes(word))) return 'Critical';
  if (['not working', 'broken', 'stopped', 'leak', 'overflow', 'attack', 'unsafe'].some((word) => text.includes(word))) return 'High';
  if (['delay', 'slow', 'missing', 'late', 'issue'].some((word) => text.includes(word))) return 'Medium';
  return 'Low';
};

const inferUrgency = (priority) => {
  if (priority === 'Critical') return 'Critical';
  if (priority === 'High') return 'High';
  if (priority === 'Medium') return 'Medium';
  return 'Low';
};

const inferDepartment = (category) => {
  const map = {
    'Water Supply': 'Water Supply Department',
    Electricity: 'Electricity Department',
    Roads: 'Public Works Department',
    Sanitation: 'Sanitation Department',
    'Public Safety': 'Police / Public Safety',
    Healthcare: 'Health Department',
    Education: 'Education Department',
    Other: 'General Administration'
  };
  return map[category] || 'General Administration';
};

const extractLocation = (message) => {
  const text = normalize(message);
  const match = text.match(/(?:at|in|near|around)\s+([a-z0-9][a-z0-9\s,'-]{1,40})/i);
  if (!match) return 'Not specified';
  return match[1].replace(/\b(please|kindly|help|my|our|the)\b.*$/i, '').trim() || 'Not specified';
};

const extractTitle = (message, category) => {
  const text = normalize(message);
  const aboutMatch = text.match(/(?:about|regarding|issue with|problem with)\s+(.+?)(?:\.|,| at | in | near | around |$)/i);
  if (aboutMatch?.[1]) {
    const title = aboutMatch[1].trim();
    return title.length > 5 ? title.slice(0, 60) : `${category} complaint`;
  }

  const words = text.split(' ').slice(0, 6);
  const fallback = words.join(' ');
  return fallback.length > 5 ? fallback.slice(0, 60) : `${category} complaint`;
};

const buildAnalysis = (title, description, category, priority) => {
  const urgency = inferUrgency(priority);
  const department = inferDepartment(category);

  return {
    urgency,
    department,
    autoResponse: `Dear citizen, your complaint about ${title} has been recorded and assigned to the ${department}. The concerned team will review it promptly and take the necessary action.`,
    summary: `Complaint about ${category.toLowerCase()} reported through the SmartComplain assistant.`,
    priorityScore: urgency === 'Critical' ? 9 : urgency === 'High' ? 7 : urgency === 'Medium' ? 5 : 3
  };
};

const getIntent = (message) => {
  const text = normalize(message);
  if (/(register|create|file|submit).*(complaint|issue|problem)/i.test(text)) return 'create_complaint';
  if (/(show|list|get|my).*(complaint|complaints|issues|tickets)/i.test(text)) return 'list_complaints';
  if (/(analyze|analyse|check).*(complaint|issue|ticket)/i.test(text)) return 'analyze_complaint';
  if (/(help|what can you do|commands|options)/i.test(text)) return 'help';
  return 'chat';
};

const buildHelpReply = () => ({
  reply: 'I can create complaints, show your latest complaints, and help you analyze an issue. Try: "Register a water pipeline complaint in Ghaziabad" or "Show my complaints".',
  suggestions: [
    'Register a complaint about water leakage in Noida',
    'Show my latest complaints',
    'Analyze this complaint text'
  ]
});

const targetStopWords = new Set([
  'the', 'a', 'an', 'my', 'this', 'that', 'these', 'those', 'complaint', 'complaints', 'issue', 'issues', 'ticket', 'tickets',
  'about', 'regarding', 'for', 'of', 'on', 'in', 'at', 'near', 'around', 'status', 'priority', 'update', 'updated', 'change',
  'changed', 'set', 'mark', 'marked', 'delete', 'deleted', 'remove', 'removed', 'show', 'tell', 'give', 'what', 'is', 'are',
  'was', 'were', 'please', 'kindly', 'latest', 'current', 'open', 'pending'
]);

const parseComplaintTarget = (message) => {
  const text = normalize(message);
  const idMatch = text.match(/\b[a-f0-9]{24}\b/i);
  const statusMatch = complaintStatuses.find((status) => text.includes(status.toLowerCase()));
  const priorityMatch = complaintPriorities.find((priority) => text.includes(priority.toLowerCase()));
  const targetText = text
    .replace(/\b(?:status|priority)\b.*$/i, ' ')
    .replace(/\b(?:mark|set|change|update|delete|remove|show|tell|give|what|is|are)\b/g, ' ');
  const targetTerms = [...new Set(targetText.split(/[^a-z0-9]+/i).filter((word) => word.length > 2 && !targetStopWords.has(word)))].slice(0, 6);

  return {
    complaintId: idMatch?.[0] || null,
    status: statusMatch || null,
    priority: priorityMatch || null,
    targetTerms
  };
};

const findTargetComplaint = async (req, message) => {
  const { complaintId, targetTerms } = parseComplaintTarget(message);
  if (complaintId) {
    const complaint = await Complaint.findById(complaintId).populate('user', 'name email role');
    return complaint;
  }

  const isAdmin = req.user.role === 'admin';
  const filter = isAdmin ? {} : { user: req.user.id };

  if (targetTerms.length) {
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).populate('user', 'name email role');
    const scoredComplaints = complaints
      .map((complaint) => {
        const haystack = normalize([
          complaint.title,
          complaint.description,
          complaint.category,
          complaint.location,
          complaint.status,
          complaint.priority
        ].join(' '));

        const score = targetTerms.reduce((total, term) => {
          if (haystack.includes(term)) return total + 2;
          return total;
        }, 0);

        return { complaint, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.complaint.createdAt - a.complaint.createdAt);

    if (scoredComplaints.length) {
      return scoredComplaints[0].complaint;
    }
  }

  const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).limit(1).populate('user', 'name email role');
  return complaints[0] || null;
};

const handleCreateComplaint = async (req, res, message) => {
  const currentUser = await User.findById(req.user.id).select('name email role');
  const category = inferCategory(message);
  const priority = inferPriority(message);
  const title = extractTitle(message, category);
  const location = extractLocation(message);
  const description = message.trim();

  const complaint = await Complaint.create({
    user: req.user.id,
    name: currentUser?.name || 'SmartComplain User',
    email: currentUser?.email || 'unknown@example.com',
    title,
    description,
    category,
    location,
    priority,
    aiAnalysis: {
      ...buildAnalysis(title, description, category, priority),
      analyzedAt: new Date()
    }
  });

  const populatedComplaint = await Complaint.findById(complaint._id).populate('user', 'name email role');

  return res.status(201).json({
    success: true,
    intent: 'create_complaint',
    reply: `Complaint registered successfully. I also classified it as ${category} and set its priority to ${priority}.`,
    complaint: populatedComplaint,
    analysis: complaint.aiAnalysis,
    suggestions: [
      'View complaint details',
      'Ask me to show your latest complaints',
      'Ask me to analyze another issue'
    ]
  });
};

const handleListComplaints = async (req, res, message) => {
  const isAdmin = req.user.role === 'admin';
  const filter = isAdmin ? {} : { user: req.user.id };
  const text = normalize(message);

  if (complaintStatuses.some((status) => text.includes(status.toLowerCase()))) {
    filter.status = complaintStatuses.find((status) => text.includes(status.toLowerCase()));
  }

  if (complaintPriorities.some((priority) => text.includes(priority.toLowerCase()))) {
    filter.priority = complaintPriorities.find((priority) => text.includes(priority.toLowerCase()));
  }

  const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).limit(5).populate('user', 'name email role');

  return res.status(200).json({
    success: true,
    intent: 'list_complaints',
    reply: complaints.length ? `I found ${complaints.length} complaint(s).` : 'I could not find any complaints matching that request.',
    complaints,
    suggestions: complaints.length ? ['Show more details for one complaint', 'Create a new complaint'] : ['Create a new complaint']
  });
};

const handleAnalyzeOnly = async (req, res, message) => {
  const category = inferCategory(message);
  const priority = inferPriority(message);
  const title = extractTitle(message, category);
  const analysis = buildAnalysis(title, message, category, priority);

  return res.status(200).json({
    success: true,
    intent: 'analyze_complaint',
    reply: 'I analyzed the issue and prepared a suggested routing.',
    analysis,
    suggestions: ['Register this complaint now', 'Edit the complaint details first']
  });
};

const handleStatusUpdate = async (req, res, message) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const target = await findTargetComplaint(req, message);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const { status, priority } = parseComplaintTarget(message);
  if (!status && !priority) {
    return res.status(400).json({ success: false, message: 'Please specify a status or priority to update' });
  }

  if (status) target.status = status;
  if (priority) target.priority = priority;
  await target.save();

  const updatedComplaint = await Complaint.findById(target._id).populate('user', 'name email role');

  return res.status(200).json({
    success: true,
    intent: 'update_complaint',
    reply: `Complaint updated successfully. Status is now ${updatedComplaint.status} and priority is ${updatedComplaint.priority}.`,
    complaint: updatedComplaint,
    suggestions: ['Delete this complaint', 'Show my latest complaints', 'Analyze another issue']
  });
};

const handleDeleteComplaint = async (req, res, message) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const target = await findTargetComplaint(req, message);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const deletedTitle = target.title;
  await target.deleteOne();

  return res.status(200).json({
    success: true,
    intent: 'delete_complaint',
    reply: `Complaint "${deletedTitle}" has been deleted successfully.`,
    suggestions: ['Show my latest complaints', 'Register a new complaint']
  });
};

const handleQuestion = async (req, res, message) => {
  const target = await findTargetComplaint(req, message);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const text = normalize(message);
  if (text.includes('status')) {
    return res.status(200).json({
      success: true,
      intent: 'answer_question',
      reply: `The complaint "${target.title}" is currently ${target.status} with ${target.priority} priority.`,
      complaint: target,
      suggestions: req.user.role === 'admin' ? ['Mark this as resolved', 'Delete this complaint'] : ['Show my latest complaints']
    });
  }

  if (text.includes('priority')) {
    return res.status(200).json({
      success: true,
      intent: 'answer_question',
      reply: `The complaint "${target.title}" has ${target.priority} priority and is routed to ${target.category}.`,
      complaint: target,
      suggestions: req.user.role === 'admin' ? ['Update the status', 'Delete this complaint'] : ['Create a new complaint']
    });
  }

  return res.status(200).json({
    success: true,
    intent: 'answer_question',
    reply: `I found the complaint "${target.title}". It is currently ${target.status} and assigned to ${target.category} in ${target.location}.`,
    complaint: target,
    suggestions: ['Ask about its status', 'Ask about its priority']
  });
};

const getIntentWithActions = (message) => {
  const text = normalize(message);
  if (/(delete|remove|discard).*(complaint|issue|ticket)/i.test(text)) return 'delete_complaint';
  if (/(mark|set|change|update).*(status|priority)/i.test(text)) return 'update_complaint';
  if (/(mark|set|change|update|move|make).*(resolved|pending|in progress|rejected|high|medium|low|critical)/i.test(text)) return 'update_complaint';
  if (complaintStatuses.some((status) => text.includes(status.toLowerCase())) && /(mark|set|change|update|move|make)/i.test(text)) return 'update_complaint';
  if (/(what|tell|show|give).*(status|priority|complaint)/i.test(text)) return 'answer_question';
  return getIntent(message);
};

const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const message = String(req.body.message || '').trim();
  const intent = getIntentWithActions(message);

  try {
    if (intent === 'create_complaint') {
      return await handleCreateComplaint(req, res, message);
    }

    if (intent === 'list_complaints') {
      return await handleListComplaints(req, res, message);
    }

    if (intent === 'analyze_complaint') {
      return await handleAnalyzeOnly(req, res, message);
    }

    if (intent === 'update_complaint') {
      return await handleStatusUpdate(req, res, message);
    }

    if (intent === 'delete_complaint') {
      return await handleDeleteComplaint(req, res, message);
    }

    if (intent === 'answer_question') {
      return await handleQuestion(req, res, message);
    }

    if (intent === 'help') {
      return res.status(200).json({ success: true, intent: 'help', ...buildHelpReply() });
    }

    return res.status(200).json({
      success: true,
      intent: 'chat',
      reply: 'I can help you register complaints automatically or show your recent complaints. Tell me the issue in plain language and I will handle the rest.',
      suggestions: ['Register a complaint', 'Show my complaints', 'Help me analyze an issue']
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Assistant request failed',
      error: error.message
    });
  }
};

module.exports = { sendMessage, messageValidators };