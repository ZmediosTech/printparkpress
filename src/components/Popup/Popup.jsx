import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
const Popup = ({ orderPopup, setOrderPopup }) => {
  return (
    <>
      {orderPopup && (
        <div className="popup">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[300px]">
              {/* header */}
              <div className="flex items-center justify-between  mb-6">
              <div className="flex items-center gap-3">
                  <FaShoppingBag className="text-primary text-2xl" />
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Order Now</h1>
                </div>
                <div>
                  <IoCloseOutline
                    className="text-2xl cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => setOrderPopup(false)}
                  />
                </div>
              </div>
              {/* form section */}
          
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex justify-center pt-4">
                  <button className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-300 text-white py-3 px-8 rounded-lg w-full font-semibold shadow-lg hover:shadow-xl transition-all">
                    Place Order
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
