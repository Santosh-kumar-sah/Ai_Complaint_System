// client/src/components/complaints/AIResultPanel.jsx | AI analysis result panel | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Building2, FileText, MessageSquare, Sparkles, RotateCcw } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';

const urgencyWidth = { Low: '25%', Medium: '50%', High: '75%', Critical: '100%' };
const urgencyColor = { Low: 'bg-green-500', Medium: 'bg-yellow-500', High: 'bg-orange-500', Critical: 'bg-red-500' };

const AIResultPanel = ({ analysis, loading = false, fallback = false, onReanalyze }) => {
  if (loading) {
    return (
      <div className="card bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md">
        <Spinner label="Analyzing complaint..." />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <motion.div
      className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 to-violet-950/60 p-6 shadow-2xl backdrop-blur-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-300">
            <Sparkles className="animate-pulse" size={20} />
          </div>
          <div>
            <h3 className="bg-gradient-to-r from-cyan-300 via-indigo-200 to-violet-300 bg-clip-text text-xl font-bold text-transparent">AI Analysis</h3>
            <p className="text-xs text-slate-400">Powered by OpenRouter AI</p>
          </div>
        </div>
        {fallback ? <Badge className="border border-yellow-500/30 bg-yellow-500/10 text-yellow-300">Rule-based fallback</Badge> : null}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Urgency Level</span>
            <Badge className="bg-white/10 text-white">{analysis.urgency}</Badge>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${urgencyColor[analysis.urgency] || 'bg-indigo-500'}`} style={{ width: urgencyWidth[analysis.urgency] || '50%' }} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-300">
            <Building2 size={16} />
            <span className="text-sm font-medium">Recommended Department</span>
          </div>
          <p className="text-cyan-300 font-semibold">{analysis.department}</p>
        </div>

        <div className="rounded-2xl border-l-4 border-indigo-500 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-300">
            <MessageSquare size={16} />
            <span className="text-sm font-medium">Auto-generated Response</span>
          </div>
          <p className="italic text-slate-300">{analysis.autoResponse}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-300">
            <FileText size={16} />
            <span className="text-sm font-medium">AI Summary</span>
          </div>
          <p className="text-slate-400">{analysis.summary}</p>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-300">Priority Score</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, index) => index + 1).map((item) => (
              <span key={item} className={`h-4 w-4 rounded-full ${item <= analysis.priorityScore ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <p className="text-xs text-slate-500">Analyzed at: {analysis.analyzedAt ? formatDateTime(analysis.analyzedAt) : 'N/A'}</p>
        {onReanalyze ? (
          <button type="button" onClick={onReanalyze} className="btn-ghost text-sm text-slate-300 hover:text-white">
            <RotateCcw size={15} /> Re-analyze
          </button>
        ) : null}
      </div>
    </motion.div>
  );
};

AIResultPanel.propTypes = {
  analysis: PropTypes.shape({
    urgency: PropTypes.string,
    department: PropTypes.string,
    autoResponse: PropTypes.string,
    summary: PropTypes.string,
    priorityScore: PropTypes.number,
    analyzedAt: PropTypes.string
  }),
  loading: PropTypes.bool,
  fallback: PropTypes.bool,
  onReanalyze: PropTypes.func
};

export default AIResultPanel;