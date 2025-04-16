import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
 
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const removeFromCart = (product) => {
    setCartItems(cartItems.filter(item => item.title !== product.title));
  };
  
  const addToCart = (product) => {
    const existingProduct = cartItems.find(item => item.title === product.title);
    if (existingProduct) {
      setCartItems(cartItems.map(item => 
        item.title === product.title 
          ? {...item, quantity: (item.quantity || 1) + 1}
          : item
      ));
    } else {
      setCartItems([...cartItems, {...product, quantity: 1}]);
    }
  };
  
  const updateQuantity = (product, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(product);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.title === product.title
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const incrementQuantity = (product) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.title === product.title
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (product) => {
    const item = cartItems.find(item => item.title === product.title);
    if (item && (item.quantity || 1) <= 1) {
      removeFromCart(product);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.title === product.title
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart
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
  return context;
};