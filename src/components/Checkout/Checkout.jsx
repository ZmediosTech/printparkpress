import React, { useState ,useEffect} from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { userEmail } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addresses, setAddresses] = useState(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [
      {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      }
    ];
  });

  const [editedAddress, setEditedAddress] = useState({});
  const [isEditingIndex, setIsEditingIndex] = useState(null);

  const handleDeliverHere = (index) => {
    setSelectedAddressIndex(index);
    toast('Address selected for delivery', {
      style: {
        background: '#fff',
        color: '#000',
        border: '1px solid #ddd',
      },
    });
  };

  const handleEditClick = (index) => {
    setIsEditingIndex(index);
    setEditedAddress(addresses[index]);
    setShowEditModal(true);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress(prev => ({ ...prev, [name]: value }));
  };

 
  // Add new function to add address
  const handleAddNewAddress = () => {
    setEditedAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: ''
    });
    setIsEditingIndex(addresses.length);
    setShowEditModal(true);
  };

  const handlePlaceOrder = () => {
    if (selectedAddressIndex === null) {
      toast.error('Please select a delivery address');
      return;
    }

    toast('Order placed successfully!', {
      style: {
        background: '#fff',
        color: '#000',
        border: '1px solid #ddd',
      },
    });
    clearCart();
    navigate('/');
  };
   // Add this useEffect to save addresses when they change
   useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const saveEditedAddress = () => {
    const updatedAddresses = [...addresses];
    updatedAddresses[isEditingIndex] = editedAddress;
    setAddresses(updatedAddresses);
    setShowEditModal(false);
    setIsEditingIndex(null);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    toast('Address updated successfully', {
      style: {
        background: '#fff',
        color: '#000',
        border: '1px solid #ddd',
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Select Delivery Address</h3>
          <button
              onClick={handleAddNewAddress}
              className="px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50"
            >
              + Add New Address
            </button>
          {addresses.map((address, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 mb-4 ${
                selectedAddressIndex === index ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-gray-600 mt-1">{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeliverHere(index)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedAddressIndex === index
                        ? 'bg-orange-500 text-white'
                        : 'border border-orange-500 text-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    Deliver Here
                  </button>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{parseFloat(item.price) * item.quantity}</p>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{getCartTotal}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Address Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  value={editedAddress.name}
                  onChange={handleAddressChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  name="street"
                  value={editedAddress.street}
                  onChange={handleAddressChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="city"
                  value={editedAddress.city}
                  onChange={handleAddressChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  name="state"
                  value={editedAddress.state}
                  onChange={handleAddressChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  name="zip"
                  value={editedAddress.zip}
                  onChange={handleAddressChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedAddress}
                  className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;