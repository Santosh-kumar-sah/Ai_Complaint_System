// client/src/components/complaints/ComplaintCard.jsx | Complaint summary card | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Eye } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate, getCategoryEmoji, getPriorityColor, getStatusColor, truncateText } from '../../utils/helpers';

const ComplaintCard = ({ complaint }) => (
  <div className="card group transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">{getCategoryEmoji(complaint.category)}</span>
          <Badge className="bg-indigo-500/15 text-indigo-300">{complaint.category}</Badge>
        </div>
        <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
      </div>
      <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
    </div>

    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
      <MapPin size={16} />
      <span>{complaint.location}</span>
    </div>

    <p className="mt-3 text-sm leading-6 text-slate-400">{truncateText(complaint.description, 140)}</p>

    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
      <span className="inline-flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays size={14} />
        {formatDate(complaint.createdAt)}
      </span>
    </div>

    <div className="mt-5">
      <Link to={`/complaints/${complaint._id}`} className="btn-secondary w-full justify-center">
        <Eye size={16} /> View Details
      </Link>
    </div>
  </div>
);

ComplaintCard.propTypes = {
  complaint: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired
};

export default ComplaintCard;