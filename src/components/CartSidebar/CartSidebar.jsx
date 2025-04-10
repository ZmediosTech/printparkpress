import React from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace('Rs.', ''));
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <img src={item.img} alt={item.title} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      {item.price} x {item.quantity || 1}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>Rs.{total}</span>
              </div>
              <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90">
                View Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;