// client/src/pages/ComplaintList.jsx | Complaint list and filters | Author: SmartComplain | Date: 2026-05-19
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Grid2x2, ListFilter, Search, SortAsc, SortDesc, PlusCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import useComplaints from '../hooks/useComplaints';
import ComplaintTable from '../components/complaints/ComplaintTable';
import ComplaintCard from '../components/complaints/ComplaintCard';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants';
import { useAuth } from '../context/AuthContext';

const ComplaintList = () => {
  const { user } = useAuth();
  const { complaints, loading, total, page, pages, fetchComplaints, deleteComplaint, updateComplaint, setPage } = useComplaints();
  const location = useLocation();

  const getInitialFilters = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      location: params.get('location') || '',
      category: params.get('category') || '',
      status: params.get('status') || '',
      priority: params.get('priority') || '',
      sort: params.get('sort') || 'newest'
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);

  useEffect(() => {
    setFilters(getInitialFilters());
  }, [location.search]);
  const [viewMode, setViewMode] = useState('table');
  const [pageSize] = useState(10);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ status: 'Pending', priority: 'Medium' });

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.location, filters.category, filters.status, filters.priority, filters.sort, setPage]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchComplaints({
        page,
        limit: pageSize,
        search: filters.search,
        location: filters.location,
        category: filters.category,
        status: filters.status,
        sort: filters.sort
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.search, filters.location, filters.category, filters.status, filters.sort, page, pageSize]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const priorityMatch = !filters.priority || complaint.priority === filters.priority;
      return priorityMatch;
    });
  }, [complaints, filters.priority]);

  const handleDelete = async (complaint) => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await deleteComplaint(complaint._id);
      toast.success('Complaint deleted');
      fetchComplaints({ page, limit: pageSize, search: filters.search, location: filters.location, category: filters.category, status: filters.status, sort: filters.sort });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (complaint) => {
    setEditItem(complaint);
    setEditForm({ status: complaint.status, priority: complaint.priority });
  };

  const handleSaveEdit = async () => {
    try {
      await updateComplaint(editItem._id, editForm);
      toast.success('Complaint updated');
      setEditItem(null);
      fetchComplaints({ page, limit: pageSize, search: filters.search, location: filters.location, category: filters.category, status: filters.status, sort: filters.sort });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">All Complaints</h1>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-semibold text-indigo-300">{total}</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">Track every complaint across departments and locations.</p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          <PlusCircle size={16} /> New Complaint
        </Link>
      </div>

      <div className="card space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} className="input-field pl-11" placeholder="Search title" />
            </div>
            <div className="relative min-w-[200px]">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={filters.location} onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))} className="input-field pl-11" placeholder="Location" />
            </div>
            <select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} className="input-field w-auto min-w-[180px]">
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="input-field w-auto min-w-[170px]">
              <option value="">All Statuses</option>
              {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))} className="input-field w-auto min-w-[170px]">
              <option value="">All Priorities</option>
              {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setFilters((current) => ({ ...current, sort: current.sort === 'newest' ? 'oldest' : 'newest' }))} className="btn-secondary">
              {filters.sort === 'newest' ? <SortDesc size={16} /> : <SortAsc size={16} />} {filters.sort === 'newest' ? 'Newest' : 'Oldest'}
            </button>
            <button type="button" onClick={() => setViewMode('table')} className={`btn-ghost ${viewMode === 'table' ? 'bg-white/10 text-white' : ''}`}><ListFilter size={16} /></button>
            <button type="button" onClick={() => setViewMode('grid')} className={`btn-ghost ${viewMode === 'grid' ? 'bg-white/10 text-white' : ''}`}><Grid2x2 size={16} /></button>
          </div>
        </div>
      </div>

      {filteredComplaints.length === 0 && !loading ? (
        <EmptyState
          title="No complaints found"
          description="Try adjusting the filters or register the first complaint to get started."
          action={<Link to="/complaints/new" className="btn-primary">Register first complaint</Link>}
        />
      ) : null}

      {!loading && filteredComplaints.length > 0 ? (
        viewMode === 'table' ? (
          <ComplaintTable complaints={filteredComplaints} onEdit={handleEdit} onDelete={handleDelete} currentPage={page} pageSize={pageSize} isAdmin={user?.role === 'admin'} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredComplaints.map((complaint) => <ComplaintCard key={complaint._id} complaint={complaint} />)}
          </div>
        )
      ) : null}

      <Pagination page={page} pages={pages} onPageChange={(nextPage) => fetchComplaints({ page: nextPage, limit: pageSize, search: filters.search, location: filters.location, category: filters.category, status: filters.status, sort: filters.sort })} total={total} limit={pageSize} />

      <Modal
        open={Boolean(editItem)}
        onClose={() => setEditItem(null)}
        title="Update Complaint"
        footer={(
          <>
            <button type="button" className="btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSaveEdit}>Save Changes</button>
          </>
        )}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Status</label>
            <select className="input-field" value={editForm.status} onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}>
              {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input-field" value={editForm.priority} onChange={(event) => setEditForm((current) => ({ ...current, priority: event.target.value }))}>
              {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintList;