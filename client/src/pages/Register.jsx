// client/src/pages/Register.jsx | Register page | Author: SmartComplain | Date: 2026-05-19
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { API_ROUTES } from '../constants';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const initialForm = { name: '', email: '', password: '', confirmPassword: '', role: 'user' };

const Register = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = 'Valid email is required';
    if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post(API_ROUTES.auth.register, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      auth.login(response.data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-900 lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-10">
        <motion.form
          onSubmit={handleSubmit}
          className="card w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">Join SmartComplain and start tracking civic issues.</p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="label">Full Name</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="name" type="text" value={formData.name} onChange={handleChange} className="input-field pl-11" placeholder="Rahul Kumar" />
              </div>
              {errors.name ? <p className="mt-1 text-xs text-red-400">{errors.name}</p> : null}
            </label>

            <label className="block">
              <span className="label">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field pl-11" placeholder="you@example.com" />
              </div>
              {errors.email ? <p className="mt-1 text-xs text-red-400">{errors.email}</p> : null}
            </label>

            <label className="block">
              <span className="label">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="input-field pl-11 pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? <p className="mt-1 text-xs text-red-400">{errors.password}</p> : null}
            </label>

            <label className="block">
              <span className="label">Confirm Password</span>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} className="input-field pl-11" placeholder="••••••••" />
              </div>
              {errors.confirmPassword ? <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p> : null}
            </label>

            <label className="block">
              <span className="label">Role</span>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Spinner label="Creating account..." /> : 'Create Account'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex rounded-2xl bg-white/10 p-4 text-4xl shadow-2xl shadow-indigo-900/30">✨</div>
          <h1 className="text-5xl font-black tracking-tight text-white">SmartComplain</h1>
          <p className="mt-4 max-w-lg text-lg text-slate-300">Register complaints, get AI analysis, and monitor resolution progress in one place.</p>
        </div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute right-10 top-20 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Register;