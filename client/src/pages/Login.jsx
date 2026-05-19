// client/src/pages/Login.jsx | Login page | Author: SmartComplain | Date: 2026-05-19
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { API_ROUTES } from '../constants';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(API_ROUTES.auth.login, {
        email: formData.email,
        password: formData.password
      });
      auth.login(response.data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      setShakeKey((value) => value + 1);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-900 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex rounded-2xl bg-white/10 p-4 text-4xl shadow-2xl shadow-indigo-900/30">🛡️</div>
          <h1 className="text-5xl font-black tracking-tight text-white">SmartComplain</h1>
          <p className="mt-4 max-w-lg text-lg text-slate-300">AI-Powered Complaint Management for Smart Governance</p>
          <div className="mt-10 space-y-4 text-slate-200">
            {['Smart complaint registration', 'OpenRouter AI analysis and routing', 'Role-based dashboards and tracking'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-300" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-10 top-20 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <motion.form
          key={shakeKey}
          onSubmit={handleSubmit}
          className="card w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue managing complaints.</p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="label">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="email" type="email" required className="input-field pl-11" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
            </label>

            <label className="block">
              <span className="label">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-11 pr-12"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" name="remember" checked={formData.remember} onChange={handleChange} className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-indigo-300 hover:text-indigo-200">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Spinner label="Signing in..." /> : 'Sign In'}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-300 hover:text-indigo-200">
              Sign up
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;