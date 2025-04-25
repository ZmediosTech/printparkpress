import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/user/${email}`);
      const data = await response.json();
      console.log('Orders response:', data); 
      if (data.success) {
        setOrders(data.data || []);
      }
      else {
        // toast.error(data.message || 'No orders found');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      
      {(!orders || orders.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your Order is empty</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg shadow-sm bg-white">
              <div className="border-b p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Order ID: {order._id}</p>

                  <p>
                    <span className='font-semibold'>Order Date : </span>
                    {order.orderDate && new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                    
                  </p>
                  {/* <p className="text-green-600 font-medium">
                    {order.status === 'delivered' ? (
                      `Delivered on ${new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}`
                    ) : (
                      `Status: ${order.status || 'Processing'}`
                    )}
                  </p> */}
                </div>
              </div>
              
              {order.products.map((item) => (
                <div key={item._id} className="p-4 border-b last:border-b-0">
                  <div className="flex gap-4" onClick={() => navigate(`/product/${item.productId}`)}>
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                      {item.color && (
                        <p className="text-gray-600 mt-1">Color: {item.color}</p>
                      )}
                      <p className="font-semibold text-orange-500 mt-2">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total Amount:</p>
                  <p className="font-semibold text-lg">
                    ₹{order.products.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;