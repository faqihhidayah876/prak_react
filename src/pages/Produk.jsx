import { Link } from "react-router-dom";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { productsAPI } from "../services/supabaseAPI";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";

export default function Produk() {
  const { profile: currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Electronics",
    brand: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await productsAPI.fetchAll();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", category: "Electronics", brand: "", price: "", stock: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category || "Electronics",
      brand: product.brand || "",
      price: String(product.price),
      stock: String(product.stock),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingId) {
        await productsAPI.update(editingId, payload);
      } else {
        await productsAPI.create(payload);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsAPI.delete(id);
      loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="flex flex-col">
      <PageHeader title="Products" breadcrumb={["Dashboard", "Product List"]}>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="bg-hijau hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors"
          >
            <FaPlus /> <span>Add Product</span>
          </button>
        )}
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-4">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No products found.</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Brand</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                {isAdmin && <th className="px-6 py-4 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <Link
                      to={`/products/${prod.id}`}
                      className="text-emerald-500 hover:text-emerald-700 font-semibold underline"
                    >
                      {prod.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{prod.category || "-"}</td>
                  <td className="px-6 py-3 text-gray-600">{prod.brand || "-"}</td>
                  <td className="px-6 py-3 text-gray-600">{formatRupiah(prod.price)}</td>
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
                  {isAdmin && (
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="Enter product name..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="Product description (optional)" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="e.g. Samsung" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau">
                      <option value="Makanan">Makanan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Cemilan">Cemilan</option>
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
                  <input type="number" name="price" min="0" value={formData.price} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="15000000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" name="stock" min="0" value={formData.stock} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="10" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-hijau text-white rounded-lg hover:bg-green-600 font-medium shadow-sm">
                  {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}