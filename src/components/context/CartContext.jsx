import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
 
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() =>
  {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    const existingProduct = cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? {...item, quantity: (item.quantity || 1) + 1}
          : item
      ));
    } else {
      setCartItems([...cartItems, {...product, quantity: 1}]);
    }
  };
  

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === productId 
        ? {...item, quantity: newQuantity}
        : item
    ));
  };
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity,
      removeFromCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return useContext(CartContext);
};