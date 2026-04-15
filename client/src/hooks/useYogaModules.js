import { useState, useEffect, useCallback } from 'react';
import { yogaAPI } from '../utils/api';

export default function useYogaModules(filters = {}) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await yogaAPI.getAllModules();
      let data = response.data.modules || response.data || [];

      if (filters.category && filters.category !== 'All') {
        data = data.filter(
          (m) => m.category?.toLowerCase() === filters.category.toLowerCase()
        );
      }
      if (filters.difficulty && filters.difficulty !== 'All') {
        data = data.filter(
          (m) => m.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }

      setModules(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.difficulty]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, refetch: fetchModules };
}
