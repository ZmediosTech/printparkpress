import React, { useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTruck, FaBell, FaStar } from 'react-icons/fa';
import { useAuth } from '../../components/context/AuthContext';
import { useCart } from '../context/CartContext';

const Login = () => {
  const { userEmail, login } = useAuth();
   const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { cartItems } = useCart();
  const [email, setEmail] = useState(userEmail || '');
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    street: '',
    city: '',
    pincode: ''
  });
  const handleAddressSubmit = async () => {
    if (!address.fullName || !address.mobile || !address.street || !address.city || !address.pincode) {
      alert('Please fill all address fields');
      return;
    }

    try {
      const orderData = {
        user: {
          email: email,
          fullName: address.fullName,
          mobile: address.mobile,
          address: {
            street: address.street,
            city: address.city,
            pincode: address.pincode
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

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      console.log('Order placed successfully:', data);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };
  useEffect(() => {
    if (userEmail) {
      setCurrentStep(2); // Skip to address if already logged in
    }
  }, [userEmail]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleContinue = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter email or mobile number');
      return;
    }
    login(email); 
    setCurrentStep(2);
  };

 

  const handlePaymentSubmit = () => {
    // Here you would typically process the payment
    navigate('/order-confirmation');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <input
              type="text"
              placeholder="Enter Email/Mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <button
              onClick={handleContinue}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
            >
              CONTINUE
            </button>
          </>
        );
      case 2:
        return (
          <div className="space-y-4">
             {savedAddresses.length > 0 && !showAddressForm && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Saved Addresses</h3>
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-orange-500 font-semibold"
              >
                + Add New Address
              </button>
            </div>
            <div className="space-y-4">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  className={`border p-4 rounded-lg cursor-pointer ${
                    selectedAddressId === addr.id ? 'border-orange-500' : ''
                  }`}
                  onClick={() => setSelectedAddressId(addr.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{addr.fullName}</span>
                    <div className="space-x-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddress(addr);
                          setShowAddressForm(true);
                        }}
                        className="text-blue-500"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{addr.mobile}</p>
                  <p className="text-gray-600">
                    {addr.street}, {addr.city}, {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
            {selectedAddressId && (
              <button
                onClick={handleAddressSubmit}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
              >
                DELIVER HERE
              </button>
            )}
          </>
        )}
  {(showAddressForm || savedAddresses.length === 0) && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Add New Address</h3>
              {savedAddresses.length > 0 && (
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="text-orange-500 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={address.fullName}
              onChange={(e) => setAddress({...address, fullName: e.target.value})}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={address.mobile}
              onChange={(e) => setAddress({...address, mobile: e.target.value})}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({...address, street: e.target.value})}
              className="w-full p-3 border rounded-lg"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({...address, pincode: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <button
              onClick={async () => {
                if (!address.fullName || !address.mobile || !address.street || !address.city || !address.pincode) {
                  alert('Please fill all address fields');
                  return;
                }
                const newAddress = { ...address, id: Date.now() };
                setSavedAddresses([...savedAddresses, newAddress]);
                setSelectedAddressId(newAddress.id);
                setShowAddressForm(false);
                await handleAddressSubmit();
              }}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
            >
              SAVE AND DELIVER HERE
            </button>
          </>
        )}
      </div>
    );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            {[ 'Cash on Delivery'].map((method) => (
              <div key={method} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" id={method} />
                <label htmlFor={method}>{method}</label>
              </div>
            ))}
            <button
              onClick={handlePaymentSubmit}
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
            >
              PLACE ORDER
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-6">
            {['LOGIN', 'DELIVERY ADDRESS', 'PAYMENT OPTIONS'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className={`${
                  currentStep > index + 1 ? 'bg-green-500' : 
                  currentStep === index + 1 ? 'bg-blue-500' : 
                  'bg-gray-300'
                } text-white rounded-full w-6 h-6 flex items-center justify-center`}>
                  {index + 1}
                </span>
                <span className={currentStep === index + 1 ? 'text-blue-500 font-semibold' : 'text-gray-600'}>
                  {step}
                </span>
                {index < 2 && <span className="mx-2">→</span>}
              </div>
            ))}
          </div>

          {renderStepContent()}

          {currentStep === 1 && (
            <p className="text-sm text-gray-600 mt-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-500">Terms of Use</a> and{' '}
              <a href="#" className="text-blue-500">Privacy Policy</a>.
            </p>
          )}
        </div>

        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-200 p-2 rounded-full">
                <FaTruck className="text-gray-600 text-xl" />
              </div>
              <p className="text-gray-600">Easily Track Orders, Hassle free Returns</p>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-200 p-2 rounded-full">
                <FaBell className="text-gray-600 text-xl" />
              </div>
              <p className="text-gray-600">Get Relevant Alerts and Recommendation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 p-2 rounded-full">
                <FaStar className="text-gray-600 text-xl" />
              </div>
              <p className="text-gray-600">Wishlist, Reviews, Ratings and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;