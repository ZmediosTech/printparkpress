import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Divider } from "antd";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart } =
    useCart();

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + price * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 md:px-16 lg:px-32 bg-gray-50">
      <Title
        level={3}
        className="mb-4 font-semibold text-center"
        data-aos="fade-down"
      >
        {cartItems.length
          ? `You have ${cartItems.length} product${
              cartItems.length > 1 ? "s" : ""
            } in your cart`
          : "Your Cart"}
      </Title>

      {cartItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          data-aos="fade-up"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-60 h-60 object-contain mb-6 animate-bounce"
          />
          <p className="text-gray-600 text-xl font-medium mb-4">
            🛒 Your cart is empty
          </p>
          <Button
            type="primary"
            className="bg-blue-500 transition-colors duration-300"
            onClick={() => navigate("/")}
          >
            Go Shopping
          </Button>
        </div>
      ) : (
        <>
          <div
            className="text-right text-sm text-gray-500 mb-6"
            data-aos="fade-right"
          >
            Expected Delivery: <strong className="text-black">Friday</strong>
          </div>

          {cartItems.map((item, index) => (
            <div
              key={item._id}
              className="grid grid-cols-12 gap-4 py-4 border-b items-center bg-white px-4 rounded-md shadow-sm mb-2"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              {/* Product Info */}
              <div className="col-span-12 sm:col-span-5 flex gap-4 items-center">
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.imageUrl}`}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <Text strong>{item.title}</Text>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-6 sm:col-span-2 text-center font-medium text-gray-800">
                AED {parseFloat(item.price).toFixed(2)}
              </div>

              {/* Quantity Controls */}
              <div className="col-span-6 sm:col-span-2 flex justify-center items-center gap-2">
                <Button
                  shape="circle"
                  size="small"
                  onClick={() => decrementQuantity(item)}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus size={10} />
                </Button>
                <span className="text-sm w-6 text-center">
                  {item.quantity || 1}
                </span>
                <Button
                  shape="circle"
                  size="small"
                  onClick={() => incrementQuantity(item)}
                >
                  <FaPlus size={10} />
                </Button>
              </div>

              {/* Total */}
              <div className="col-span-6 sm:col-span-2 text-right font-semibold text-gray-700">
                AED {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
              </div>

              {/* Remove */}
              <div className="col-span-6 sm:col-span-1 text-center">
                <Button
                  type="text"
                  danger
                  icon={<FaTrash />}
                  onClick={() => removeFromCart(item._id)}
                />
              </div>
            </div>
          ))}

          {/* Subtotal and Checkout */}
          <div
            className="mt-10 bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row justify-between items-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Button
              type="text"
              className="text-blue-600 font-semibold hover:underline"
              onClick={() => navigate("/")}
            >
              ← Continue Shopping
            </Button>

            <div className="text-right mt-6 sm:mt-0">
              <Text className="text-xl text-gray-800">
                Sub Total:{" "}
                <span className="font-bold text-black">
                  AED {total.toFixed(2)}
                </span>
              </Text>
              <p className="text-xs text-gray-500 mt-1">
                Excl. Tax and Delivery charge
              </p>

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
