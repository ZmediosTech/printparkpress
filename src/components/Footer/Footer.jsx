import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link as ScrollLink } from "react-scroll";
import footerLogo from "../../assets/logo.jpeg";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
  FaTimes,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  width: "100%",
};

const FooterLinks = [
  { title: "Home", link: "home" },
  { title: "About", link: "about" },
  { title: "Contact", link: "contact" },
  { title: "Blog", link: "blog" },
];

const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contactData = {
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      };
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contactData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      toast.success('Message sent successfully!');
      setIsContactOpen(false);
      setFormData({ email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };
  

  return (
    <>
      <div style={BannerImg} className="text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="zoom-in" className="grid md:grid-cols-3 gap-8 pt-10 pb-32">
            {/* Company Details */}
            <div>
              <h1 className="sm:text-3xl text-xl font-bold mb-3 flex items-center gap-3">
                <img src={footerLogo} alt="Glowriti Logo" className="max-w-[50px]" />
                Glowriti
              </h1>
              <p className="text-gray-300 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
                beatae ea recusandae blanditiis veritatis.
              </p>
            </div>

            {/* Footer Links */}
            <div className="md:col-span-1">
              <h1 className="text-xl font-bold mb-3">Important Links</h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((item) => (
                  <li key={item.title}>
                    {item.title === "Contact" ? (
                      <button
                        onClick={() => setIsContactOpen(true)}
                        className="cursor-pointer hover:text-orange-500 transition-all duration-200 text-gray-200"
                      >
                        {item.title}
                      </button>
                    ) : (
                      <ScrollLink
                        to={item.link}
                        smooth={true}
                        duration={800}
                        offset={-70}
                        className="cursor-pointer hover:text-orange-500 transition-all duration-200 text-gray-200"
                      >
                        {item.title}
                      </ScrollLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Contact */}
            <div>
              <h1 className="text-xl font-bold mb-3">Contact Us</h1>
              <div className="flex items-center gap-3 mb-3">
                <FaLocationArrow />
                <p>Noida, Uttar Pradesh</p>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <FaMobileAlt />
                <p>+91 123456789</p>
              </div>
              <div className="flex items-center gap-4">
                <a href="#"><FaInstagram className="text-2xl hover:text-orange-500 transition" /></a>
                <a href="#"><FaFacebook className="text-2xl hover:text-orange-500 transition" /></a>
                <a href="#"><FaLinkedin className="text-2xl hover:text-orange-500 transition" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Popup */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
            <button 
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;