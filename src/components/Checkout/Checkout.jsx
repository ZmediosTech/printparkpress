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
  const userId = localStorage.getItem("userId");
  console.log(cartItems, "cartItems");

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
      );
      const data = await res.json();
      if (data.success) setAddresses(data.addresses);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    form.resetFields();
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    form.setFieldsValue(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/${addressId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        notification.success({ message: "Address deleted" });
        if (selectedAddressId === addressId) setSelectedAddressId(null);
      }
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to delete address" });
    }
  };

  const handleSaveAddress = async () => {
    try {
      const values = await form.validateFields();
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress
        ? `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/${
            editingAddress._id
          }`
        : `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        setShowAddressModal(false);
        notification.success({
          message: `Address ${
            editingAddress ? "updated" : "added"
          } successfully`,
        });
      }
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to save address" });
    }
  };

  const handleContinue = () => {
    if (!selectedAddressId)
      return notification.warning({ message: "Select a delivery address" });
    if (!email)
      return notification.error({ message: "Please login to place an order" });
    setShowPayment(true);
  };

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses.find(
      (addr) => addr._id === selectedAddressId
    );
    const order = {
      user: {
        email,
        fullName: selectedAddress?.fullName,
        mobile: selectedAddress.mobile,
        address: {
          street: selectedAddress.locality,
          city: selectedAddress.city,
          pincode: selectedAddress.pincode,
        },
      },
      products: cartItems?.map((item) => ({
        productId: item?.product?._id,
        name: item?.name || item.product?.title,
        price: parseInt(item?.product?.price),
        image: item?.product?.imageUrl,
        quantity: item.quantity || 1,
      })),
      totalAmount: cartItems.reduce(
        (sum, item) =>
          sum + parseInt(item.product?.price) * (item.quantity || 1),
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
        notification.success({ message: "Order placed!" });
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/cart/clear/${userId}`,
          {
            method: "DELETE",
          }
        );
        clearCart();
        navigate("/myOrders");
      } else {
        notification.error({ message: "Order failed" });
      }
    } catch (err) {
      console.error(err);
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} tip="Placing your order...">
      <div className="container mx-auto max-w-6xl px-4 py-10 mt-20">
        <Title
          level={2}
          className="mb-6 text-center md:text-left"
          data-aos="fade-down"
        >
          Checkout
        </Title>

        <Row gutter={[24, 24]}>
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
              renderItem={(addr) => (
                <Card
                  key={addr._id}
                  className={`mb-4 p-4 rounded-lg transition-all duration-300 ${
                    selectedAddressId === addr._id
                      ? "border-blue-500 border shadow-md"
                      : "border-gray-200 border hover:shadow"
                  }`}
                >
                  <Radio
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                  >
                    <Title level={5} className="mb-1">
                      {addr.name}
                    </Title>
                    <Text className="block">
                      {addr.address}, {addr.locality}, {addr.cityDistrict},{" "}
                      {addr.state} - {addr.pincode}
                    </Text>
                    <Text type="secondary" className="block mt-1">
                      Mobile: {addr.mobile}
                    </Text>
                  </Radio>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <Button
                      size="small"
                      onClick={() => handleEditAddress(addr)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => handleDeleteAddress(addr._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              )}
            />
          </Col>

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
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${
                            item?.product?.imageUrl
                          }`}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      }
                      title={
                        <span className="font-semibold">
                          {item?.product?.title}
                        </span>
                      }
                      description={<span>Quantity: {item?.quantity}</span>}
                    />
                    <div className="text-right font-semibold text-gray-700">
                      AED {item.quantity * parseInt(item?.product?.price)}
                    </div>
                  </List.Item>
                )}
              />
              <div className="mt-4 text-right">
                <Title level={5}>
                  Total: AED{" "}
                  {cartItems.reduce(
                    (sum, item) =>
                      sum +
                      parseInt(item?.product?.price) * (item.quantity || 1),
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
          title={editingAddress ? "Edit Address" : "Add Address"}
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
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Full Name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: "Mobile number is required" },
                {
                  pattern: /^05\d{8}$/,
                  message: "Enter valid UAE mobile (e.g., 0501234567)",
                },
              ]}
            >
              <Input maxLength={10} placeholder="0501234567" />
            </Form.Item>

            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[
                { required: true, message: "Pincode is required" },
                {
                  pattern: /^\d{5,6}$/,
                  message: "Pincode must be 5 or 6 digits only",
                },
              ]}
            >
              <Input maxLength={6} placeholder="123456" />
            </Form.Item>

            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "State is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="locality"
              label="Locality"
              rules={[{ required: true, message: "Locality is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="city"
              label="City / District"
              rules={[{ required: true, message: "City/District is required" }]}
            >
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
