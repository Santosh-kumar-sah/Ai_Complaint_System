// client/src/pages/ComplaintForm.jsx | Complaint submission wizard | Author: SmartComplain | Date: 2026-05-19
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MapPin, Mail, User, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../constants';
import { getCategoryEmoji } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import useComplaints from '../hooks/useComplaints';
import AIResultPanel from '../components/complaints/AIResultPanel';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createComplaint, analyzeComplaint } = useComplaints();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [redirectId, setRedirectId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    category: 'Water Supply',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((current) => ({ ...current, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  useEffect(() => {
    if (!redirectId) return undefined;
    const timeout = window.setTimeout(() => navigate(`/complaints/${redirectId}`), 3000);
    return () => window.clearTimeout(timeout);
  }, [redirectId, navigate]);

  const progress = useMemo(() => `${(step / 3) * 100}%`, [step]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleNext = () => setStep((current) => Math.min(current + 1, 3));
  const handleBack = () => setStep((current) => Math.max(current - 1, 1));

  const validateStep = () => {
    if (step === 2) {
      if (formData.title.trim().length < 5 || formData.description.trim().length < 20 || !formData.location.trim()) {
        toast.error('Please complete all complaint details');
        return false;
      }
    }
    return true;
  };

  const handleFinalSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const created = await createComplaint(formData);
      const analyzed = await analyzeComplaint(created.complaint._id);
      setAnalysis(analyzed.analysis);
      setRedirectId(created.complaint._id);
      toast.success('Complaint submitted and analyzed!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <p className="text-sm text-slate-400">Dashboard &gt; Complaints &gt; New</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Register New Complaint</h1>
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{ width: progress }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-6">
        <div className="card">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Full Name</span>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input name="name" value={formData.name} onChange={handleChange} className="input-field pl-11" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="label">Email</span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input name="email" value={formData.email} onChange={handleChange} className="input-field pl-11" />
                    </div>
                  </label>
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                <h2 className="text-lg font-semibold text-white">Complaint Details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="label">Complaint Title</span>
                    <input name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="Enter complaint title" />
                  </label>
                  <label className="block">
                    <span className="label">Category</span>
                    <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>{getCategoryEmoji(category)} {category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Location</span>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input name="location" value={formData.location} onChange={handleChange} className="input-field pl-11" placeholder="City or area" />
                    </div>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="label flex items-center justify-between">
                      <span>Description</span>
                      <span>{formData.description.length} / 2000</span>
                    </span>
                    <textarea name="description" rows="6" value={formData.description} onChange={handleChange} className="input-field" placeholder="Describe the issue in detail" />
                  </label>
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div key="step3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                <h2 className="text-lg font-semibold text-white">Preview & Submit</h2>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5 text-sm text-slate-300">
                  <div className="grid gap-3 md:grid-cols-2">
                    <p><span className="text-slate-500">Name:</span> {formData.name}</p>
                    <p><span className="text-slate-500">Email:</span> {formData.email}</p>
                    <p><span className="text-slate-500">Title:</span> {formData.title}</p>
                    <p><span className="text-slate-500">Category:</span> {formData.category}</p>
                    <p><span className="text-slate-500">Location:</span> {formData.location}</p>
                  </div>
                  <p className="mt-3 text-slate-400">{formData.description}</p>
                </div>
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">AI will automatically analyze your complaint after submission.</div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={handleBack} disabled={step === 1} className="btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
            {step < 3 ? (
              <button type="button" onClick={() => (validateStep() ? handleNext() : null)} className="btn-primary">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? <><Loader2 className="animate-spin" size={16} /> Submitting...</> : 'Submit & Analyze with AI'}
              </button>
            )}
          </div>
        </div>
      </form>

      {analysis ? (
        <AIResultPanel analysis={analysis} />
      ) : null}

      {submitting ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white shadow-2xl backdrop-blur-xl">
            <Loader2 className="mx-auto mb-4 animate-spin text-indigo-300" size={28} />
            <p className="text-lg font-semibold">Submitting complaint...</p>
            <p className="mt-1 text-sm text-slate-400">Analyzing with AI...</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ComplaintForm;