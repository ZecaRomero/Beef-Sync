import { useState, useEffect } from 'react';
import { materialsAPI } from '../services/materialsAPI';

export function useMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await materialsAPI.getAll();
      setMaterials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = async (material) => {
    try {
      const newMaterial = await materialsAPI.create(material);
      setMaterials(prev => [...prev, newMaterial]);
      return newMaterial;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMaterial = async (id, updates) => {
    try {
      const updated = await materialsAPI.update(id, updates);
      setMaterials(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMaterial = async (id) => {
    try {
      await materialsAPI.delete(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    materials,
    loading,
    error,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    refresh: loadMaterials
  };
}
