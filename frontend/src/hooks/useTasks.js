import { useState, useCallback, useEffect, useRef } from 'react';
import { taskApi } from '../services/api';

export function useTasks(initialFilters = {}) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const debounceRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [filters.search]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        search: debouncedSearch,
      };
      const res = await taskApi.getAll(params);
      setTasks(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateFilters = (updates) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      // Reset to page 1 when filters change (except page itself)
      if (!('page' in updates)) {
        next.page = 1;
      }
      return next;
    });
  };

  const createTask = async (data) => {
    const res = await taskApi.create(data);
    await fetchTasks();
    return res.data;
  };

  const updateTask = async (id, data) => {
    const res = await taskApi.update(id, data);
    await fetchTasks();
    return res.data;
  };

  const deleteTask = async (id) => {
    await taskApi.delete(id);
    await fetchTasks();
  };

  const getTask = async (id) => {
    const res = await taskApi.getById(id);
    return res.data;
  };

  return {
    tasks,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    getTask,
    refetch: fetchTasks,
  };
}
