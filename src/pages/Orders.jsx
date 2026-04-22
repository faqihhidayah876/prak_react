import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaPlus } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import ordersData from "../data/OrderData.json";

export default function Orders() {
  const ordersData = Array.from({ length: 30 }, (_, i) => ({
    orderId: `ORD-${1000 + i}`,
    customerName: `Customer Name ${i + 1}`,
    status: ["Pending", "Completed", "Cancelled"][i % 3], // Rotasi status
    totalPrice: `Rp ${(Math.random() * 500000 + 50000).toFixed(0)}`,
    orderDate: `2026-04-${(i % 30 + 1).toString().padStart(2, "0")}`,
  }));
  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Orders" 
        breadcrumb={["Dashboard", "Order List"]}
      >
        <button className="bg-hijau hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors">
          <FaPlus /> <span>Add Orders</span>
        </button>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer Name</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Total Price</th>
              <th className="px-6 py-4 font-semibold">Order Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ordersData.map((order, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{order.orderId}</td>
                <td className="px-6 py-3 text-gray-600">{order.customerName}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-600">{order.totalPrice}</td>
                <td className="px-6 py-3 text-gray-600">{order.orderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}