import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingBag } from 'react-icons/fa';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    // fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  // const fetchUsers = async () => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
  //     const data = await response.json();
  //     if (data.success) {
  //       setUsers(data.data || []);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 flex items-center">
          Admin Dashboard
          <span className="ml-2 px-3 py-1 bg-primary text-white text-sm rounded-full">
            Admin
          </span>
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6 rounded-lg text-white">
              <div className="flex items-center">
                <FaUsers className="text-3xl sm:text-4xl" />
                <div className="ml-4">
                  <p className="text-base sm:text-lg font-semibold">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 sm:p-6 rounded-lg text-white">
              <div className="flex items-center">
                <FaShoppingBag className="text-3xl sm:text-4xl" />
                <div className="ml-4">
                  <p className="text-base sm:text-lg font-semibold">Total Orders</p>
                  <p className="text-2xl sm:text-3xl font-bold">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaShoppingBag className="mr-2" />
              Orders
            </h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">




<table className="w-full">
  <thead className="bg-gray-50">
    <tr>
      <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 w-[15%]">ORDER ID</th>
      <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 w-[10%]">FULLNAME</th>
      <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 w-[15%]">EMAIL</th>
      <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 w-[10%]">MOBILE</th>
      <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 w-[10%]">DATE</th>
      <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 w-[30%]">PRODUCTS</th>
      <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 w-[10%]">TOTAL</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {orders.map((order) => (
      <tr key={order._id} className="hover:bg-gray-50">
        <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm truncate">{order._id}</td>
        <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm truncate">{order.user?.fullName || 'N/A'}</td>
        <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm truncate">{order.user?.email}</td>
        <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm truncate">{order.user?.mobile || 'N/A'}</td>
        <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap">
          {new Date(order.orderDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </td>
        <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm">
          <div className="space-y-1.5">
            {order.products?.map((product) => (
              <div key={product._id} className="flex items-center gap-2">
                <div className="w-8 h-8 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                  <img 
                    src={`http://localhost:5000${product.imageUrl || product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate text-xs">{product.name}</p>
                  <p className="text-gray-500 text-xs">Qty: {product.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </td>
        <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium whitespace-nowrap">
          ₹{order.products?.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toLocaleString('en-IN')}
        </td>
      </tr>
    ))}
  </tbody>
</table>







            </div>
          </div>

          {/* Users Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaUsers className="mr-2" />
              Users
            </h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600">EMAIL</th>
                    <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600">ORDERS</th>
                    <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600">JOINED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
  {users.map((user) => (
    <tr key={user._id} className="hover:bg-gray-50">
      <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm">{user.email}</td>
      <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm">
        {orders.filter(order => order.user?.email === user.email).length}
      </td>
      <td className="py-3 px-4 sm:px-6 text-xs sm:text-sm">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;