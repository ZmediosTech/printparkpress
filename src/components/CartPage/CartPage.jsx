import React from "react";
import { useCart } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    saveForLater,
    savedItems,
    moveToCart,
    removeSavedItem,
  } = useCart();
  console.log(cartItems,"cartItems")

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price);
    return sum + price * (item.quantity || 1);
  }, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="container  px-32 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-300 text-white py-3 px-8 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">Your cart is empty</p>
          {/* <button
            onClick={() => navigate("/")}
            className="mt-4 bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition"
          >
            Start Shopping
          </button> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 border-b pb-4"
              >
             <img
  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.imageUrl}`}
  alt={item.title}
  className="w-24 h-24 object-cover rounded"
/>

                <div className="flex-1">
                  <p className="font-semibold">{item.title || item.name}</p>
                  <p className="text-gray-600 mt-1">Rs. {item.price}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => decrementQuantity(item)}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-3 py-1 border-x">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4 text-black shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
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
                className="mt-6 bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-300 text-white py-3 px-8 rounded-lg w-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      )}

      {savedItems && savedItems.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Saved For Later</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-all"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <p className="font-semibold">{item.title || item.name}</p>
                <p className="text-gray-600 mt-1">Rs. {item.price}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => moveToCart(item)}
                    className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeSavedItem(item)}
                    className="px-3 py-2 text-red-500 hover:text-red-700 border border-red-500 rounded hover:bg-red-50 transition-colors"
                    title="Remove from Saved"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
