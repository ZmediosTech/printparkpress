import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Card, Typography } from "antd";
import axios from "axios";
import { toast } from "react-hot-toast";
import image from "../../assets/contact1.jpg";
import contact from "../../assets/hero/contact2.avif";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Paragraph } = Typography;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // loading state

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/contact`, values);
      toast.success("Message sent successfully");
      form.resetFields();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20">
      {/* Hero Section with Form */}
      <div
        className="relative h-[100vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 w-full max-w-2xl px-4" data-aos="fade-up">
          <Card className="rounded-2xl shadow-2xl p-6  backdrop-blur-md">
            <Title level={3} className="text-center mb-6">
              Get in Touch
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input size="large" placeholder="John Doe" disabled={loading} />
              </Form.Item>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: "Please enter your message" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  size="large"
                  placeholder="How can we help you?"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      {/* Map & Address Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12} data-aos="fade-right">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Burj Khalifa Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.1221776432164!2d55.27187661500781!3d25.197197983895266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4336e98d9c27%3A0xcabfd1d17ec1e990!2sBurj%20Khalifa!5e0!3m2!1sen!2sin!4v1658419999999!5m2!1sen!2sin"
                width="100%"
                height="300"
                allowFullScreen=""
                loading="lazy"
                className="rounded-xl border"
              />
            </div>
          </Col>
          <Col xs={24} md={12} data-aos="fade-left">
            <Title level={2} className="mb-2">
              Visit Our Store
            </Title>
            <Paragraph className="text-gray-700 text-lg leading-relaxed">
              Your trusted stationery partner located in the heart of Dubai. We
              offer high-quality stationery for schools, offices, and creatives.
              Feel free to drop by or send us a message!
            </Paragraph>
            <Paragraph className="font-semibold text-base mt-4">
              📍 Dubai, United Arab Emirates
            </Paragraph>
          </Col>
        </Row>
      </div>

      {/* Trust Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12} data-aos="fade-up">
            <Title level={3}>Your Trusted Stationery Partner</Title>
            <Paragraph className="text-gray-600 text-lg leading-relaxed">
              At PrintParkPress, we believe in offering premium stationery with
              unmatched service. Whether you’re a student, professional, or
              artist, our curated selection helps you bring out your best work
              daily.
            </Paragraph>
          </Col>
          <Col xs={24} md={12} data-aos="zoom-in">
            <img
              src={contact}
              alt="Trusted Partner"
              className="w-full h-[300px] object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x300?text=Stationery+Image";
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Contact;
