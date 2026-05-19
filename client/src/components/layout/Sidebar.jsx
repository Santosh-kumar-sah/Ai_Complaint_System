// client/src/components/layout/Sidebar.jsx | Main sidebar navigation | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ClipboardList, LayoutDashboard, LogOut, PlusCircle, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'New Complaint', to: '/complaints/new', icon: PlusCircle },
  { label: 'All Complaints', to: '/complaints', icon: ClipboardList },
  { label: 'My Profile', to: '/profile', icon: UserCircle }
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  return (
    <aside className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-700 bg-slate-900 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
            <span className="text-lg font-bold">S</span>
          </div>
          {!collapsed ? (
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">SmartComplain</h1>
              <p className="text-[11px] text-slate-500">AI Complaint System</p>
            </div>
          ) : null}
        </div>
        <button type="button" onClick={onToggle} className="btn-ghost p-2 text-slate-400 hover:text-white">
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive ? 'border-r-2 border-indigo-500 bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${collapsed ? 'justify-center px-3' : ''}`
            }
          >
            <Icon size={18} />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 p-4">
        {!collapsed ? (
          <div className="mb-4 rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                {getInitials(user?.name || 'U')}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user?.name || 'Guest'}</p>
                <p className="text-xs capitalize text-slate-400">{user?.role || 'user'}</p>
              </div>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Sidebar;