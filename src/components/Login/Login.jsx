import React, { useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTruck, FaBell, FaStar } from 'react-icons/fa';
import { useAuth } from '../../components/context/AuthContext';

const Login = () => {
  const { userEmail, login } = useAuth();
  const [email, setEmail] = useState(userEmail || '');
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    street: '',
    city: '',
    pincode: ''
  });
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

  const handleAddressSubmit = () => {
    if (!address.fullName || !address.mobile || !address.street || !address.city || !address.pincode) {
      alert('Please fill all address fields');
      return;
    }
    setCurrentStep(3);
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
              onClick={handleAddressSubmit}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
            >
              DELIVER HERE
            </button>
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