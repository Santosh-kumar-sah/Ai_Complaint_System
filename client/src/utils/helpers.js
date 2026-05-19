// client/src/utils/helpers.js | Shared formatting and color helpers | Author: SmartComplain | Date: 2026-05-19
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CATEGORY_EMOJIS, PRIORITY_COLORS, STATUS_COLORS } from '../constants';

dayjs.extend(relativeTime);

export const formatDate = (date) => dayjs(date).format('DD MMM YYYY');

export const formatDateTime = (date) => dayjs(date).format('DD MMM YYYY, h:mm A');

export const timeAgo = (date) => dayjs(date).fromNow();

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const getPriorityColor = (priority) => PRIORITY_COLORS[priority] || 'bg-slate-500/20 text-slate-300 border border-slate-500/30';

export const getStatusColor = (status) => STATUS_COLORS[status] || 'bg-slate-500/20 text-slate-300 border border-slate-500/30';

export const getCategoryEmoji = (category) => CATEGORY_EMOJIS[category] || '📋';

export const truncateText = (text = '', maxLength = 100) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}...` : text;