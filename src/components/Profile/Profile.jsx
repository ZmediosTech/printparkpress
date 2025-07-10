import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Typography,
  Space,
  message,
  Popconfirm,
} from "antd";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    AOS.init({ duration: 700 });
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
      );
      const data = await res.json();
      if (data.success) setAddresses(data.addresses);
      else message.error("Failed to load addresses");
    } catch {
      message.error("Error loading addresses");
    }
  };

  const openModal = (index = null) => {
    if (index !== null) {
      form.setFieldsValue(addresses[index]);
      setEditIndex(index);
    } else {
      form.resetFields();
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const handleSave = async (values) => {
    try {
      if (editIndex !== null) {
        // Update address
        const addressId = addresses[editIndex]._id;
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/${addressId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        const data = await res.json();
        if (data.success) {
          setAddresses(data.addresses);
          message.success("Address updated successfully");
        }
      } else {
        // Add new address
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        const data = await res.json();
        if (data.success) {
          setAddresses(data.addresses);
          message.success("Address added successfully");
        }
      }
      setShowModal(false);
    } catch {
      message.error("Failed to save address");
    }
  };

  const handleDelete = async (index) => {
    try {
      const addressId = addresses[index]._id;
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/${addressId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        message.success("Address removed");
      }
    } catch {
      message.error("Failed to delete address");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="text-center mb-8 mt-4" data-aos="fade-down">
          My Profile
        </Title>

        <Card
          title="My Addresses"
          className="shadow-xl rounded-xl mb-12"
          extra={
            <Button
              className="bg-blue-500"
              type="primary"
              onClick={() => openModal()}
              data-aos="zoom-in"
            >
              Add Address
            </Button>
          }
          data-aos="fade-up"
        >
          <Row gutter={[24, 24]}>
            {addresses.length === 0 ? (
              <Col span={24}>
                <Text type="secondary">No address added yet.</Text>
              </Col>
            ) : (
              addresses.map((address, index) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  key={address._id}
                  data-aos="fade-up"
                >
                  <Card
                    type="inner"
                    title={<Text strong>{address.name}</Text>}
                    className="rounded-lg shadow-md"
                    actions={[
                      <Button type="link" onClick={() => openModal(index)}>
                        Edit
                      </Button>,
                      <Popconfirm
                        title="Are you sure to delete this address?"
                        onConfirm={() => handleDelete(index)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                          type: "primary",
                          style: {
                            backgroundColor: "#1677ff",
                            borderColor: "#1677ff",
                          },
                        }}
                      >
                        <Button type="link" danger>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Space direction="vertical" size="small">
                      <Text>{address.address}</Text>
                      <Text>
                        {address.locality}, {address.cityDistrict}
                      </Text>
                      <Text>
                        {address.state} - {address.pincode}
                      </Text>
                      <Text>📞 {address.mobile}</Text>
                      {address.email && <Text>📧 {address.email}</Text>}
                    </Space>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Card>

        {/* Modal */}
        <Modal
          title={editIndex !== null ? "Edit Address" : "Add New Address"}
          open={showModal}
          onCancel={() => setShowModal(false)}
          onOk={async () => {
            try {
              const values = await form.validateFields();
              handleSave(values);
            } catch (err) {
              console.log("Validation Failed:", err);
            }
          }}
          okText="Save"
          destroyOnClose
          width={600}
          okButtonProps={{
            type: "primary",
            style: { backgroundColor: "#1677ff", borderColor: "#1677ff" },
          }}
        >
          <Form form={form} layout="vertical" className="pt-2">
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Full name is required" }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: "Mobile number is required" },
                {
                  pattern: /^05\d{8}$/,
                  message: "Enter a valid UAE mobile number (e.g., 0501234567)",
                },
              ]}
            >
              <Input placeholder="0501234567" maxLength={10} />
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
              <Input placeholder="Enter pincode" maxLength={6} />
            </Form.Item>

            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "State is required" }]}
            >
              <Input placeholder="State" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Full Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input.TextArea rows={2} placeholder="House No, Street, Area" />
            </Form.Item>

            <Form.Item
              name="locality"
              label="Locality"
              rules={[{ required: true, message: "Locality is required" }]}
            >
              <Input placeholder="Locality" />
            </Form.Item>

            <Form.Item
              name="cityDistrict"
              label="City / District"
              rules={[{ required: true, message: "City/District is required" }]}
            >
              <Input placeholder="City/District" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
