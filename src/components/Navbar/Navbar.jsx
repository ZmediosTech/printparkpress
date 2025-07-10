import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
  FaCaretDown,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { useDebounce } from "use-debounce";

import CartSidebar from "../CartSidebar/CartSidebar";
import Logo from "../../assets/hero/logo.png";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Shop", link: "/product" },
  { id: 3, name: "Contact", link: "/contact" },
];

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { cartItems } = useCart();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.removeItem(`cartItems_${userId}`);
      localStorage.removeItem(`savedItems_${userId}`);
    } else {
      localStorage.removeItem("cartItems_guest");
      localStorage.removeItem("savedItems_guest");
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm.trim().length < 3) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/products/search?query=${debouncedSearchTerm}`
        );
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error("Search error", error);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#44A0A0] shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-14  object-cover" />
        </Link>

        {/* Search */}
        <div className="relative w-52 sm:w-64 md:w-80" ref={searchRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 pr-10 rounded-md border text-black focus:ring-2 ring-orange-400 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
            >
              &times;
            </button>
          )}
          {showSearchResults && (
            <div className="absolute z-50 top-11 left-0 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-auto">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setSearchTerm("");
                      setShowSearchResults(false);
                    }}
                  >
                    {product.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav Menu */}
        <ul className="hidden md:flex items-center gap-6 text-white font-medium">
          {Menu.map((item) => (
            <li key={item.id}>
              <Link
                to={item.link}
                className="hover:text-orange-300 transition-all duration-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 hover:text-orange-300 transition-colors flex items-center gap-1 text-white"
            >
              {/* Avatar with First Letter */}
              <div className="w-8 h-8 bg-white text-black font-semibold rounded-full flex items-center justify-center">
                {localStorage.getItem("userName")?.charAt(0)?.toUpperCase()}
              </div>
              <FaCaretDown className="text-sm" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-200 rounded-lg shadow-lg z-50">
                {!email ? (
                  <div className="px-4 py-3 text-sm border-b border-gray-100">
                    <span>New customer? </span>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/login");
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <FaUser /> My Profile
                    </Link>
                    <Link
                      to="/myOrders"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <FaShoppingBag /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:text-red-700"
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
              className="text-white p-2 hover:text-orange-300 relative"
            >
              <FaCartShopping className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
