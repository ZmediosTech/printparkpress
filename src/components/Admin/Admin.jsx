import React, { useEffect, useState } from "react";

import {
  Layout,
  Menu,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Popconfirm,
  Image,
  Card,
  Select,
} from "antd";
import {
  AppstoreOutlined,
  ShoppingOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/hero/image.jfif";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const HomePage = () => {
  const [menuKey, setMenuKey] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [contact, setContact] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editReviewModalOpen, setEditReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewForm] = Form.useForm();

  const [reviewForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (menuKey === "orders") fetchOrders();
  }, [menuKey]);

  const fetchProducts = async () => {
    // const res = await fetch("http://localhost:5000/api/products");
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
    const data = await res.json();
    if (data.success) setProducts(data.data);
  };

  const fetchOrders = async () => {
    setOrderLoading(true);
    try {
      // const res = await fetch("http://localhost:5000/api/orders");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    form.setFieldsValue({
      title: product.title,
      subtitle: product.subtitle,
      category: product.category,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
    });
    setImagePreview(
      `${import.meta.env.VITE_IMAGE_BASE_URL}${product.imageUrl}`
    );
    setFileList([]);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("subtitle", values.subtitle);
    formData.append("category", values.category);

    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("originalPrice", values.originalPrice);
    // if (fileList.length === 0) {
    //   message.error("Product image is required");
    //   return;
    // }
    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/products/${currentProduct._id}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    const data = await res.json();
    if (data.success) {
      message.success("Product updated");
      fetchProducts();
      setEditModalOpen(false);
    } else {
      message.error("Update failed");
    }
  };

  const checkVerification = async () => {
    const email = localStorage.getItem("email");
    if (email == "arihant@yopmail.com") {
      setLoading(false);
    } else { 
      navigate("/")
      // window.location.href = "http://localhost:5173/login";
    }
  };
  const handleUpdateReview = async () => {
    const values = await editReviewForm.validateFields();
    const res = await fetch(
      // `http://localhost:5000/api/reviews/${editingReview._id}`,
      `${import.meta.env.VITE_API_BASE_URL}/reviews/${editingReview._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const data = await res.json();
    if (data.success) {
      message.success("Review updated");
      fetchReviews();
      setEditReviewModalOpen(false);
    } else {
      message.error("Failed to update review");
    }
  };
  const openEditReview = (review) => {
    setEditingReview(review);
    editReviewForm.setFieldsValue(review);
    setEditReviewModalOpen(true);
  };

  // const handleDeleteReview = async (id) => {
  //   const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
  //     method: "DELETE",
  //   });
  //   const data = await res.json();
  //   if (data.success) {
  //     message.success("Review deleted");
  //     fetchReviews();
  //   } else {
  //     message.error("Failed to delete review");
  //   }
  // };

  useEffect(() => {
    //  checkVerification();
  }, []);
  const handleAddProduct = async () => {
    const values = await addForm.validateFields();
    const formData = new FormData();
    formData.append("title", values?.title);
    formData.append("subtitle", values?.subtitle);
    formData.append("category", values?.category);

    formData.append("description", values?.description);
    formData.append("price", values?.price);
    formData.append("originalPrice", values?.originalPrice);

    if (addFileList.length > 0) {
      formData.append("image", addFileList[0].originFileObj);
    }
    if (addFileList.length === 0) {
      message.error("Product image is required");
      return;
    }

    // const res = await fetch("http://localhost:5000/api/products", {
    //   method: "POST",
    //   body: formData,
    // });

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      message.success("Product added");
      fetchProducts();
      setAddModalOpen(false);
      addForm.resetFields();
      setAddFileList([]);
    } else {
      message.error("Failed to add product");
    }
  };
  const fetchContact = async () => {
    // const res = await fetch("http://localhost:5000/api/contact");
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contact`);

    const data = await res.json();
    if (data.success) setContact(data.data);
  };

  useEffect(() => {
    if (menuKey === "contact") fetchContact();
  }, [menuKey]);
  const handleStatusChange = async (orderId, productId, newStatus) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/orders/update-product-status/${orderId}/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();

      if (data.success) {
        message.success("Product status updated");
        fetchOrders();
        // Ideally refetch orders here to reflect UI changes
      } else {
        message.error(data.error || "Update failed");
      }
    } catch (err) {
      console.error("Status update error:", err);
      message.error("Server error");
    }
  };

  const productColumns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (url) => (
        <Image
          width={50}
          height={50}
          // src={`http://localhost:5000${url}`}
          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${url}`}
          fallback="https://via.placeholder.com/50"
        />
      ),
    },
    { title: "Title", dataIndex: "title" },
    { title: "Subtitle", dataIndex: "subtitle" },
    {
      title: "Category",
      dataIndex: "category",
    },

    { title: "Description", dataIndex: "description", ellipsis: true },
    {
      title: "Discount Price",
      dataIndex: "price",
      render: (price) => `AED ${price}`,
    },
    {
      title: "Original Price",
      dataIndex: "originalPrice",
      render: (originalPrice) => `AED ${originalPrice}`,
    },
    {
      title: "Actions",
      render: (record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setProductToDelete(record);
              setDeleteModalOpen(true);
            }}
          />
        </>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Full Name",
      dataIndex: ["user", "fullName"],
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
    },
    {
      title: "Mobile",
      dataIndex: ["user", "mobile"],
    },
    {
      title: "Address",
      render: (record) => {
        const { street, city, pincode } = record.user?.address || {};
        return `${street || ""}, ${city || ""}, ${pincode || ""}`;
      },
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      render: (d) =>
        new Date(d).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Products",
      dataIndex: "products",
      render: (products) => (
        <ul style={{ paddingLeft: 16 }}>
          {products?.map((p) => (
            <li key={p._id}>
              {p.name} x {p.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Image",
      dataIndex: "products",
      render: (products) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {products?.map((p) => (
            <div
              key={p._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fafafa",
                padding: 6,
                borderRadius: 4,
              }}
            >
              <Image
                width={50}
                height={50}
                // src={`http://localhost:5000${p.imageUrl || p.image}`}
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${
                  p.imageUrl || p.image
                }`}
                alt={p.name}
                style={{ objectFit: "cover", borderRadius: 4 }}
                fallback="https://via.placeholder.com/50"
                preview={{
                  maskClassName: "preview-mask", // Optional styling
                }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "products",
      render: (products, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {products?.map((p) => {
            const isStatusFinal =
              p.status === "Delivered" || p.status === "Cancelled";

            const handleSelectChange = (value) => {
              Modal.confirm({
                title: "Confirm Status Change",
                content: `Are you sure you want to change status to "${value}"?`,
                okText: "Yes",
                cancelText: "No",
                onOk: () => handleStatusChange(record._id, p.productId, value),
                okButtonProps: {
                  style: {
                    backgroundColor: "#1677ff",
                    borderColor: "#1677ff",
                    color: "#fff",
                  },
                },
              });
            };

            return (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fafafa",
                  padding: 6,
                  borderRadius: 4,
                }}
                title={isStatusFinal ? "Status update is disabled" : ""}
              >
                <Select
                  value={p.status || "Processing"}
                  style={{ width: 140 }}
                  disabled={isStatusFinal}
                  onChange={handleSelectChange}
                  options={[
                    { label: "Confirmed", value: "Confirmed" },

                    { label: "Processing", value: "Processing" },
                    { label: "Shipped", value: "Shipped" },
                    { label: "Delivered", value: "Delivered" },
                    { label: "Cancelled", value: "Cancelled" },
                  ]}
                />
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: "Total",
      render: (record) => {
        const total = record.products.reduce(
          (sum, p) => sum + p.price * p.quantity,
          0
        );
        return `AED${total.toLocaleString("en-IN")}`;
      },
    },
  ];
  const contactColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Message", dataIndex: "message" },
    { title: "Email", dataIndex: "email" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" className="">
        <div style={{ color: "white", textAlign: "center", padding: 16 }}>
          Admin
        </div>
        <img
          onClick={() => navigate("/")}
          src={Logo}
          alt="Logo"
          className="w-14 h-14 px-2 mx-4 object-contain"
        />
        <Menu
        
          theme="dark"
          mode="inline"
          selectedKeys={[menuKey]}
          onClick={({ key }) => setMenuKey(key)}
          items={[
            {
              key: "products",
              icon: <AppstoreOutlined />,
              label: "Products",
            },
            {
              key: "orders",
              icon: <ShoppingOutlined />,
              label: "Orders",
            },
            {
              key: "contact",
              icon: <AppstoreOutlined />,
              label: "Contacts",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff" }}>
          <h2 className="text-center font-semibold text-2xl mt-4">
            Admin Panel
          </h2>
        </Header>
        <Content style={{ margin: 24 }}>
          {menuKey === "products" && (
            <Card
              title="Product List"
              extra={
                <Button
                  className="bg-blue-600 text-white"
                  type="primary"
                  onClick={() => setAddModalOpen(true)}
                >
                  Add Product
                </Button>
              }
            >
              <Table
                dataSource={products}
                columns={productColumns}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 5 }}
              />
            </Card>
          )}

          {menuKey === "orders" && (
            <Card title="Order List">
              <Table
                loading={orderLoading}
                dataSource={orders}
                columns={orderColumns}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 5 }}
              />
            </Card>
          )}
          {menuKey === "contact" && (
            <Card title="Contact List">
              <Table
                dataSource={contact}
                columns={contactColumns}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 5 }}
              />
            </Card>
          )}
        </Content>
      </Layout>

      {/* Edit Product Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              width: "100%",
              font: "bold",
              fontSize: "22px",
            }}
          >
            Edit Product
          </div>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleUpdate}
        okText="Update"
        okButtonProps={{
          type: "primary", // Ensures it's blue
          style: {
            backgroundColor: "#1677ff", // Primary blue
            borderColor: "#1677ff",
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="subtitle"
            label="SubTitle"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              <Select.Option value="Premium Quality">
                Premium Quality
              </Select.Option>
              <Select.Option value="Best Seller">Best Seller</Select.Option>
              <Select.Option value="Eco-friendly">Eco-friendly</Select.Option>
              <Select.Option value="New Arrival">New Arrival</Select.Option>
              <Select.Option value="New Design">New Design</Select.Option>
              <Select.Option value="New">New</Select.Option>
              <Select.Option value="Limited Offer">Limited Offer</Select.Option>
              <Select.Option value="Customizable">Customizable</Select.Option>
              <Select.Option value="New Release">New Release</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="originalPrice"
            label="Original Price"
            rules={[
              { required: true, message: "Please enter the original price" },
              {
                validator: (_, value) =>
                  value < 0
                    ? Promise.reject("Original price cannot be negative")
                    : Promise.resolve(),
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Discount Price"
            rules={[
              { required: true, message: "Please enter the discount price" },
              {
                validator: (_, value, callback) => {
                  const originalPrice = form.getFieldValue("originalPrice");
                  if (value < 0) {
                    return Promise.reject("Discount price cannot be negative");
                  }
                  if (originalPrice !== undefined && value >= originalPrice) {
                    return Promise.reject(
                      "Discount price must be less than original price"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {imagePreview && (
              <Image src={imagePreview} width={100} style={{ marginTop: 8 }} />
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              width: "100%",
              font: "bold",
              fontSize: "22px",
            }}
          >
            Add Product
          </div>
        }
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={handleAddProduct}
        okText="Add"
        okButtonProps={{
          type: "primary", // Ensures it's blue
          style: {
            backgroundColor: "#1677ff", // Primary blue
            borderColor: "#1677ff",
          },
        }}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="subtitle"
            label="SubTitle"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              <Select.Option value="Premium Quality">
                Premium Quality
              </Select.Option>
              <Select.Option value="Best Seller">Best Seller</Select.Option>
              <Select.Option value="Eco-friendly">Eco-friendly</Select.Option>
              <Select.Option value="New Arrival">New Arrival</Select.Option>
              <Select.Option value="New Design">New Design</Select.Option>
              <Select.Option value="New">New</Select.Option>
              <Select.Option value="Limited Offer">Limited Offer</Select.Option>
              <Select.Option value="Customizable">Customizable</Select.Option>
              <Select.Option value="New Release">New Release</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="originalPrice"
            label="Original Price"
            rules={[
              { required: true, message: "Please enter the original price" },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject("Original price cannot be negative"),
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Discount Price"
            rules={[
              { required: true, message: "Please enter the discount price" },
              {
                validator: (_, value) => {
                  const originalPrice = addForm.getFieldValue("originalPrice");
                  if (value < 0) {
                    return Promise.reject("Discount price cannot be negative");
                  }
                  if (originalPrice !== undefined && value >= originalPrice) {
                    return Promise.reject(
                      "Discount price must be less than original price"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Image" required>
            <Upload
              beforeUpload={() => false}
              fileList={addFileList}
              onChange={({ fileList }) => setAddFileList(fileList)}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              width: "100%",
              font: "bold",
              fontSize: "25px",
            }}
          >
            Confirm Deletion
          </div>
        }
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          if (!productToDelete) return;

          const res = await fetch(
            // `http://localhost:5000/api/products/${productToDelete._id}`,
            `${import.meta.env.VITE_API_BASE_URL}/products/${
              productToDelete._id
            }`,

            {
              method: "DELETE",
            }
          );
          const data = await res.json();
          if (data.success) {
            message.success("Product deleted");
            fetchProducts();
          } else {
            message.error("Delete failed");
          }
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Are you sure you want to delete the product:
        </p>
        <p
        // style={{
        //   textAlign: "center",
        //   fontWeight: 600,
        //   fontSize: 16,
        //   marginTop: 8,
        //   color: "#d9363e",
        // }}
        >
          {/* {productToDelete?.title} */}
        </p>
      </Modal>
      {/* add review */}
      <Modal
        title="Add Review"
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        onOk={async () => {
          const values = await reviewForm.validateFields();
          // const res = await fetch("http://localhost:5000/api/reviews", {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/reviews`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          const data = await res.json();
          if (data.success) {
            message.success("Review added");
            fetchReviews();
            setReviewModalOpen(false);
            reviewForm.resetFields();
          } else {
            message.error("Failed to add review");
          }
        }}
        okText="Submit"
        okButtonProps={{
          type: "primary",
          style: { backgroundColor: "#1677ff", borderColor: "#1677ff" },
        }}
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* update review */}
      <Modal
        title="Edit Review"
        open={editReviewModalOpen}
        onCancel={() => setEditReviewModalOpen(false)}
        onOk={handleUpdateReview}
        okText="Update"
        okButtonProps={{
          type: "primary",
          style: { backgroundColor: "#1677ff", borderColor: "#1677ff" },
        }}
      >
        <Form form={editReviewForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
