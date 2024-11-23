import { useState, useCallback } from 'react';
import axios from 'axios';

export function useFileUpload() {
  const [uploadState, setUploadState] = useState({
    loading: false,
    error: null,
    progress: 0,
    file: null,
  });

  const uploadFile = useCallback(async (file, orderId) => {
    try {
      setUploadState(prev => ({ ...prev, loading: true, error: null }));
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadState(prev => ({ ...prev, progress }));
          },
        }
      );

      setUploadState(prev => ({
        ...prev,
        loading: false,
        file: response.data,
        progress: 100,
      }));

      return response.data;
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  return { uploadState, uploadFile };
}