// client/src/hooks/useComplaints.js | Complaint data hook | Author: SmartComplain | Date: 2026-05-19
import { useState } from 'react';
import api from '../api/axios';
import { API_ROUTES } from '../constants';

const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchComplaints = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(API_ROUTES.complaints.root, { params: filters });
      setComplaints(response.data.complaints);
      setTotal(response.data.total);
      setPage(response.data.page);
      setPages(response.data.pages);
      return response.data;
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Failed to fetch complaints');
      throw fetchError;
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (data) => {
    const response = await api.post(API_ROUTES.complaints.root, data);
    return response.data;
  };

  const updateComplaint = async (id, data) => {
    const response = await api.put(`${API_ROUTES.complaints.root}/${id}`, data);
    return response.data;
  };

  const deleteComplaint = async (id) => {
    const response = await api.delete(`${API_ROUTES.complaints.root}/${id}`);
    return response.data;
  };

  const analyzeComplaint = async (complaintId) => {
    const response = await api.post(API_ROUTES.ai.analyze, { complaintId });
    return response.data;
  };

  return {
    complaints,
    loading,
    error,
    total,
    page,
    pages,
    fetchComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    analyzeComplaint,
    setComplaints,
    setPage
  };
};

export default useComplaints;