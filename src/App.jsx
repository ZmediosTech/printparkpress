import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import CartPage from "./components/CartPage/CartPage";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import Checkout from "./components/Checkout/Checkout";

import { CartProvider } from "./components/context/CartContext";
import { AuthProvider } from "./components/context/AuthContext";

import AOS from "aos";
import "aos/dist/aos.css";

// ✅ Toastify
import { Toaster } from "react-hot-toast";

function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
            <Navbar handleOrderPopup={handleOrderPopup} />

            {/* ✅ Toast Container */}
            <Toaster position="top-right" reverseOrder={false} />

            <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero handleOrderPopup={handleOrderPopup} />
                      <Products handleOrderPopup={handleOrderPopup} />
                      <Banner />
                      <Subscribe />
                      <Testimonials />
                    </>
                  }
                />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<div className="text-center py-20 text-xl">404 - Page Not Found</div>} />
              </Routes>
            </Suspense>

            <Footer />
            <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
