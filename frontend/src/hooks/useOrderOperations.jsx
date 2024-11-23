import { useCallback } from 'react';
import { useOrderContext } from '@/context/OrderContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export function useOrderOperations() {
  const { dispatch } = useOrderContext();

  const fetchOrders = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${API_BASE_URL}/orders`);
      dispatch({ type: 'SET_ORDERS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
      // Refetch to ensure consistency
      await fetchOrders();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch, fetchOrders]);

  return { fetchOrders, updateOrderStatus };
}