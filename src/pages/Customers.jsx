import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaPlus } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/CustomerData.json";

export default function Customers() {
  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Customers" 
        breadcrumb={["Dashboard", "Customer List"]}
      >
        <button className="bg-hijau hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors">
          <FaPlus /> <span>Add Customer</span>
        </button>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer ID</th>
              <th className="px-6 py-4 font-semibold">Customer Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">Loyalty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customersData.map((cust, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{cust.customerId}</td>
                <td className="px-6 py-3 text-gray-600">{cust.customerName}</td>
                <td className="px-6 py-3 text-gray-600">{cust.email}</td>
                <td className="px-6 py-3 text-gray-600">{cust.phone}</td>
                <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold
                    ${cust.loyalty === 'Gold' ? 'bg-yellow-200 text-yellow-800' : 
                      cust.loyalty === 'Silver' ? 'bg-gray-200 text-gray-700' : 
                      'bg-orange-100 text-orange-800'}`}>
                    {cust.loyalty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}