// client/src/components/assistant/AssistantWidget.jsx | Floating smart assistant widget | Author: SmartComplain | Date: 2026-05-19
import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronDown, ChevronUp, Loader2, MessageSquarePlus, Sparkles, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { API_ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const quickPrompts = [
  'Register a complaint about water leakage in Noida',
  'Show my latest complaints',
  'Help me analyze a road issue in Ghaziabad'
];

const AssistantWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}. I can register complaints for you, show your recent complaints, and analyze issues automatically.`,
      suggestions: quickPrompts
    }
  ]);
  const endRef = useRef(null);

  const scrollToEnd = () => {
    window.requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || loading) return;

    setMessages((current) => [...current, { role: 'user', text: content }]);
    setMessage('');
    setLoading(true);
    scrollToEnd();

    try {
      const response = await api.post(API_ROUTES.assistant.message, { message: content });
      const payload = response.data;

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: payload.reply,
          complaint: payload.complaint,
          complaints: payload.complaints,
          analysis: payload.analysis,
          complaint: payload.complaint,
          suggestions: payload.suggestions || []
        }
      ]);

      if (payload.intent === 'create_complaint' && payload.complaint?._id) {
        toast.success('Complaint created by assistant');
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: error.response?.data?.message || 'I could not complete that request.' }
      ]);
      toast.error(error.response?.data?.message || 'Assistant failed');
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(message);
  };

  const headerHint = useMemo(
    () => 'Ask me to register a complaint, show complaints, or analyze an issue.',
    []
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-indigo-400/30 bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-white shadow-2xl shadow-indigo-500/30 transition hover:scale-105"
      >
        <Sparkles size={18} />
        <span className="hidden sm:inline font-semibold">Smart Assistant</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-500/20 to-violet-500/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Smart Assistant</p>
                  <p className="text-xs text-slate-400">{headerHint}</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${item.role === 'user' ? 'bg-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-200'}`}>
                    <p>{item.text}</p>
                    {item.complaint ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/complaints/${item.complaint._id}`)}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900/70 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-slate-900"
                      >
                        <MessageSquarePlus size={14} />
                        View created complaint
                      </button>
                    ) : null}
                    {item.complaints?.length ? (
                      <div className="mt-3 space-y-2">
                        {item.complaints.map((complaint) => (
                          <div key={complaint._id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs text-slate-300">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-white">{complaint.title}</span>
                              <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-400">{complaint.status}</span>
                            </div>
                            <p className="mt-1 text-slate-400">{complaint.location} · {complaint.priority}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {item.suggestions?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => sendMessage(suggestion)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <Loader2 className="mr-2 inline animate-spin" size={16} /> Working on it...
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Type a complaint in plain language..."
                  rows={2}
                  className="input-field max-h-28 flex-1 resize-none"
                />
                <button type="submit" disabled={loading || !message.trim()} className="btn-primary px-4 py-3 disabled:opacity-50">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default AssistantWidget;