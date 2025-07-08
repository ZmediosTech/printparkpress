import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  Form,
  Modal,
  Radio,
  Row,
  Col,
  Typography,
  List,
  notification,
  Spin,
} from "antd";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text } = Typography;

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses")) || []
  );
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form] = Form.useForm();
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  const handleAddAddress = () => {
    setEditingIndex(null);
    form.resetFields();
    setShowAddressModal(true);
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    form.setFieldsValue(addresses[index]);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
    if (selectedIndex === index) setSelectedIndex(null);
    localStorage.setItem("addresses", JSON.stringify(updated));
    notification.success({ message: "Address removed" });
  };

  const handleSaveAddress = () => {
    form.validateFields().then((values) => {
      const updated = [...addresses];
      if (editingIndex !== null) {
        updated[editingIndex] = values;
      } else {
        updated.push(values);
      }
      setAddresses(updated);
      localStorage.setItem("addresses", JSON.stringify(updated));
      setShowAddressModal(false);
      notification.success({ message: "Address saved" });
    });
  };

  const handleContinue = () => {
    if (selectedIndex === null) {
      notification.warning({ message: "Select a delivery address" });
      return;
    }
    if (!email) {
      notification.error({ message: "Please login to place an order" });
      return;
    }
    setShowPayment(true);
  };

  const handlePlaceOrder = async () => {
    const address = addresses[selectedIndex];
    const order = {
      user: {
        email,
        fullName: address.name,
        mobile: address.mobile,
        address: {
          street: address.locality,
          city: address.cityDistrict,
          pincode: address.pincode,
        },
      },
      products: cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name || item.title,
        price: parseInt(item.price),
        image: item.imageUrl,
        quantity: item.quantity || 1,
      })),
      totalAmount: cartItems.reduce(
        (sum, item) => sum + parseInt(item.price) * (item.quantity || 1),
        0
      ),
      paymentMethod: "Cash on Delivery",
    };

    try {
      setShowPayment(false);
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await res.json();
      if (data.success) {
        setLoading(false);
        notification.success({ message: "Order placed!" });
        clearCart();
        navigate("/");
      } else {
        setLoading(false);
        notification.error({ message: "Order failed" });
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      notification.error({ message: "Something went wrong" });
    }
  };

  return (
    <Spin spinning={loading} tip="Placing your order...">
      <div className="container mx-auto max-w-6xl px-4 py-10 mt-24">
        <Title level={2} className="mb-6 text-center md:text-left" data-aos="fade-down">
          Checkout
        </Title>

        <Row gutter={[24, 24]}>
          {/* Address Section */}
          <Col xs={24} md={14} data-aos="fade-right">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-3">
              <Title level={4}>Delivery Addresses</Title>
              <Button
                type="primary"
                className="bg-blue-500"
                onClick={handleAddAddress}
              >
                Add Address
              </Button>
            </div>

            <List
              itemLayout="vertical"
              dataSource={addresses}
              renderItem={(addr, index) => (
                <Card
                  key={index}
                  className={`mb-4 p-4 rounded-lg transition-all duration-300 ${
                    selectedIndex === index
                      ? "border-blue-500 border shadow-md"
                      : "border-gray-200 border hover:shadow"
                  }`}
                >
                  <Radio
                    checked={selectedIndex === index}
                    onChange={() => setSelectedIndex(index)}
                  >
                    <Title level={5} className="mb-1">{addr.name}</Title>
                    <Text className="block">
                      {addr.address}, {addr.locality}, {addr.cityDistrict},{" "}
                      {addr.state} - {addr.pincode}
                    </Text>
                    <Text type="secondary" className="block mt-1">
                      Mobile: {addr.mobile}
                    </Text>
                  </Radio>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <Button size="small" onClick={() => handleEditAddress(index)}>
                      Edit
                    </Button>
                    <Button size="small" danger onClick={() => handleDeleteAddress(index)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              )}
            />
          </Col>

          {/* Order Summary */}
          <Col xs={24} md={10} data-aos="fade-left">
            <Card
              title="Order Summary"
              bordered
              className="p-4 rounded-lg shadow-md"
            >
              <List
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item className="py-2">
                    <List.Item.Meta
                      avatar={
                        <img
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.imageUrl}`}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      }
                      title={<span className="font-semibold">{item.title}</span>}
                      description={<span>Quantity: {item.quantity}</span>}
                    />
                    <div className="text-right font-semibold text-gray-700">
                      AUD {item.quantity * parseInt(item.price)}
                    </div>
                  </List.Item>
                )}
              />
              <div className="mt-4 text-right">
                <Title level={5}>
                  Total: AUD{" "}
                  {cartItems.reduce(
                    (sum, item) =>
                      sum + parseInt(item.price) * (item.quantity || 1),
                    0
                  )}
                </Title>
                <Button
                  type="primary"
                  block
                  className="mt-2 bg-blue-500"
                  onClick={handleContinue}
                >
                  Continue to Payment
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Address Modal */}
        <Modal
          title={editingIndex !== null ? "Edit Address" : "Add Address"}
          open={showAddressModal}
          onOk={handleSaveAddress}
          onCancel={() => setShowAddressModal(false)}
          okText="Save"
          okButtonProps={{
            style: {
              backgroundColor: "#1677ff",
              borderColor: "#1677ff",
              color: "#fff",
            },
          }}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <Form layout="vertical" form={form}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="mobile" label="Mobile Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="locality" label="Locality" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="cityDistrict" label="City / District" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Payment Modal */}
        <Modal
          title="Payment Method"
          open={showPayment}
          onCancel={() => setShowPayment(false)}
          onOk={handlePlaceOrder}
          okText="Confirm Order"
          okButtonProps={{
            style: {
              backgroundColor: "#1677ff",
              borderColor: "#1677ff",
              color: "#fff",
            },
          }}
        >
          <Radio checked>Cash on Delivery</Radio>
        </Modal>
      </div>
    </Spin>
  );
};

export default Checkout;
