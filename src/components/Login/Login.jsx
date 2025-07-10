import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim values before validation and submission
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    const newErrors = {};
    if (!trimmedEmail) newErrors.email = "Email is required";
    if (!trimmedPassword) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
          }),
        }
      );
      const data = await response.json();
      if (data.success === true) {
        toast.success("Login successful");
        localStorage.setItem("userId", data.user?._id);
        localStorage.setItem("userName", data.user?.name);

        localStorage.setItem("email", data.user?.email);
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage"));

        window.location.href = "/"; // ✅ hard reload to re-mount CartProvider
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
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );
      const result = await res.json();

      if (result.success) {
        toast.success("Password reset email sent!");
        setShowResetForm(false);
        setResetEmail("");
      } else {
        toast.error(result.message || "Failed to send reset email.");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-black bg-opacity-60 bg-cover bg-center flex items-center   justify-center px-4 py-10 "
      style={{
        objectFit: "cover",
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/colorful-school-supplies_488220-26258.jpg?semt=ais_hybrid&w=740')",
      }}
    >
      <div
        className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg"
        data-aos="fade-up"
      >
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Welcome Back
        </h2>
        {apiError && (
          <p className="text-red-500 text-sm mb-4 text-center">{apiError}</p>
        )}

        {!showResetForm ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                name="email"
                type="text"
                placeholder="Email "
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-400" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-400" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setShowResetForm(true)}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300 font-medium"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <p className="text-sm text-gray-700 text-center">
              Enter your email to receive a password reset link.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all duration-300 font-medium"
            >
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
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
