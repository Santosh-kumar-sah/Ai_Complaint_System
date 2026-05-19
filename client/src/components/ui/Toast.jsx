// client/src/components/ui/Toast.jsx | Toast provider wrapper | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';

const Toast = ({ position = 'top-right' }) => (
  <Toaster
    position={position}
    toastOptions={{
      style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' }
    }}
  />
);

Toast.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'])
};

export default Toast;