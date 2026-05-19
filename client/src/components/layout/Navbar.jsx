// client/src/components/layout/Navbar.jsx | Top navigation bar | Author: SmartComplain | Date: 2026-05-19
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu as HeadlessMenu } from '@headlessui/react';
import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const titleMap = {
  '/': 'Dashboard',
  '/complaints': 'All Complaints',
  '/complaints/new': 'Register New Complaint',
  '/profile': 'My Profile'
};

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const title = useMemo(() => {
    const path = location.pathname.startsWith('/complaints/') && location.pathname !== '/complaints/new' ? '/complaints' : location.pathname;
    return titleMap[path] || 'SmartComplain';
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700 bg-slate-900/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onToggleSidebar} className="btn-ghost p-2 md:hidden">
          <Menu size={18} />
        </button>
        <button type="button" onClick={onToggleSidebar} className="btn-ghost hidden p-2 md:inline-flex">
          <Menu size={18} />
        </button>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="text-xs text-slate-400">Smart governance through AI</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button type="button" onClick={() => setSearchOpen((value) => !value)} className="btn-ghost p-2">
          <Search size={18} />
        </button>
        {searchOpen ? <div className="hidden md:block h-9 w-56 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-500">Search coming soon</div> : null}
        <button type="button" className="relative btn-ghost p-2">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="h-8 w-px bg-slate-700" />
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
              {getInitials(user?.name || 'U')}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role || 'user'}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </HeadlessMenu.Button>
          <HeadlessMenu.Items className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl shadow-black/30 focus:outline-none">
            <HeadlessMenu.Item>
              {({ active }) => (
                <button type="button" className={`w-full rounded-xl px-4 py-3 text-left text-sm ${active ? 'bg-slate-800 text-white' : 'text-slate-300'}`}>
                  Profile
                </button>
              )}
            </HeadlessMenu.Item>
            <HeadlessMenu.Item>
              {({ active }) => (
                <button type="button" className={`w-full rounded-xl px-4 py-3 text-left text-sm ${active ? 'bg-slate-800 text-white' : 'text-slate-300'}`}>
                  Settings
                </button>
              )}
            </HeadlessMenu.Item>
            <div className="my-1 h-px bg-slate-700" />
            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={logout}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm text-red-400 ${active ? 'bg-red-500/10 text-red-300' : ''}`}
                >
                  Logout
                </button>
              )}
            </HeadlessMenu.Item>
          </HeadlessMenu.Items>
        </HeadlessMenu>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired
};

export default Navbar;