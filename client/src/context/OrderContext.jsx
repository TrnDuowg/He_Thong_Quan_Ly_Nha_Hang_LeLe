// src/context/OrderContext.jsx
import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Mặc định là Delivery
  const [orderMode, setOrderMode] = useState('delivery'); 
  const [tableId, setTableId] = useState(null);
  const [cart, setCart] = useState([]); // Giỏ hàng đơn giản

  const value = {
    orderMode, setOrderMode,
    tableId, setTableId,
    cart, setCart
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => useContext(OrderContext);