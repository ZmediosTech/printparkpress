import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!currentUser) {
  //     navigate('/login');
  //     return;
  //   }
  //   fetchWishlist();
  // }, [currentUser, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${currentUser.email}`);
      const data = await response.json();
      if (data.success) {
        setWishlistItems(data.data.products || []);
      }
    } catch (error) {
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/wishlist/${currentUser.email}/remove/${productId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        toast.success('Item removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.productId,
      title: product.name,
      price: product.price,
      image: product.image
    });
    removeFromWishlist(product.productId);
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.productId} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;