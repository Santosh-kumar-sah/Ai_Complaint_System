// client/src/pages/Dashboard.jsx | Dashboard overview page | Author: SmartComplain | Date: 2026-05-19
import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, FileText } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import dayjs from 'dayjs';
import api from '../api/axios';
import { API_ROUTES } from '../constants';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(API_ROUTES.complaints.root, { params: { page: 1, limit: 100 } });
        setComplaints(response.data.complaints);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((item) => item.status === 'Pending').length;
    const resolved = complaints.filter((item) => item.status === 'Resolved').length;
    const critical = complaints.filter((item) => item.priority === 'Critical').length;
    return { total, pending, resolved, critical };
  }, [complaints]);

  const categoryData = useMemo(() => {
    const map = complaints.reduce((accumulator, complaint) => {
      accumulator[complaint.category] = (accumulator[complaint.category] || 0) + 1;
      return accumulator;
    }, {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  const statusData = useMemo(() => {
    const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    return statuses.map((status) => ({ name: status, value: complaints.filter((item) => item.status === status).length }));
  }, [complaints]);

  const recentComplaints = useMemo(() => complaints.slice(0, 5), [complaints]);

  if (loading) {
    return <Spinner fullScreen label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-slate-400">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Good {dayjs().hour() < 12 ? 'morning' : dayjs().hour() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="mt-2 text-sm text-slate-400">{formatDate(new Date())}</p>
        </div>
        <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">Welcome back to SmartComplain</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Complaints" value={stats.total} icon={FileText} accentClass="from-blue-500 to-cyan-500" trend="↑ 12% from last month" />
        <StatCard label="Pending" value={stats.pending} icon={Clock3} accentClass="from-yellow-500 to-orange-500" trend="↗ Needs attention" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accentClass="from-green-500 to-emerald-500" trend="↑ 18% resolution rate" />
        <StatCard label="Critical" value={stats.critical} icon={AlertTriangle} accentClass="from-red-500 to-rose-500" trend="↘ Escalation required" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Complaints by Category</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} interval={0} angle={-15} height={60} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444'][index % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white">Status Overview</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={70} paddingAngle={4}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={['#6366f1', '#06b6d4', '#22c55e', '#ef4444'][index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Recent Complaints</h2>
          <Link to="/complaints" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">View All</Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700 text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-800/50">
              {recentComplaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-slate-700/40">
                  <td className="px-4 py-3 text-white">{complaint.title}</td>
                  <td className="px-4 py-3 text-slate-300">{complaint.category}</td>
                  <td className="px-4 py-3 text-slate-300">{complaint.location}</td>
                  <td className="px-4 py-3"><Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(complaint.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;