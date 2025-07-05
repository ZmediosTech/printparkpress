import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

import CartSidebar from "../CartSidebar/CartSidebar";
import SignupModal from "../Auth/SignupModal";
import LoginModal from "../Auth/LoginModal";
import Logo from "../../assets/hero/logo.png";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 3, name: "Shop", link: "/product" },
  { id: 4, name: "Contact", link: "/contact" },
];

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setShowProfileMenu(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <nav className="w-full bg-[#B0BEC5] shadow-sm z-50">
        <div className="bg-[#44A0A0] fixed top-0 left-0 right-0 z-50 shadow-md dark:text-white transition-all duration-200">
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
          />

          <div className="py-2">
            <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-full h-20 object-cover"
                />
              </Link>

              {/* Menu Navigation */}
              <ul className="hidden sm:flex items-center gap-8 text-white text-md font-medium">
                {Menu.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      className="relative inline-block transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Right: Profile + Cart */}
              <div className="flex items-center space-x-6">
                {/* Profile */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="p-2  dark:text-white hover:text-orange-500 transition-colors flex items-center gap-1"
                  >
                    <FaUser className="text-xl text-white" />
                    <FaCaretDown className="text-sm text-white" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      {!email ? (
                        <div className="px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-600">
                          <span>New customer? </span>
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              navigate("/login");

                              // setIsLoginOpen(true);
                            }}
                            className="text-blue-500 hover:text-blue-700 font-medium"
                          >
                            Login
                          </button>
                        </div>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FaUser /> My Profile
                          </Link>
                          <Link
                            to="/myOrders"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FaShoppingBag /> My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          >
                            <FaSignOutAlt /> Logout
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="relative">
                  <button
                    onClick={() => navigate("/cart")}
                    className="bg-[] text-white py-2 px-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform relative"
                  >
                    <FaCartShopping className="text-lg" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
