// client/src/pages/NotFound.jsx | 404 page | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-4">
    <div className="absolute inset-0 opacity-30">
      <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
    <div className="relative z-10 text-center">
      <div className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-7xl font-black text-transparent">404</div>
      <h1 className="mt-4 text-3xl font-bold text-white">Page Not Found</h1>
      <p className="mt-3 max-w-lg text-slate-400">The page you are looking for does not exist or has been moved.</p>
      <div className="mt-8">
        <Link to="/" className="btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  </div>
);

export default NotFound;