import React, { useState, useEffect ,Suspense } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import { CartProvider } from './components/context/CartContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from './components/CartPage/CartPage';
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Login from "./components/Login/Login";
import Signup from "./components/signup/signup";
import SearchBar from "./components/SearchBar/SearchBar";
import Profile from "./components/Profile/Profile";
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <CartProvider>
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
          <Navbar handleOrderPopup={handleOrderPopup} />
          <Suspense fallback={<div>Loading...</div>}>
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
              <Route path="/profile" element={<Profile />} />
              <Route 
                path="/product/:id" 
                element={
                  <Suspense fallback={<div>Loading product...</div>}>
                    <ProductDetail />
                  </Suspense>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Suspense>
          <Footer />
          <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        </div>
      </CartProvider>
      
    </Router>
  );
}

export default App;