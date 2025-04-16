import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { userEmail } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  console.log(cartItems,"cartItems")
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  console.log(selectedAddress,"selectedAddress")
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    pincode: '',
    address: '',
    locality: '',
    cityDistrict: '',
    state: '',
    addressType: 'Home',
  });

  const handleAddAddress = (e) => {
    e.preventDefault();
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    setShowAddressModal(false);
    setNewAddress({
      name: '',
      mobile: '',
      pincode: '',
      address: '',
      locality: '',
      cityDistrict: '',
      state: '',
      addressType: 'Home',
    });
  };
  // Update the button click handler
  const handleAddNewAddress = () => {
    setShowAddressModal(true);
  };
 // Add this function to handle payment
  const handlePayment = () => {
    setShowPaymentModal(true);
  };
  const handleRemoveItem = (item) => {
    removeFromCart(item);
  };
  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace('Rs.', ''));
    return sum + price * (item.quantity || 1);
  }, 0);
  
  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    setAddresses(savedAddresses);
    if (savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses);
    }
  }, []);

  const handleDeliverHere = () => {
    setShowOrderSummary(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Address Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Select Delivery Address</h2>
            
            {addresses.map((address, index) => (
              <div 
              
                key={index}
                className={`border p-4 rounded-lg mb-4 cursor-pointer ${
                  selectedAddress === index ? 'border-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <div className="flex items-start gap-4">
                  <input 
                    type="radio" 
                    checked={selectedAddress === index}
                    onChange={() => setSelectedAddress(address)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">{address.name}</span>
                      <span className="bg-gray-100 px-2 py-1 text-sm rounded">{address.addressType}</span>
                      <span className="text-gray-500">{address.mobile}</span>
                    </div>
                    <p className="text-gray-600">{address.address}</p>
                    <p className="text-gray-600">
                      {address.locality}, {address.cityDistrict}, {address.state} - {address.pincode}
                    </p>
                    
                    {selectedAddress === index && (
                      <button
                        onClick={handleDeliverHere}
                        className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                      >
                        Deliver Here
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

          <button 
        onClick={handleAddNewAddress}
        className="flex items-center gap-2 text-orange-500 mt-4 hover:text-orange-600"
      >
        <span className="text-xl">+</span>
        ADD A NEW ADDRESS
      </button>

  {/* Address Modal */}
  {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
            <form onSubmit={handleAddAddress}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name *"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile *"
                  value={newAddress.mobile}
                  onChange={(e) => setNewAddress({...newAddress, mobile: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Address (House No, Building, Street, Area) *"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Locality/Town *"
                  value={newAddress.locality}
                  onChange={(e) => setNewAddress({...newAddress, locality: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="City/District *"
                  value={newAddress.cityDistrict}
                  onChange={(e) => setNewAddress({...newAddress, cityDistrict: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <div>
                  <p className="mb-2">Type of Address *</p>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Home"
                        checked={newAddress.addressType === 'Home'}
                        onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})}
                        className="mr-2"
                      />
                      Home
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Office"
                        checked={newAddress.addressType === 'Office'}
                        onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})}
                        className="mr-2"
                      />
                      Office
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          </div>

        
       {/* Order Summary */}
{/* Order Summary */}
  {showOrderSummary && (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      {cartItems.map((item, index) => (
        <div key={index} className="flex items-start gap-6 mb-6 pb-6 border-b">
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={item.img} 
              alt={item.title} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center border rounded">
                <button className="px-3 py-1 text-xl font-medium">−</button>
                <span className="px-4 py-1 border-x">{item.quantity || 1}</span>
                <button className="px-3 py-1 text-xl font-medium">+</button>
              </div>
              <button 
                onClick={() => handleRemoveItem(item)}
                className="text-red-500 hover:text-red-600"
              >
                REMOVE
              </button>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-lg">Rs.{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  )}
        </div>

        {/* Order Total */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Price Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 font-semibold">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      

{/* Payment Modal */}
{showPaymentModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="payment" id="cod" defaultChecked />
          <label htmlFor="cod">Cash on Delivery</label>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setShowPaymentModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                const orderData = {
                  user: {
                    email: "nitika2001n@gmail.com",
                    fullName: selectedAddress.fullName,
                    mobile: selectedAddress.mobile,
                    address: {
                      street: selectedAddress.locality,
                      city: selectedAddress.cityDistrict,
                      pincode: selectedAddress.pincode
                    }
                  },
                  products: cartItems.map(item => ({
                    productId: item.id, // Use the dynamic product ID from cartItem
                    name: item.title, // Use the dynamic title from cartItem
                    price: parseInt(item.price.replace('Rs.', '')), // Parse price to number (if necessary)
                    quantity: item.quantity, // Use the dynamic quantity from cartItem
                  })),
                  totalAmount: total, 
                  paymentMethod: "Cash on Delivery"
                };

                const response = await fetch('http://localhost:5000/api/orders/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(orderData)
                });

                if (response.ok) {
                  // Order placed successfully
                  setShowPaymentModal(false);
                  // You might want to clear the cart here
                  alert('Order placed successfully!');
                  navigate('/'); // Navigate to home page or order confirmation page
                } else {
                  throw new Error('Failed to place order');
                }
              } catch (error) {
                console.error('Error placing order:', error);
                alert('Failed to place order. Please try again.');
              }
            }}
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Place Order
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