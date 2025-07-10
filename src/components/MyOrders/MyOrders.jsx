import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Modal } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState({
    orderId: null,
    productId: null,
  });
  const [cancelLoading, setCancelLoading] = useState(false);

  const ordersPerPage = 4;
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/orders/user/${email}`
      );
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    const { orderId, productId } = selectedOrderProduct;
    if (!orderId || !productId) return;

    setCancelLoading(true); // start loading
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/orders/cancel-product/${orderId}/${productId}`,
        { method: "PUT" }
      );
      const data = await res.json();

      if (data.success) {
        toast.success("Product cancelled successfully");
        setCancelModalVisible(false); // close modal only on success
        fetchOrders(); // refresh orders
      } else {
        toast.error(data.error || "Failed to cancel product");
      }
    } catch (error) {
      console.error("Cancel product error:", error);
      toast.error("Something went wrong while cancelling the product");
    } finally {
      setCancelLoading(false); // stop loading
      setSelectedOrderProduct({ orderId: null, productId: null });
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [email, navigate]);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center" data-aos="fade-down">
        My Orders
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-10" data-aos="fade-up">
          <p className="text-gray-500 mb-4 text-lg">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg shadow-md bg-white"
                data-aos="fade-up"
              >
                <div className="border-b p-4 bg-gray-100 flex justify-between items-center flex-wrap gap-2">
                  <p className="text-gray-700 text-sm">
                    🧾 <strong>Order ID:</strong> {order._id}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p
                    className={`font-semibold text-sm ${
                      order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {/* <strong>Status:</strong> {order.status || "Processing"} */}
                  </p>
                </div>

                {order.products.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 border-b last:border-none hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24">
                        <img
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${
                            item.image
                          }`}
                          onClick={() => navigate(`/product/${item.productId}`)}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="flex-grow flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            Quantity: {item.quantity}
                          </p>
                          {item.color && (
                            <p className="text-gray-600 text-sm">
                              Color: {item.color}
                            </p>
                          )}
                          <p className="text-orange-500 font-semibold mt-1">
                            AED {parseFloat(item.price).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <p className="text-sm font-medium">
                          Status:{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                              item.status === "Delivered"
                                ? "bg-green-500"
                                : item.status === "Shipped"
                                ? "bg-orange-500"
                                : item.status === "Cancelled"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {item.status || "Processing"}
                          </span>
                        </p>
                        {item?.status !== "Cancelled" &&
                          item?.status !== "Delivered" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // prevent navigation
                                setSelectedOrderProduct({
                                  orderId: order._id,
                                  productId: item.productId,
                                });
                                setCancelModalVisible(true);
                              }}
                              className="text-sm text-red-600 underline hover:text-red-800 transition ml-4"
                            >
                              Cancel Product
                            </button>
                          )}

                        {/* {item.status == "Cancelled" && (
                          <button
                            disabled
                            className="text-gray-400 transition ml-4"
                          >
                            Cancelled
                          </button>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                  <p className="font-medium text-gray-800">Total Amount:</p>
                  <p className="text-lg font-bold text-orange-600">
                    AED {order.totalAmount.toLocaleString("en-IN")}
                    {/* {order.products
                      .reduce(
                        (total, item) =>
                          total + parseFloat(item.price) * item.quantity,
                        0
                      )
                      .toLocaleString("en-IN")} */}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded border ${
                  currentPage === i + 1
                    ? "bg-orange-500 text-white"
                    : "bg-white hover:bg-orange-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        title="Cancel Product"
        visible={cancelModalVisible}
        onOk={handleConfirmCancel}
        onCancel={() => setCancelModalVisible(false)}
        okText="Yes, Cancel"
        cancelText="No"
        okType="danger"
        confirmLoading={cancelLoading}
        centered
      >
        <p>Are you sure you want to cancel this product?</p>
      </Modal>
    </div>
  );
};

export default MyOrders;
