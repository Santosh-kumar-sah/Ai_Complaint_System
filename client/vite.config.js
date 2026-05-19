// client/vite.config.js | Vite configuration | Author: SmartComplain | Date: 2026-05-19
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
});