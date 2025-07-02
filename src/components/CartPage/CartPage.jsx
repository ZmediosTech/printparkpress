import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCart();
console.log(cartItems,"cartItems")
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <div className="min-h-screen  pt-28 pb-24 px-4 md:px-16 lg:px-32">
      <Title level={3} className="mb-2 font-semibold">
        You have {cartItems.length} product{cartItems.length !== 1 && "s"} in your cart
      </Title>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="text-right text-sm text-gray-500 mb-6">
            Expected Delivery: <strong className="text-black">Friday</strong>
          </div>

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-12 gap-2 py-4 border-b items-center"
            >
              {/* Product Info */}
              <div className="col-span-5 flex gap-4 items-center">
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.imageUrl}`}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <Text strong>{item.title}</Text>
                  {/* <p className="text-sm text-gray-600">
                    Color: <strong className="text-black">Green-D</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Size: <strong className="text-black">XL</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    ● In Stock ({item.stock || "12"} Pcs)
                  </p> */}
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 text-center">
                Rs. {parseFloat(item.price).toFixed(2)}
              </div>

              {/* Quantity Controls */}
              <div className="col-span-2 flex justify-center items-center gap-2">
                <Button
                  shape="circle"
                  size="small"
                  onClick={() => decrementQuantity(item)}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus size={10} />
                </Button>
                <span className="text-sm w-6 text-center">{item.quantity || 1}</span>
                <Button
                  shape="circle"
                  size="small"
                  onClick={() => incrementQuantity(item)}
                >
                  <FaPlus size={10} />
                </Button>
              </div>

              {/* Total */}
              <div className="col-span-2 text-right font-medium">
                AED {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
              </div>

              {/* Remove */}
              <div className="col-span-1 text-center">
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
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 border-t pt-6">
            <Button
              type="text"
              className="text-black font-semibold hover:underline"
              onClick={() => navigate("/")}
            >
              CONTINUE SHOPPING
            </Button>

            <div className="text-right mt-4 sm:mt-0">
              <Text className="text-lg">
                Sub Total:{" "}
                <span className="font-semibold">
                  AED. {total.toFixed(2)}
                </span>
              </Text>
              <p className="text-xs text-gray-500">Excl. Tax and Delivery charge</p>

              <Button
                type="primary"
                size="large"
                className="mt-2 bg-blue-500 px-8 text-white"
                onClick={() => navigate("/checkout")}
              >
                GO TO CHECKOUT
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
