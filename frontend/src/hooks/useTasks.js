import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ todo: 0, 'in-progress': 0, completed: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.tasks);
      setStats(res.data.stats);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const res = await api.post('/tasks', data);
    toast.success('Task created!');
    return res.data.task;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    toast.success('Task updated!');
    return res.data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    toast.success('Task deleted');
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data.task;
  }, []);

  return { tasks, stats, total, loading, fetchTasks, createTask, updateTask, deleteTask, updateStatus };
};
