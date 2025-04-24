import React, {useState, useEffect,useRef} from "react";
import { FaUser, FaShoppingBag, FaHeart, FaSignOutAlt } from 'react-icons/fa';
 
import { toast } from 'react-hot-toast';
import Cart from '../Cart/Cart.jsx';
import Logo from "../../assets/logo.jpeg";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import DarkMode from "../Products/DarkMode.jsx";
import CartSidebar from "../CartSidebar/CartSidebar";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { ProductsData } from '../Products/Products';
import SearchBar from "../SearchBar/SearchBar.jsx";
 
import { Link } from 'react-router-dom';
import SignupModal from '../Auth/SignupModal';
import LoginModal from '../Auth/LoginModal';
const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/#",
  },
  {
    id: 2,
    name: "About Us",
    link: "/#services",
  },
  {
    id: 3,
    name: "Product",
    link: "/#",
  },
  {
    id: 4,
    name: "Contact",
    link: "/#",
  },
  {
    id: 5,
    name: "Blog",
    link: "/#",
  },
];
 
const Navbar = ({ handleOrderPopup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { cartItems } = useCart();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  let email = localStorage.getItem("email");
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      const product = ProductsData.find(p =>
        p.title.toLowerCase().includes(searchTerm)
      );
     
      if (product) {
        navigate(`/product/${product.id}`);
      }
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  return (
    <>
    <nav className="shadow-sm w-full">
     
      <div className="shadow-md bg-orange-300 dark:bg-gray-900 dark:text-white duration-200  relative z-40">
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
        />
       
        {/* upper Navbar */}
        <div className="bg-primary/40 py-4">
        <div className="max-w-screen-xl mx-auto px-4 w-full flex justify-between items-center">
 
                      {/* Logo */}
                      <div className="flex items-center">
              <Link to="/" className="font-bold  text-2xl sm:text-3xl flex items-center gap-3">
                <img src={Logo} alt="Logo" className="w-14 h-14 object-contain" />
                <span className="text-gray-800 dark:text-white">Glowriti</span>
              </Link>
            </div>
 
            {/* Right Side Items */}
            <div className="flex items-center space-x-6">
              {/* Search Bar */}
              {/* <div className="w-[300px] mx-4">
                <SearchBar products={ProductsData} />
              </div> */}
 
                   {/*profile*/}
{/* Profile Dropdown */}
<div className="relative" ref={profileMenuRef}>
  <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="p-2 hover:text-orange-500 transition-colors flex items-center gap-1"
  >
    <FaUser className="text-xl text-gray-700 dark:text-white" />
    <FaCaretDown className="text-sm text-gray-700 dark:text-white" />
  </button>
 
  {showProfileMenu && (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
      {!email ? (
        <div className="px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-600">
          <span>New customer? </span>
          <button
            onClick={() => {
              setShowProfileMenu(false);
              navigate("/login");
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
          <Link
            to="/wishlist"
            onClick={() => setShowProfileMenu(false)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaHeart /> My Wishlist
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("email");
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            <FaSignOutAlt /> Logout
          </button>
        </>
      )}
    </div>
  )}
</div>
 
{/* Cart Button */}
<div className="relative ml-4">
  <button
    onClick={() => navigate("/cart")}
    className="bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
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
 
        {/* lower Navbar */}
        {/* <div data-aos="zoom-in" className="flex justify-center py-3">
          <ul className="sm:flex hidden items-center gap-6">
            {Menu.map((data) => (
              <li key={data.id}>
                <a href={data.link} className="">
                  {data.name}
                </a>
              </li>
            ))}
            <li className="group relative cursor-pointer">
              <a href="#" className="flex items-center gap-[2px] py-2">
                Testimonial
              </a>
            </li>
          </ul>
        </div> */}
       
      </div>
    </nav>
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