import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { userEmail } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingIndex, setIsEditingIndex] = useState(null);

  const [profileData, setProfileData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    addresses: JSON.parse(localStorage.getItem('addresses')) || [
      {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      }
    ]
  });

  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    pincode: '',
    state: '',
    address: '',
    locality: '',
    cityDistrict: '',
    addressType: 'Home',
    weekends: {
      saturday: false,
      sunday: false
    },
    isDefault: false
  });

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
    setNewAddress(profileData.addresses[index]);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = [...profileData.addresses];
    updatedAddresses.splice(index, 1);

    setProfileData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));

    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(null);
    } else if (selectedAddressIndex > index) {
      setSelectedAddressIndex(prev => prev - 1);
    }

    toast.success("Address deleted");
  };

  const handleAddNewAddress = () => {
    setIsEditingIndex(null);
    setNewAddress({
      name: '',
      mobile: '',
      pincode: '',
      state: '',
      address: '',
      locality: '',
      cityDistrict: '',
      addressType: 'Home',
      weekends: {
        saturday: false,
        sunday: false
      },
      isDefault: false
    });
    setShowAddressForm(true);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'saturday' || name === 'sunday') {
        setNewAddress(prev => ({
          ...prev,
          weekends: {
            ...prev.weekends,
            [name]: checked
          }
        }));
      } else {
        setNewAddress(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setNewAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const updatedAddresses = [...profileData.addresses];

    if (isEditingIndex !== null) {
      updatedAddresses[isEditingIndex] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }

    setProfileData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));

    setShowAddressForm(false);
    setNewAddress({
      name: '',
      mobile: '',
      pincode: '',
      state: '',
      address: '',
      locality: '',
      cityDistrict: '',
      addressType: 'Home',
      weekends: {
        saturday: false,
        sunday: false
      },
      isDefault: false
    });
  };

  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === null) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      const selected = profileData.addresses[selectedAddressIndex];
      const orderData = {
        user: {
          email: selected.name || 'manish@yopmail.com',
          fullName: selected.name,
          mobile: selected.mobile,
          address: {
            street: selected.locality,
            city: selected.cityDistrict,
            pincode: selected.pincode,
          }
        },
        products: cartItems.map(item => ({
          productId: item.id,
          name: item.title,
          price: parseInt(item.price.replace('Rs.', '')),
          quantity: item.quantity || 1
        })),
        totalAmount: cartItems.reduce((sum, item) => {
          const price = parseInt(item.price.replace('Rs.', ''));
          return sum + price * (item.quantity || 1);
        }, 0),
        paymentMethod: "Cash on Delivery"
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('Order placed successfully:', data);
      toast('Order placed successfully!', {
        style: {
          background: '#fff',
          color: '#000',
          border: '1px solid #ddd',
        },
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }

    clearCart();
    navigate('/');
  };

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(profileData.addresses));
  }, [profileData.addresses]);

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
          {profileData?.addresses.map((address, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 mt-8 mb-4 ${
                selectedAddressIndex === index ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-gray-600 mt-1">{address.address}</p>
                  <p className="text-gray-600">
                    {address.cityDistrict}, {address.state} {address.pincode}
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
                  <button
                    onClick={() => handleDeleteAddress(index)}
                    className="px-4 py-2 border rounded-lg text-red-500 hover:bg-red-50"
                  >
                    Delete
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
                    <span>₹
                      {cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)}
                    </span>
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

      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Name *" value={newAddress.name} onChange={handleAddressChange} className="border p-2 rounded-md" required />
                <input type="tel" name="mobile" placeholder="Mobile *" value={newAddress.mobile} onChange={handleAddressChange} className="border p-2 rounded-md" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="pincode" placeholder="Pincode *" value={newAddress.pincode} onChange={handleAddressChange} className="border p-2 rounded-md" required />
                <input type="text" name="state" placeholder="State *" value={newAddress.state} onChange={handleAddressChange} className="border p-2 rounded-md" required />
              </div>
              <input type="text" name="address" placeholder="Address *" value={newAddress.address} onChange={handleAddressChange} className="border p-2 rounded-md w-full" required />
              <input type="text" name="locality" placeholder="Locality/Town *" value={newAddress.locality} onChange={handleAddressChange} className="border p-2 rounded-md w-full" required />
              <input type="text" name="cityDistrict" placeholder="City/District *" value={newAddress.cityDistrict} onChange={handleAddressChange} className="border p-2 rounded-md w-full" required />
              <div className="space-y-3">
                <p className="font-medium">Type of Address *</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="addressType" value="Home" checked={newAddress.addressType === 'Home'} onChange={handleAddressChange} />
                    Home
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="addressType" value="Office" checked={newAddress.addressType === 'Office'} onChange={handleAddressChange} />
                    Office
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p>Is your office open on weekends?</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="saturday" checked={newAddress.weekends.saturday} onChange={handleAddressChange} />
                    Open on Saturday
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="sunday" checked={newAddress.weekends.sunday} onChange={handleAddressChange} />
                    Open on Sunday
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isDefault" checked={newAddress.isDefault} onChange={handleAddressChange} />
                Make this as my default address
              </label>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
