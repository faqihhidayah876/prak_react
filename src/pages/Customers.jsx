import { FaPlus } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { profilesAPI } from "../services/supabaseAPI";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

export default function Customers() {
  const { profile: currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "member",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");
      const data = await profilesAPI.fetchAll();
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError(err.message || "Gagal memuat data customer");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      // Create user in Auth first, then profile will be auto-created by trigger
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: formData.email,
        password: "password123",
        options: {
          data: { full_name: formData.full_name },
        },
      });

      if (authErr) throw authErr;

      // Update profile role to member (default dari trigger sudah member)
      if (authData?.user) {
        await supabase
          .from("profiles")
          .update({ role: "member" })
          .eq("id", authData.user.id);
      }

      setIsModalOpen(false);
      setFormData({ full_name: "", email: "", phone: "", role: "member" });
      alert(`Customer berhasil ditambahkan! Password default: password123`);
      loadCustomers();
    } catch (err) {
      setError(err.message || "Gagal menambahkan customer");
    }
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Customers"
        breadcrumb={["Dashboard", "Customer List"]}
      >
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-hijau hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors"
          >
            <FaPlus /> <span>Add Customer</span>
          </button>
        )}
      </PageHeader>

      {error && (
        <div className="mx-4 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-4 mx-4">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="mb-2">Belum ada data customer.</p>
            <p className="text-sm">Register dulu dari halaman <b>/register</b> atau klik <b>Add Customer</b> jika kamu admin.</p>
            {!isAdmin && (
              <p className="text-sm mt-2 text-yellow-600">
                ⚠️ Tombol Add Customer hanya untuk admin. Login dengan akun admin untuk menambah customer.
              </p>
            )}
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Full Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Points</th>
                <th className="px-6 py-4 font-semibold">Tier</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{cust.full_name}</td>
                  <td className="px-6 py-3 text-gray-600">{cust.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      cust.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {cust.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{cust.points || 0}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold
                      ${cust.tier === "gold" ? "bg-yellow-200 text-yellow-800" :
                        cust.tier === "silver" ? "bg-gray-200 text-gray-700" :
                        cust.tier === "platinum" ? "bg-purple-200 text-purple-800" :
                        "bg-orange-100 text-orange-800"}`}
                    >
                      {cust.tier}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-xs">
                    {cust.created_at ? new Date(cust.created_at).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Customer</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="+62..." />
              </div>
              <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                ℹ️ Password default: <b>password123</b>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-hijau text-white rounded-lg hover:bg-green-600 font-medium shadow-sm">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}