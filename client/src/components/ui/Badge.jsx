// client/src/components/ui/Badge.jsx | Badge component | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Badge;