// client/src/components/ui/StatCard.jsx | Dashboard statistic card | Author: SmartComplain | Date: 2026-05-19
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ label, value, icon: Icon, trend, accentClass = 'from-indigo-500 to-violet-500', isLoading = false }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    const numericValue = Number(value) || 0;
    const duration = 700;
    const steps = 24;
    const increment = numericValue / steps;
    let current = 0;

    const timer = window.setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        window.clearInterval(timer);
        return;
      }
      setDisplayValue(Math.round(current));
    }, duration / steps);

    return () => window.clearInterval(timer);
  }, [value, isLoading]);

  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${accentClass}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <div className="mt-2 text-3xl font-bold text-white">{isLoading ? '...' : displayValue}</div>
          {trend ? <p className="mt-2 text-xs text-slate-400">{trend}</p> : null}
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${accentClass} p-3 text-white shadow-lg shadow-black/20`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.string,
  accentClass: PropTypes.string,
  isLoading: PropTypes.bool
};

export default StatCard;