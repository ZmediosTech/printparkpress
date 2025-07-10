import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MyOrders from "./components/MyOrders/MyOrders";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import About from "./components/About/About";

import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import CartPage from "./components/CartPage/CartPage";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Checkout from "./components/Checkout/Checkout";
import Wishlist from "./components/Wishlist/Wishlist";
import Admin from "./components/Admin/Admin";
import { CartProvider } from "./components/context/CartContext";
import { AuthProvider } from "./components/context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Signup from "./components/signup/signup";
import Product from "./components/Product/Product";
import Contact from "./components/Contact/Contact";

function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
    try {
      AOS.init({
        offset: 100,
        duration: 800,
        easing: "ease-in-sine",
        delay: 100,
      });
      AOS.refresh();
    } catch (error) {
      console.error("AOS initialization error:", error);
    }
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  const userId = localStorage.getItem("userId");
  const excludedPaths = ["/login", "/signup", "/reset-password", "/admin"];
  const showNavbarAndFooter = !excludedPaths.includes(location?.pathname);

  return (
    <AuthProvider>
        <div className="bg-[#F1F1F1]  dark:bg-gray-900 dark:text-white duration-200">
          {showNavbarAndFooter && (
            <Navbar handleOrderPopup={handleOrderPopup} />
          )}

          <Toaster position="top-right" reverseOrder={false} />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero handleOrderPopup={handleOrderPopup} />
                  {/* <About /> */}
                  <Products show={false} handleOrderPopup={handleOrderPopup} />
                  {/* <Banner /> */}
                  {/* <Subscribe /> */}
                  <Testimonials />
                </>
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product" element={<Products show={true} />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Product />} />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/myOrders" element={<MyOrders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="*"
              element={
                <div className="text-center py-20 text-xl">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>

          {showNavbarAndFooter && <Footer />}
          <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        </div>
    </AuthProvider>
  );
}

export default App;
