// client/src/components/ui/EmptyState.jsx | Empty state illustration card | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ title, description, action }) => (
  <div className="card flex flex-col items-center justify-center text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl shadow-lg">
      ✦
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.node
};

export default EmptyState;