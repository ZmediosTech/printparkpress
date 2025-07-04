import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/user/${email}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [email, navigate]);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  return (
    <div className="max-w-6xl mx-auto p-4 mt-24 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center" data-aos="fade-down">My Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      ) : (!orders || orders.length === 0) ? (
        <div className="text-center py-10" data-aos="fade-up">
          <p className="text-gray-500 mb-4 text-lg">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <div key={order._id} className="border rounded-lg shadow-md bg-white" data-aos="fade-up">
                <div className="border-b p-4 bg-gray-100 flex justify-between items-center flex-wrap">
                  <p className="text-gray-700 text-sm">🧾 <strong>Order ID:</strong> {order._id}</p>
                  <p className="text-gray-700 text-sm">
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-green-600 text-sm">
                    <strong>Status:</strong> {order.status || 'Processing'}
                  </p>
                </div>

                {order.products.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 border-b last:border-none hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24">
                        <img
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        {item.color && <p className="text-gray-600 text-sm">Color: {item.color}</p>}
                        <p className="text-orange-500 font-semibold mt-1">
                          AUD {parseFloat(item.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                  <p className="font-medium text-gray-800">Total Amount:</p>
                  <p className="text-lg font-bold text-orange-600">
                    AUD {order.products.reduce((total, item) =>
                      total + (parseFloat(item.price) * item.quantity), 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className={`px-4 py-2 rounded border ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded border ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'bg-white hover:bg-orange-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={`px-4 py-2 rounded border ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
