import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./components/context/CartContext"; // ✅ import
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartWrapper />
    </BrowserRouter>
  </React.StrictMode>
);

// ✅ Wrapper component to dynamically pass userId
function CartWrapper() {
  const [userId, setUserId] = React.useState(localStorage.getItem("userId"));

  // Listen for login updates
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <CartProvider userId={userId}>
      <App />
    </CartProvider>
  );
}
