// client/src/components/complaints/ComplaintTable.jsx | Complaint table view | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatDate, getPriorityColor, getStatusColor } from '../../utils/helpers';

const ComplaintTable = ({ complaints, onEdit, onDelete, currentPage, pageSize, isAdmin }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/70 shadow-xl">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
        <thead className="sticky top-0 bg-slate-900 text-slate-300">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {complaints.map((complaint, index) => (
            <tr key={complaint._id} className="bg-slate-900/20 transition hover:bg-slate-700/50">
              <td className="px-4 py-4 text-slate-400">{(currentPage - 1) * pageSize + index + 1}</td>
              <td className="px-4 py-4 font-medium text-white">{complaint.title}</td>
              <td className="px-4 py-4 text-slate-300">{complaint.category}</td>
              <td className="px-4 py-4 text-slate-300">{complaint.location}</td>
              <td className="px-4 py-4"><Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge></td>
              <td className="px-4 py-4"><Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge></td>
              <td className="px-4 py-4 text-slate-400">{formatDate(complaint.createdAt)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Link to={`/complaints/${complaint._id}`} className="rounded-xl bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white">
                    <Eye size={16} />
                  </Link>
                  {isAdmin ? (
                    <>
                      <button type="button" onClick={() => onEdit(complaint)} className="rounded-xl bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => onDelete(complaint)} className="rounded-xl bg-slate-800 p-2 text-slate-300 transition hover:bg-red-500/10 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

ComplaintTable.propTypes = {
  complaints: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool
};

export default ComplaintTable;