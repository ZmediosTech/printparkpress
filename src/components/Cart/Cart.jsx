import React from 'react';
import { useCart } from '../../components/context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace('Rs.', ''));
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 mb-4 border-b pb-4">
                <div className="flex items-center gap-4">
                  <img src={item.img} alt={item.title} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600">{item.price}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="p-1 border rounded-full "
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-8 text-center">{item.quantity || 1}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 border rounded-full "
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 ">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
              <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-primary/90">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;