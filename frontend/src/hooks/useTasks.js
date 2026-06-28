import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/tasks';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', sort: 'newest' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await taskApi.getAll(params);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const { data } = await taskApi.create(taskData);
      setTasks((prev) => [data.task, ...prev]);
      toast.success('Task created!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const { data } = await taskApi.update(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      toast.success('Task updated!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await taskApi.updateStatus(id, status);
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
    refetch: fetchTasks,
  };
};
