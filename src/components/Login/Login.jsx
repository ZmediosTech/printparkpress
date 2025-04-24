import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email or Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await response.json();
      if (data.success === true) {
        toast.success("Login successful");
        navigate("/");
        localStorage.setItem("email",data.user?.email)

        localStorage.setItem("token",data.token)
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (err) {
      toast.error("Login failed! Please try again.");
      setApiError(err.message);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Password reset email sent!");
        setShowResetForm(false);
        setResetEmail('');
      } else {
        toast.error(result.message || "Failed to send reset email.");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Welcome Back</h2>
        {apiError && <p className="text-red-500 text-sm mb-4 text-center">{apiError}</p>}
        
        {!showResetForm ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:outline-none`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:outline-none`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:text-secondary underline"
                onClick={() => setShowResetForm(true)}
              >
                Forgot password?
              </button>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition-all duration-300 font-medium">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <p className="text-sm text-gray-700 text-center">Enter your email to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition-all duration-300 font-medium">
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => setShowResetForm(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              Back to Login
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-secondary font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
