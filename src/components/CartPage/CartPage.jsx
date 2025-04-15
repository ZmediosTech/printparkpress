import React from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart,updateQuantity } = 
  useCart();

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace('Rs.', ''));
    return sum + price * (item.quantity || 1);
  }, 0);

  const handleCheckout = () => {
    try {
      console.log('Attempting checkout...');
      if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
      }
      navigate('/login', { 
        state: { 
          returnTo: '/cart',
          cartTotal: total 
        } 
      });
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Unable to proceed to checkout. Please try again.');
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <button 
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-primary bg-orange-400 to-secondary hover:scale-105 duration-300 text-white py-3 px-8 rounded-lg  font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Continue Shopping
        </button>
      </div>
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">Your cart is empty</p>

          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 mb-4 border-b pb-4">
              <div className="flex items-start gap-4">
                <img src={item.img} alt={item.title} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-gray-600 mt-1">{item.price}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="px-3 py-1 "
                        disabled={(item.quantity || 1) <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-3 py-1 border-x">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="px-3 py-1 "
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        SAVE FOR LATER
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4 text-black">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal  ({cartItems.length} items)</span>
                  <span>Rs.{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs.{total}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="bg-gradient-to-r from-primary bg-orange-400 to-secondary hover:scale-105 duration-300 text-white py-3 px-8 rounded-lg w-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;