// client/src/App.jsx | Application routing root | Author: SmartComplain | Date: 2026-05-19
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintList from './pages/ComplaintList';
import ComplaintDetail from './pages/ComplaintDetail';
import NotFound from './pages/NotFound';
import Toast from './components/ui/Toast';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="complaints" element={<ComplaintList />} />
          <Route path="complaints/new" element={<ComplaintForm />} />
          <Route path="complaints/:id" element={<ComplaintDetail />} />
          <Route path="profile" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;