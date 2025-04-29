import React, { useState } from "react";
import Banner from "../../assets/website/orange-pattern.jpg";
import toast from "react-hot-toast";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
};

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscribe`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.success == true) {
      setLoading(false);

        toast.success("Thanks for subscribing")
        setMessage("Thanks for subscribing!");
        setEmail("");
      } else {
        toast.error("Something went wrong.")
        setMessage(data.error || "Something went wrong.");
      setLoading(false);

      }
    } catch (error) {
      console.error("Subscribe error:", error);
      setMessage("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }
  return (
    <div
      data-aos="zoom-in"
      className="m-4 sm:m-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-white shadow-lg"
      style={BannerImg}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 backdrop-blur-sm">
        <div className="space-y-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-bold text-center">
            Get Notified About New Products
          </h1>
          <p className="text-black text-sm sm:text-base text-center sm:text-left mx-20">
            Sign up to our newsletter to receive grooming tips, style inspiration,
            exclusive access to pre-launch product pricing and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 max-w-md mx-auto sm:mx-0">
            <input
              data-aos="fade-up"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading || !email}
              className={`px-6 py-3 font-medium rounded-md transition ${
                loading || !email
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          {/* {message && (
            <p className="text-sm text-center text-white font-medium mt-2">
              {message}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
