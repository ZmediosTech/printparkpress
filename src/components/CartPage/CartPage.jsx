import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item?.product?.price);
    return sum + price * (item?.quantity || 1);
  }, 0);

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 md:px-10 lg:px-24 bg-gray-50">
      <Title level={3} className="mb-6 text-center font-semibold" data-aos="fade-down">
        {cartItems.length
          ? `You have ${cartItems.length} product${cartItems.length > 1 ? "s" : ""} in your cart`
          : "Your Cart"}
      </Title>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" data-aos="fade-up">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-52 h-52 object-contain mb-6 animate-bounce"
          />
          <p className="text-gray-600 text-xl font-medium mb-4">
            🛒 Your cart is empty
          </p>
          <Button
            type="primary"
            className="bg-blue-500 px-6 hover:bg-blue-600"
            onClick={() => navigate("/")}
          >
            Go Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="text-right text-sm text-gray-500 mb-4" data-aos="fade-right">
            Expected Delivery: <strong className="text-black">Friday</strong>
          </div>

          {cartItems.map((item, index) => {
            const original = item.product?.originalPrice;
            const current = item.product?.price;
            const discountPercentage =
              original && current && original > current
                ? Math.round(((original - current) / original) * 100)
                : 0;

            return (
              <div
                key={item._id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-5 px-4 bg-white border rounded-md shadow-sm mb-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Product Image & Title */}
                <div className="sm:col-span-5 flex items-center gap-4">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.product?.imageUrl}`}
                    alt={item.product?.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <Text strong className="block">{item.product?.title}</Text>
                    <Text type="secondary" className="text-sm">{item.product?.category}</Text>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:col-span-2 flex flex-col justify-center text-center">
                  {discountPercentage > 0 ? (
                    <>
                      <div className="text-sm text-gray-400 line-through">
                        AED {original}
                      </div>
                      <div className="text-lg text-green-600 font-semibold">
                        AED {current}
                      </div>
                      <div className="text-xs text-red-500 mt-1">Save {discountPercentage}%</div>
                    </>
                  ) : (
                    <div className="text-lg font-semibold text-gray-700">
                      AED {current}
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="sm:col-span-2 flex items-center justify-center gap-2">
                  <Button
                    shape="circle"
                    size="small"
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus size={10} />
                  </Button>
                  <span className="text-base font-medium w-6 text-center">{item.quantity}</span>
                  <Button
                    shape="circle"
                    size="small"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <FaPlus size={10} />
                  </Button>
                </div>

                {/* Total per item */}
                <div className="sm:col-span-2 text-right flex items-center justify-end font-semibold text-gray-800">
                  AED {(parseFloat(current) * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <div className="sm:col-span-1 flex justify-center sm:justify-end items-center">
                  <Button
                    type="text"
                    danger
                    icon={<FaTrash />}
                    onClick={() => removeFromCart(item._id)}
                  />
                </div>
              </div>
            );
          })}

          {/* Subtotal & Checkout */}
          <div
            className="mt-10 bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row justify-between items-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Button
              type="text"
              className="text-blue-600 font-semibold hover:underline mb-4 sm:mb-0"
              onClick={() => navigate("/")}
            >
              ← Continue Shopping
            </Button>

            <div className="text-right">
              <Text className="text-xl text-gray-800">
                Sub Total:{" "}
                <span className="font-bold text-black">
                  AED {total.toFixed(2)}
                </span>
              </Text>
              <p className="text-xs text-gray-500">Excl. Tax and Delivery charge</p>
              <Button
                type="primary"
                size="large"
                className="mt-2 bg-blue-600 px-8 text-white hover:bg-blue-700"
                onClick={() => navigate("/checkout")}
              >
                Go to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
