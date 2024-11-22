import { useState, useEffect, useCallback } from 'react';

// Replace mock data with API calls
const API_BASE_URL = 'http://localhost:8000/api';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders`);
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        await fetchOrders(); // Refresh orders after update
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }, [fetchOrders]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Row selection handlers
  const toggleRow = useCallback((id) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedRows(prev => 
      prev.size === orders.length ? new Set() : new Set(orders.map(order => order.id))
    );
  }, [orders]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  // Filter handlers
  const filterOrders = useCallback((filters) => {
    return orders.filter(order => {
      const matchesStatus = !filters.status || filters.status === 'all' || 
        order.type.toLowerCase() === filters.status.toLowerCase();
      const matchesSearch = !filters.search || 
        order.id.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders]);

  // Document handlers
  const handleDocumentUpload = useCallback(async (orderId, file, documentType) => {
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Uploading ${documentType} document for order ${orderId}`);
      return true;
    } catch (err) {
      console.error('Upload failed:', err);
      return false;
    }
  }, []);

  return {
    // Data
    orders,
    loading,
    error,
    
    // Selection state
    selectedRows,
    toggleRow,
    toggleAll,
    clearSelection,
    
    // Actions
    fetchOrders,
    filterOrders,
    handleDocumentUpload,
    updateOrderStatus
  };
}