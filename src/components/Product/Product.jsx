import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminProductPanel = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    price: "",
    originalPrice: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data?.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.append("image", file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("rating", formData.rating);
    data.append("price", formData.price);
    data.append("originalPrice", formData.originalPrice);

    const res = await axios.post("http://localhost:5000/api/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.success == true) {
      toast.success("Product added successfully", {
        style: {
          background: "#fff",
          color: "#015c3b",
          border: "1px solid #86efac",
        },
      });
    }

    setFormData({
      title: "",
      description: "",
      rating: "",
      price: "",
      originalPrice: "",
    });
    setFile(null);
    setPreviewUrl(null);
    fetchProducts();
  };
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto mt-24 ">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          📦 Admin Product Panel
        </h2>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="lg:col-span-2 grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Title
              </label>
              <input
                name="title"
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-900 bg-white"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows="2"
                className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-900 bg-white"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating (0-5)
                </label>
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-900 bg-white"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ₹
                </label>
                <input
                  name="price"
                  type="number"
                  className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-900 bg-white"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Original Price ₹
                </label>
                <input
                  name="originalPrice"
                  type="number"
                  className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-900 bg-white"
                  value={formData?.originalPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded shadow"
              />
            )}
            <button
              type="submit"
              className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload Product
            </button>
          </div>
        </form>

        {/* Uploaded Products List */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🖼️ Uploaded Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
              >
                <img
                  src={`http://localhost:5000${product?.imageUrl}`}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h4 className="text-lg font-bold">{product.title}</h4>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-yellow-500 text-sm">
                    ⭐ {product.rating || 0}
                  </span>
                  <span className="font-semibold text-teal-600">
                    ₹ {product.price || 0}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="mt-4 text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductPanel;
