import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Signup = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (/\S+@\S+\.\S+/.test(formData.username)) {
      newErrors.username = "Username cannot be an email";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with number & special char";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();
    if (data.success) {
      toast.success("Signup successful");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      navigate("/login");
    } else {
      toast.error(data.message || "Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        objectFit: "cover",
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/colorful-school-supplies_488220-26258.jpg?semt=ais_hybrid&w=740')",
      }}
    >
      <div
        className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl"
        data-aos="fade-up"
      >
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.username ? "border-red-400" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all duration-300 font-medium"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
