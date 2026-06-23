import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsAPI } from "../services/supabaseAPI";
import { FaArrowLeft } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  async function loadProduct(productId) {
    try {
      setLoading(true);
      const data = await productsAPI.fetchById(productId);
      setProduct(data);
    } catch (err) {
      console.error("Failed to load product:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-gray-400">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <Link to="/products" className="text-emerald-500 hover:underline flex items-center gap-2">
          <FaArrowLeft /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6">
      <Link
        to="/products"
        className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-6"
      >
        <FaArrowLeft /> Back to Products
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-6xl text-gray-300">📦</span>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              {product.brand && (
                <span className="text-sm text-gray-400">{product.brand}</span>
              )}
            </div>

            <p className="text-gray-600">{product.description || "No description available."}</p>

            <div className="text-3xl font-bold text-emerald-600">
              {formatRupiah(product.price)}
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-md text-sm font-bold ${
                  product.stock > 15
                    ? "bg-green-100 text-green-800"
                    : product.stock > 5
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {product.stock} Pcs in Stock
              </span>
              {product.category && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm">
                  {product.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}