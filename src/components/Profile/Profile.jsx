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
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses")) || []
  );
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {
      fullName: "John Doe",
      email: "john@example.com",
      mobile: "1234567890",
    }
  );

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [addresses, userInfo]);

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

  const handleSave = (values) => {
    const updatedAddresses = [...addresses];
    if (editIndex !== null) {
      updatedAddresses[editIndex] = values;
      message.success("Address updated successfully");
    } else {
      updatedAddresses.push(values);
      message.success("Address added successfully");
    }
    setAddresses(updatedAddresses);
    setShowModal(false);
  };

  const handleDelete = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    message.success("Address removed");
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
                <Col xs={24} sm={12} md={8} key={index} data-aos="fade-up">
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
                    </Space>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Card>

        {/* Address Modal */}
        <Modal
          title={editIndex !== null ? "Edit Address" : "Add New Address"}
          open={showModal}
          onCancel={() => setShowModal(false)}
          onOk={() => form.submit()}
          okText="Save"
          destroyOnClose
          width={600}
          
          okButtonProps={{
            type: "primary",
            style: { backgroundColor: "#1677ff", borderColor: "#1677ff" },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="pt-2"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Mobile number" />
            </Form.Item>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[{ required: true }]}
            >
              <Input placeholder="Pincode" />
            </Form.Item>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input placeholder="State" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Full Address"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={2} placeholder="House No, Street, Area" />
            </Form.Item>
            <Form.Item
              name="locality"
              label="Locality"
              rules={[{ required: true }]}
            >
              <Input placeholder="Locality" />
            </Form.Item>
            <Form.Item
              name="cityDistrict"
              label="City / District"
              rules={[{ required: true }]}
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
