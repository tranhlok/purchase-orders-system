"use client"

import { useCallback } from 'react';
import { useOrderContext } from '@/context/OrderContext';

export function useOrderFilters() {
  const { state, dispatch } = useOrderContext();

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_FILTERS', payload: { search: query } });
  }, [dispatch]);

  const setStatusFilter = useCallback((status) => {
    dispatch({ type: 'SET_FILTERS', payload: { status } });
  }, [dispatch]);

  const getFilteredOrders = useCallback(() => {
    const { orders, filters } = state;
    
    return orders.filter(order => {
      // Search filter
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        Object.values(order).some(value => 
          String(value).toLowerCase().includes(searchLower)
        );

      // Status filter
      const matchesStatus = filters.status === 'all' || 
        order.status.toLowerCase() === filters.status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [state]);

  return {
    searchQuery: state.filters.search,
    statusFilter: state.filters.status,
    setSearchQuery,
    setStatusFilter,
    getFilteredOrders,
  };
}