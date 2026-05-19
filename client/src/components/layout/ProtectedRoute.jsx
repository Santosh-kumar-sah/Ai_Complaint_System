// client/src/components/layout/ProtectedRoute.jsx | Protected layout route | Author: SmartComplain | Date: 2026-05-19
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../ui/Spinner';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import AssistantWidget from '../assistant/AssistantWidget';

const ProtectedRoute = () => {
  const { user, token, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return <Spinner fullScreen label="Loading SmartComplain..." />;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className={`min-h-screen transition-all duration-300 ${collapsed ? 'md:pl-16' : 'md:pl-64'} pl-0`}>
        <Navbar onToggleSidebar={() => setCollapsed((value) => !value)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <AssistantWidget />
    </div>
  );
};

export default ProtectedRoute;