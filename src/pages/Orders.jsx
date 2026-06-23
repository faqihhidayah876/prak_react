import { FaPlus, FaShoppingCart } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { ordersAPI, productsAPI, createOrderWithItems } from "../services/supabaseAPI";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../lib/auth";

export default function Orders() {
  const { profile: currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  // State untuk form order
  const [cartItems, setCartItems] = useState([
    { product_id: "", quantity: 1 },
  ]);

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await ordersAPI.fetchAll();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const data = await productsAPI.fetchAll();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // Cart management
  const addCartRow = () => {
    setCartItems([...cartItems, { product_id: "", quantity: 1 }]);
  };

  const removeCartRow = (index) => {
    if (cartItems.length === 1) return;
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const updateCartItem = (index, field, value) => {
    const updated = [...cartItems];
    updated[index][field] = field === "quantity" ? Math.max(1, parseInt(value) || 1) : value;
    setCartItems(updated);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi
    const validItems = cartItems.filter((item) => item.product_id);
    if (validItems.length === 0) {
      setError("Pilih minimal 1 produk");
      return;
    }

    try {
      const items = validItems.map((item) => ({
        product_id: item.product_id,
        quantity: parseInt(item.quantity),
      }));

      const tier = currentUser?.tier || "bronze";
      const result = await createOrderWithItems(currentUser.id, tier, items);

      setIsModalOpen(false);
      setCartItems([{ product_id: "", quantity: 1 }]);

      alert(
        `✅ Pesanan berhasil dibuat!\n\nTotal: Rp ${Number(result.order.total_amount).toLocaleString("id-ID")}\nDiskon: ${result.order.discount_percentage}%\nFinal: Rp ${Number(result.order.final_amount).toLocaleString("id-ID")}\nPoin earned: ${result.pointsEarned}`
      );

      loadOrders();
    } catch (err) {
      setError(err.message || "Gagal membuat pesanan");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const isAdmin = currentUser?.role === "admin";
  const isMember = currentUser?.role === "member";

  return (
    <div className="flex flex-col">
      <PageHeader title="Orders" breadcrumb={["Dashboard", "Order List"]}>
        {isMember && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-hijau hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors"
          >
            <FaShoppingCart /> <span>Create Order</span>
          </button>
        )}
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-4 mx-4">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="mb-2">Belum ada pesanan.</p>
            {isMember && (
              <p className="text-sm">Klik tombol <b>Create Order</b> untuk mulai memesan produk.</p>
            )}
            {isAdmin && (
              <p className="text-sm">Belum ada transaksi dari member. Tunggu hingga member membuat pesanan.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Total Amount</th>
                  <th className="px-6 py-4 font-semibold">Discount</th>
                  <th className="px-6 py-4 font-semibold">Final Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  {isAdmin && <th className="px-6 py-4 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      #{order.id?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      Rp {Number(order.total_amount).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {order.discount_percentage}%
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      Rp {Number(order.final_amount).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-hijau"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create Order untuk Member */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Buat Pesanan Baru</h2>
            <p className="text-sm text-gray-500 mb-4">
              Tier kamu: <b className="text-gray-700">{currentUser?.tier}</b> | 
              Diskon: <b className="text-green-600">{currentUser?.tier === "platinum" ? "20%" : currentUser?.tier === "gold" ? "15%" : currentUser?.tier === "silver" ? "10%" : "5%"}</b> |
              Poin: <b>{currentUser?.points || 0}</b>
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateOrder}>
              <div className="space-y-3 mb-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <select
                        value={item.product_id}
                        onChange={(e) => updateCartItem(index, "product_id", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-hijau"
                        required
                      >
                        <option value="">-- Pilih Produk --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - Rp {Number(p.price).toLocaleString("id-ID")} (Stok: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateCartItem(index, "quantity", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-hijau"
                        placeholder="Qty"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCartRow(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addCartRow}
                className="text-hijau hover:text-green-700 text-sm font-medium mb-6 flex items-center gap-1"
              >
                <FaPlus size={12} /> Tambah produk lain
              </button>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Poin akan bertambah setelah checkout
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-hijau text-white rounded-lg hover:bg-green-600 font-medium shadow-sm"
                  >
                    🔥 Checkout
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}