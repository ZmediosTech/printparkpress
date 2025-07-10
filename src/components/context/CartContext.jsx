// import React, { createContext, useState, useContext, useEffect } from "react";
// import { toast } from "react-hot-toast";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [userId, setUserId] = useState(localStorage.getItem("userId"));
//   const [cartItems, setCartItems] = useState([]);
//   const [savedItems, setSavedItems] = useState([]);

//   // Get keys based on current user
//   const getCartKey = (id) => `cartItems_${id || "guest"}`;
//   const getSavedKey = (id) => `savedItems_${id || "guest"}`;

//   // 🔁 Load cart and saved items on userId change
//   const loadCartData = (id) => {
//     const cartKey = getCartKey(id);
//     const savedKey = getSavedKey(id);

//     const savedCart = localStorage.getItem(cartKey);
//     const savedLater = localStorage.getItem(savedKey);

//     setCartItems(savedCart ? JSON.parse(savedCart) : []);
//     setSavedItems(savedLater ? JSON.parse(savedLater) : []);
//   };

//   // 🔁 Initial load
//   useEffect(() => {
//     const id = localStorage.getItem("userId");
//     setUserId(id);
//     loadCartData(id);
//   }, []);

//   // 🔁 Listen to login/logout changes via storage event
//   useEffect(() => {
//     const syncUser = () => {
//       const id = localStorage.getItem("userId");
//       setUserId(id);
//       loadCartData(id);
//     };

//     window.addEventListener("storage", syncUser);
//     return () => window.removeEventListener("storage", syncUser);
//   }, []);

//   // Save cart items on change
//   useEffect(() => {
//     const cartKey = getCartKey(userId);
//     localStorage.setItem(cartKey, JSON.stringify(cartItems));
//   }, [cartItems, userId]);

//   // Save savedItems on change
//   useEffect(() => {
//     const savedKey = getSavedKey(userId);
//     localStorage.setItem(savedKey, JSON.stringify(savedItems));
//   }, [savedItems, userId]);

//   // Cart functions
//   const addToCart = (product) => {
//     const existingProduct = cartItems.find((item) => item._id === product._id);
//     if (existingProduct) {
//       setCartItems(
//         cartItems.map((item) =>
//           item._id === product._id
//             ? { ...item, quantity: item.quantity + product.quantity }
//             : item
//         )
//       );
//       toast.success("Product quantity updated in cart.");
//     } else {
//       setCartItems([
//         ...cartItems,
//         { ...product, quantity: product.quantity || 1 },
//       ]);
//       toast.success("Product added to cart.");
//     }
//   };

//   const removeFromCart = (productId) => {
//     setCartItems((prev) => prev.filter((item) => item._id !== productId));
//   };

//   const updateQuantity = (product, newQuantity) => {
//     if (newQuantity < 1) {
//       removeFromCart(product._id);
//       return;
//     }
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item._id === product._id ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   const incrementQuantity = (product) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item._id === product._id
//           ? { ...item, quantity: (item.quantity || 1) + 1 }
//           : item
//       )
//     );
//   };

//   const decrementQuantity = (product) => {
//     const item = cartItems.find((item) => item._id === product._id);
//     if (item && (item.quantity || 1) <= 1) {
//       removeFromCart(product._id);
//       return;
//     }

//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item._id === product._id
//           ? { ...item, quantity: (item.quantity || 1) - 1 }
//           : item
//       )
//     );
//   };

//   const saveForLater = (product) => {
//     removeFromCart(product._id);
//     const alreadySaved = savedItems.find((item) => item._id === product._id);
//     if (!alreadySaved) {
//       setSavedItems([...savedItems, product]);
//     }
//   };

//   const moveToCart = (product) => {
//     setSavedItems(savedItems.filter((item) => item._id !== product._id));
//     addToCart(product);
//   };

//   const removeSavedItem = (product) => {
//     setSavedItems(savedItems.filter((item) => item._id !== product._id));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     const cartKey = getCartKey(userId);
//     localStorage.removeItem(cartKey);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         savedItems,
//         addToCart,
//         updateQuantity,
//         incrementQuantity,
//         decrementQuantity,
//         removeFromCart,
//         clearCart,
//         saveForLater,
//         moveToCart,
//         removeSavedItem,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };


import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children, userId }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart/${userId}`);
      const data = await res.json();
      if (data.success) setCartItems(data.items);
    } catch (err) {
      toast.error("Failed to fetch cart");
    }
  };

  const addToCart = async (product) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, product }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchCart(); // Refresh cart
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

// removeFromCart API using cartItem._id
 const removeFromCart = async (cartItemId) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/cart/item/${cartItemId}`,
      { method: "DELETE" }
    );
    const data = await res.json();

    if (data.success) {
      toast.success("Item removed from cart");
        fetchCart(); // Refresh cart

      // Optionally refetch cart items or update state
    } else {
      toast.error(data.message || "Failed to remove item");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


 const updateQuantity = async (cartItemId, newQuantity) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/cart/item/${cartItemId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      }
    );
    const data = await res.json();

    if (data.success) {
      toast.success("Quantity updated");
      fetchCart()
      // Optionally refetch cart items or update local state
    } else {
      toast.error(data.message || "Failed to update quantity");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};
  const clearCart = async () => {
    if (!userId) return;

    try {
      // Clear from backend
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart/clear/${userId}`, {
        method: "DELETE",
      });

      // Clear from context state
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };


  useEffect(() => {
    fetchCart();
  }, [userId]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart ,updateQuantity,clearCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
