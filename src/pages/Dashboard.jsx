import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCompleted: 0,
    totalCancelled: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  async function loadDashboardData() {
    try {
      // Jika belum login atau profile null, jangan query
      if (!profile) {
        setLoading(false);
        return;
      }

      // Query orders berdasarkan role
      let query = supabase.from("orders").select("*");

      if (profile?.role !== "admin") {
        // Member hanya lihat pesanan sendiri
        query = query.eq("user_id", profile.id);
      }

      const { data: ordersData } = await query.order("created_at", { ascending: false });

      if (ordersData) {
        const totalOrders = ordersData.length;
        const totalCompleted = ordersData.filter((o) => o.status === "completed").length;
        const totalCancelled = ordersData.filter((o) => o.status === "cancelled").length;
        const totalRevenue = ordersData
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + Number(o.final_amount), 0);

        setStats({ totalOrders, totalCompleted, totalCancelled, totalRevenue });
        setRecentOrders(ordersData.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  const statusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-600";
      case "processing": return "bg-blue-100 text-blue-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-yellow-100 text-yellow-600";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Dashboard" />
        <div className="p-8 text-center text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div id="dashboard-container" className="flex flex-col">
      <PageHeader
        title="Dashboard"
        breadcrumb={profile?.role === "member" ? [`Member: ${profile.full_name}`] : undefined}
      >
        {profile?.role === "member" && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Points: <b>{profile.points || 0}</b>
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold
              ${profile.tier === "platinum" ? "bg-purple-200 text-purple-800" :
                profile.tier === "gold" ? "bg-yellow-200 text-yellow-800" :
                profile.tier === "silver" ? "bg-gray-200 text-gray-700" :
                "bg-orange-100 text-orange-800"}`}
            >
              {profile.tier}
            </span>
          </div>
        )}
      </PageHeader>

      <div id="dashboard-grid" className="p-4 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-green-200">
          <div className="bg-green-100 text-hijau rounded-full p-4 text-3xl">
            <FaShoppingCart />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{stats.totalOrders}</span>
            <span className="text-gray-400 text-sm font-medium">Total Orders</span>
          </div>
        </div>

        <div className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-green-200">
          <div className="bg-blue-100 text-blue-500 rounded-full p-4 text-3xl">
            <FaTruck />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{stats.totalCompleted}</span>
            <span className="text-gray-400 text-sm font-medium">Completed</span>
          </div>
        </div>

        <div className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-green-200">
          <div className="bg-red-100 text-red-500 rounded-full p-4 text-3xl">
            <FaBan />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{stats.totalCancelled}</span>
            <span className="text-gray-400 text-sm font-medium">Canceled</span>
          </div>
        </div>

        <div className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-green-200">
          <div className="bg-yellow-100 text-yellow-500 rounded-full p-4 text-3xl">
            <FaDollarSign />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">
              Rp {(stats.totalRevenue || 0).toLocaleString("id-ID")}
            </span>
            <span className="text-gray-400 text-sm font-medium">Total Revenue</span>
          </div>
        </div>
      </div>

      <div className="p-4 mt-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 font-poppins">
            {profile?.role === "member" ? "My Recent Orders" : "Recent Orders"}
          </h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 text-sm">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Discount</th>
                    <th className="pb-3 font-medium">Final</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-gray-700">#{order.id?.slice(0, 8)}</td>
                      <td className="py-4">Rp {Number(order.total_amount).toLocaleString("id-ID")}</td>
                      <td className="py-4">{order.discount_percentage}%</td>
                      <td className="py-4 font-medium">Rp {Number(order.final_amount).toLocaleString("id-ID")}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}