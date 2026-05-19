// client/src/constants/index.js | Shared constants and API routes | Author: SmartComplain | Date: 2026-05-19
export const CATEGORIES = ['Water Supply', 'Electricity', 'Roads', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other'];

export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me'
  },
  complaints: {
    root: '/complaints',
    search: '/complaints/search'
  },
  ai: {
    analyze: '/ai/analyze'
  },
  assistant: {
    message: '/assistant/message'
  }
};

export const CATEGORY_EMOJIS = {
  'Water Supply': '💧',
  Electricity: '⚡',
  Roads: '🛣️',
  Sanitation: '🗑️',
  'Public Safety': '🛡️',
  Healthcare: '🏥',
  Education: '🎓',
  Other: '📋'
};

export const STATUS_COLORS = {
  Pending: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Resolved: 'bg-green-500/20 text-green-300 border border-green-500/30',
  Rejected: 'bg-red-500/20 text-red-300 border border-red-500/30'
};

export const PRIORITY_COLORS = {
  Low: 'bg-green-500/20 text-green-300 border border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  Critical: 'bg-red-500/20 text-red-300 border border-red-500/30'
};