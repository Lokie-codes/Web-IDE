import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';

const API_URL = 'http://localhost:3001/api';

export const useGist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { code, language, theme } = useEditorStore();

  const createGist = async (title) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/gists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Untitled',
          language,
          code,
          theme
        })
      });

      const result = await response.json();

      if (result.success) {
        return result.gist;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadGist = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/gists/${id}`);
      const result = await response.json();

      if (result.success) {
        return result.gist;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createGist,
    loadGist,
    loading,
    error
  };
};
