// client/src/components/ui/Spinner.jsx | Loading spinner | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ fullScreen = false, label = 'Loading...' }) => {
  const wrapperClass = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-slate-900'
    : 'flex items-center justify-center';

  return (
    <div className={wrapperClass} aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-3 text-slate-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

Spinner.propTypes = {
  fullScreen: PropTypes.bool,
  label: PropTypes.string
};

export default Spinner;