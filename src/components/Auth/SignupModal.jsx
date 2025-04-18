import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SignupModal = ({ isOpen, onClose , onSwitchToLogin}) => {
  const [mobile, setMobile] = useState('');
  const { login } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
    if (mobile) {
      login(mobile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-[800px] rounded-lg overflow-hidden relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        
        <div className="flex">
          <div className="bg-[#2874f0] p-12 text-white w-2/5 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Looks like you're new here!</h2>
            <p className="text-lg">Sign up with your mobile number to get started</p>
            <img 
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
              alt="Login banner" 
              className="mt-8"
            />
          </div>
          
          <div className="p-12 w-3/5 bg-white">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <input
                type="tel"
                placeholder="Enter Mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-4 border-b border-gray-300 focus:outline-none focus:border-[#2874f0] text-base"
              />
              
              <p className="text-xs text-gray-500 mt-6">
                By continuing, you agree to our{' '}
                <a href="#" className="text-[#2874f0]">Terms of Use</a> and{' '}
                <a href="#" className="text-[#2874f0]">Privacy Policy</a>.
              </p>
              
              <button 
                type="submit"
                className="w-full bg-[#fb641b] text-white py-4 rounded text-base font-medium mt-8 hover:bg-[#fb641b]/90"
              >
                CONTINUE
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="w-full text-[#2874f0] py-4 mt-4 text-base font-medium"
              >
                Existing User? Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;