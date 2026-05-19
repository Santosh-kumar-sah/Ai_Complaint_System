// client/src/pages/ComplaintDetail.jsx | Complaint detail view | Author: SmartComplain | Date: 2026-05-19
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Pencil, RefreshCw, Trash2, UserCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useComplaints from '../hooks/useComplaints';
import { API_ROUTES, PRIORITIES, STATUSES } from '../constants';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import AIResultPanel from '../components/complaints/AIResultPanel';
import { formatDateTime, getPriorityColor, getStatusColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { analyzeComplaint } = useComplaints();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');

  const loadComplaint = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${API_ROUTES.complaints.root}/${id}`);
      setComplaint(response.data.complaint);
      setStatus(response.data.complaint.status);
      setPriority(response.data.complaint.priority);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load complaint');
      navigate('/complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put(`${API_ROUTES.complaints.root}/${id}`, { status, priority });
      setComplaint(response.data.complaint);
      setStatus(response.data.complaint.status);
      setPriority(response.data.complaint.priority);
      toast.success('Complaint updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      await analyzeComplaint(id);
      toast.success('Complaint analyzed');
      loadComplaint();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analyze failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint?')) return;

    try {
      await api.delete(`${API_ROUTES.complaints.root}/${id}`);
      toast.success('Complaint deleted');
      navigate('/complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Spinner fullScreen label="Loading complaint..." />;
  if (!complaint) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link to="/complaints" className="btn-ghost"><ArrowLeft size={16} /> Back</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-white">{complaint.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                  <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-400 md:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center gap-2"><span>Category:</span> <span className="text-white">{complaint.category}</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} /> <span className="text-white">{complaint.location}</span></div>
              <div className="flex items-center gap-2"><CalendarDays size={14} /> <span className="text-white">{formatDateTime(complaint.createdAt)}</span></div>
              <div className="flex items-center gap-2"><UserCircle2 size={14} /> <span className="text-white">{complaint.user?.name || complaint.name}</span></div>
            </div>

            <div className="border-t border-slate-700 pt-4 text-slate-300 leading-7">{complaint.description}</div>
          </div>

          {isAdmin ? (
            <div className="card space-y-4">
              <h2 className="text-lg font-semibold text-white">Update Status</h2>
              <p className="text-sm text-slate-400">Only admins can update workflow status and priority.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Status</label>
                  <select className="input-field" value={status} onChange={(event) => setStatus(event.target.value)}>
                    {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select className="input-field" value={priority} onChange={(event) => setPriority(event.target.value)}>
                    {PRIORITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              </div>
              <button type="button" onClick={handleSave} className="btn-primary" disabled={saving}>
                <Pencil size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={handleDelete} className="btn-secondary border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20">
                <Trash2 size={16} /> Delete Complaint
              </button>
            </div>
          ) : null}

          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-white">Complaint Timeline</h2>
            <div className="space-y-4 border-l border-slate-700 pl-4">
              <div>
                <p className="text-sm font-medium text-white">Complaint Registered</p>
                <p className="text-xs text-slate-500">{formatDateTime(complaint.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Current Status: {complaint.status}</p>
                <p className="text-xs text-slate-500">Latest workflow state</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">AI Analyzed</p>
                <p className="text-xs text-slate-500">{complaint.aiAnalysis?.analyzedAt ? formatDateTime(complaint.aiAnalysis.analyzedAt) : 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {complaint.aiAnalysis ? (
            <AIResultPanel analysis={complaint.aiAnalysis} fallback={complaint.fallback} onReanalyze={handleAnalyze} />
          ) : (
            <div className="card space-y-4">
              <h3 className="text-lg font-semibold text-white">AI Analysis Pending</h3>
              <p className="text-sm text-slate-400">Run AI analysis to get the best department routing and response.</p>
              <button type="button" onClick={handleAnalyze} className="btn-primary w-full">
                <RefreshCw size={16} /> Analyze Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;