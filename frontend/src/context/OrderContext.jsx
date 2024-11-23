"use client"

import { createContext, useContext, useReducer } from 'react';

const OrderContext = createContext();

const initialState = {
  orders: [],
  loading: false,
  error: null,
  selectedRows: new Set(),
  filters: {
    status: 'all',
    search: '',
  },
};

function orderReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'TOGGLE_ROW':
      const newSelected = new Set(state.selectedRows);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selectedRows: newSelected };
    case 'SET_SELECTED':
      return { ...state, selectedRows: action.payload };
    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
}