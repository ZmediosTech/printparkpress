import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

import Logo from "../../assets/hero/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";

const FooterLinks = [
  { title: "Home", link: "home" },
  { title: "About", link: "about" },
  { title: "Contact", link: "contact" },
];

const Footer = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({ email: "", phone: "", message: "" });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      className="w-full text-white bg-[#44A0A0]"
      style={{
        // backgroundImage: `url(${Banner})`,
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div data-aos="zoom-in">
            <div className="mb-4">
              <img
                src={Logo}
                alt="Printpark Press Logo"
                className="h-14 w-28 object-cover"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Printpark Press is a modern, responsive eCommerce platform designed for a seamless shopping experience — browse, manage your cart, and checkout with ease.
            </p>
          </div>

          {/* Important Links */}
          <div data-aos="zoom-in">
            <h2 className="text-lg font-semibold mb-4">Important Links</h2>
            <ul className="space-y-3">
              {FooterLinks.map((item) => (
                <li key={item.title}>
                  {item.title === "Contact" ? (
                    <button
                      onClick={() => nav("/contact")}
                      className="hover:text-orange-400 transition"
                    >
                      {item.title}
                    </button>
                  ) : (
                    <ScrollLink
                      to={item.link}
                      smooth={true}
                      duration={500}
                      offset={-70}
                      className="cursor-pointer hover:text-orange-400 transition"
                    >
                      {item.title}
                    </ScrollLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info + Socials */}
          <div data-aos="zoom-in">
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <div className="flex items-center gap-3 mb-3">
              <FaLocationArrow />
              <span>Burj Khalifa, Dubai</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <FaMobileAlt />
              <span>+91 123456789</span>
            </div>
            <div className="flex gap-4 text-2xl">
              <a href="#" aria-label="Instagram" className="hover:text-orange-400 transition">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-orange-400 transition">
                <FaFacebook />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-orange-400 transition">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/30 pt-6 text-center text-sm text-white/80">
          &copy; {new Date().getFullYear()} Printpark Press. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
