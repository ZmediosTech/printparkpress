import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
 
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [savedItems, setSavedItems] = useState(() => {
    const savedForLater = localStorage.getItem('savedItems');
    return savedForLater ? JSON.parse(savedForLater) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);
  
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
  };
  
  const addToCart = (product) => {
    const existingProduct = cartItems.find(item => item._id === product._id);
    if (existingProduct) {
      setCartItems(cartItems.map(item => 
        item._id === product._id 
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
    const removeFromCart = (productId) => {
      setCartItems(cartItems.filter(item => item.id !== productId));
    };
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const incrementQuantity = (product) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id=== product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (product) => {
    const item = cartItems.find(item => item.id === product.id);
    if (item && (item.quantity || 1) <= 1) {
      removeFromCart(product);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
    );
  };

  const saveForLater = (product) => {
    removeFromCart(product);
    const existingProduct = savedItems.find(item => item.title === product.title);
    if (!existingProduct) {
      setSavedItems([...savedItems, product]);
    }
  };

  const moveToCart = (product) => {
    setSavedItems(savedItems.filter(item => item.title !== product.title));
    addToCart(product);
  };

  const removeSavedItem = (product) => {
    setSavedItems(savedItems.filter(item => item.title !== product.title));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems,
      savedItems, 
      addToCart, 
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
      saveForLater,
      moveToCart,
      removeSavedItem
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