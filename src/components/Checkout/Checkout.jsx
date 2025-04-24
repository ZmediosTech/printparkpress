import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  console.log(cartItems,"cart")
  const { userEmail } = useAuth();
  console.log(userEmail,"userEmail")
  const navigate = useNavigate();
  const email = localStorage.getItem("email")
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingIndex, setIsEditingIndex] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  // Add new state for payment step
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  // Replace handlePlaceOrder with these two functions
  const handleContinueToPayment = () => {
    // if (!userEmail) {
    //   toast.error("Please enter your email");
    //   return;
    // }
    setShowPaymentOptions(true);
  };
  const handleConfirmOrder = async () => {
    console.log("called");
    try {
      // ... existing order data preparation ...
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orederId: 5 }),
      });

      if (response.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to place order");
    }
  };
  const [profileData, setProfileData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    addresses: JSON.parse(localStorage.getItem("addresses")),
  });

  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile: "",
    pincode: "",
    state: "",
    address: "",
    locality: "",
    cityDistrict: "",
    addressType: "Home",
    weekends: {
      saturday: false,
      sunday: false,
    },
    isDefault: false,
  });

  const handleDeliverHere = (index) => {
    setSelectedAddressIndex(index);
    setShowOrderSummary(true);
    toast.success("Address selected for delivery", {
      style: {
        background: "#fff",
        color: "#015c3b",
        border: "1px solid #86efac",
      },
    });
  };

  const handleEditClick = (index) => {
    setIsEditingIndex(index);
    setNewAddress(profileData.addresses[index]);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = [...profileData.addresses];
    updatedAddresses.splice(index, 1);

    setProfileData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));

    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(null);
    } else if (selectedAddressIndex > index) {
      setSelectedAddressIndex((prev) => prev - 1);
    }

    toast.success("Address deleted");
  };

  const handleAddNewAddress = () => {
    setIsEditingIndex(null);
    setNewAddress({
      name: "",
      mobile: "",
      pincode: "",
      state: "",
      address: "",
      locality: "",
      cityDistrict: "",
      addressType: "Home",
      // weekends: {
      //   saturday: false,
      //   sunday: false,
      // },
      isDefault: false,
    });
    setShowAddressForm(true);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "saturday" || name === "sunday") {
        setNewAddress((prev) => ({
          ...prev,
          weekends: {
            ...prev.weekends,
            [name]: checked,
          },
        }));
      } else {
        setNewAddress((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setNewAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const updatedAddresses = [...(profileData?.addresses || [])];


    if (isEditingIndex !== null) {
      updatedAddresses[isEditingIndex] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }

    setProfileData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));

    setShowAddressForm(false);
    setNewAddress({
      name: "",
      mobile: "",
      pincode: "",
      state: "",
      address: "",
      locality: "",
      cityDistrict: "",
      addressType: "Home",
      weekends: {
        saturday: false,
        sunday: false,
      },
      isDefault: false,
    });
  };

  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === null) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      const selected = profileData.addresses[selectedAddressIndex];
      console.log(selected,"selected")
      const orderData = {
        user: {
          email: email ,
          fullName: selected.name,
          mobile: selected.mobile,
          address: {
            street: selected.locality,
            city: selected.cityDistrict,
            pincode: selected.pincode,
          },
        },
        products: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: parseInt(item.price),
          image: item.imageUrl,
          quantity: item.quantity || 1,
        })),
        totalAmount: cartItems.reduce((sum, item) => {
          const price = parseInt(item.price);
          return sum + price * (item.quantity || 1);
        }, 0),
        paymentMethod: "Cash on Delivery",
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if(data.success == true){
        console.log("Order placed successfully:", data);
        toast("Order placed successfully!", {
          style: {
            background: "#fff",
            color: "#000",
            border: "1px solid #ddd",
          },
        });
        navigate("/")
    clearCart();

      }
   
    } catch (error) {
      console.error("Error placing order:", error);
    }

  };

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(profileData.addresses));
  }, [profileData.addresses]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="w-full mb-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            Select Delivery Address
          </h3>
          <button
            onClick={handleAddNewAddress}
            className="px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50"
          >
            + Add New Address
          </button>
          {profileData?.addresses?.map((address, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 mt-8 mb-4 ${
                selectedAddressIndex === index
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-gray-600 mt-1">{address.address}</p>
                  <p className="text-gray-600">
                    {address.cityDistrict}, {address.state} {address.pincode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeliverHere(index)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedAddressIndex === index
                        ? "bg-orange-500 text-white"
                        : "border border-orange-500 text-orange-500 hover:bg-orange-50"
                    }`}
                  >
                    Deliver Here
                  </button>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(index)}
                    className="px-4 py-2 border rounded-lg text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          {showOrderSummary && (
            <div className="w-full bg-white border rounded-lg shadow-sm">
              <div className="bg-orange-500 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center">
                  ORDER SUMMARY
                </h3>
              </div>
              <div className="p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4 mb-4"
                  >
                     <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <div>
                        <h4 className="font-medium text-lg text-gray-800 mb-1">{item.name}</h4>
                        <p className="text-gray-600 text-sm">
                          Quantity: {item.quantity}
                        </p>
                        {/* <p className="text-green-600 text-sm">
                          Delivery by{" "}
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          | Free
                        </p> */}
                      </div>
                      <p className="font-semibold text-orange-500 mt-2">
                        ₹{parseFloat(item.price) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                {/* <div className="flex justify-between items-center border-t pt-4">
                  <div className="flex-grow">
                    <p className="font-semibold">Total Amount</p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Order confirmation email will be sent to
                      </p>
                      <input
                        type="email"
                        value={userEmail}
                        className="w-full max-w-xs border-b border-blue-500 focus:outline-none py-1"
                        placeholder="Enter your email ID"
                      />
                    </div>
                  </div>
                </div> */}
                <div className="text-right">
                  <p className="font-semibold mb-4">
                    ₹
                    {cartItems.reduce(
                      (total, item) =>
                        total + parseFloat(item.price) * item.quantity,
                      0
                    )}
                  </p>
                  <button
                    onClick={handleContinueToPayment}
                    className="bg-orange-500 text-white px-8 py-3 rounded font-semibold hover:bg-orange-600 transition-colors"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={newAddress.name}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile *"
                  value={newAddress.mobile}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode *"
                  value={newAddress.pincode}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md"
                  required
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address *"
                value={newAddress.address}
                onChange={handleAddressChange}
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="locality"
                placeholder="Locality/Town *"
                value={newAddress.locality}
                onChange={handleAddressChange}
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="cityDistrict"
                placeholder="City/District *"
                value={newAddress.cityDistrict}
                onChange={handleAddressChange}
                className="border p-2 rounded-md w-full"
                required
              />
              {/* <div className="space-y-3">
                <p className="font-medium">Type of Address *</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="addressType"
                      value="Home"
                      checked={newAddress.addressType === "Home"}
                      onChange={handleAddressChange}
                    />
                    Home
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="addressType"
                      value="Office"
                      checked={newAddress.addressType === "Office"}
                      onChange={handleAddressChange}
                    />
                    Office
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p>Is your office open on weekends?</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="saturday"
                      checked={newAddress.weekends.saturday}
                      onChange={handleAddressChange}
                    />
                    Open on Saturday
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="sunday"
                      checked={newAddress.weekends.sunday}
                      onChange={handleAddressChange}
                    />
                    Open on Sunday
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleAddressChange}
                />
                Make this as my default address
              </label> */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPaymentOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            <div className="border rounded-lg p-4 mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={true}
                  readOnly
                  className="form-radio text-orange-500"
                />
                <span className="font-medium">Cash on Delivery</span>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPaymentOptions(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
