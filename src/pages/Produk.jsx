import { Link } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import productData from "../data/ProductData.json";
import { useState } from "react";

export default function Produk() {
  const [products, setProducts] = useState(productData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State form diubah dari 'code' menjadi 'id'
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "Electronics",
    brand: "",
    price: "",
    stock: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    setProducts([newProduct, ...products]);
    setIsModalOpen(false);

    // Reset form dengan 'id'
    setFormData({
      id: "",
      title: "",
      category: "Electronics",
      brand: "",
      price: "",
      stock: "",
    });
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="Products" breadcrumb={["Dashboard", "Product List"]}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-hijau hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors"
        >
          <FaPlus /> <span>Add Product</span>
        </button>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Product ID</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Brand</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((prod, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {/* Menampilkan prod.id */}
                <td className="px-6 py-3 font-medium text-gray-900">
                  {prod.id}
                </td>
                <td className="px-6 py-3">
                  <Link
                    to={`/products/${prod.id}`}
                    className="text-emerald-500 hover:text-emerald-700 font-semibold underline"
                  >
                    {prod.title}
                  </Link>
                </td>
                <td className="px-6 py-3 text-gray-600">{prod.category}</td>
                <td className="px-6 py-3 text-gray-600">{prod.brand}</td>
                <td className="px-6 py-3 text-gray-600">
                  {formatRupiah(prod.price)}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-bold ${
                      prod.stock > 15
                        ? "bg-green-100 text-green-800"
                        : prod.stock > 5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {prod.stock} Pcs
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add New Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product ID
                  </label>
                  {/* name dan value diubah menjadi id */}
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau"
                    placeholder="PRD-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau"
                    placeholder="e.g. Samsung"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau"
                  placeholder="Enter product name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (Rp)
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau"
                    placeholder="15000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-hijau text-white rounded-lg hover:bg-green-600 font-medium shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
