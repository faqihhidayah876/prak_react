import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaPlus } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/CustomerData.json";
import { useState } from "react"; 
import { FaTimes } from "react-icons/fa";

export default function Customers() {
  // 1. State untuk menyimpan data customer (dimulai dari data JSON)
  const [customers, setCustomers] = useState(customersData);
  
  // 2. State untuk mengatur modal terbuka atau tertutup
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 3. State untuk menyimpan inputan form
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    email: "",
    phone: "",
    loyalty: "Bronze"
  });

  // Fungsi untuk menangani perubahan input pada form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fungsi untuk menangani saat form di-submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman me-refresh
    // Tambahkan data baru ke urutan paling atas dari data yang sudah ada
    setCustomers([formData, ...customers]);
    // Tutup modal
    setIsModalOpen(false);
    // Kosongkan form kembali
    setFormData({ customerId: "", customerName: "", email: "", phone: "", loyalty: "Bronze" });
  };
  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Customers" 
        breadcrumb={["Dashboard", "Customer List"]}
      >
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-hijau hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors"
        >
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-2xl">
            {/* Tombol Close */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Customer</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                <input type="text" name="customerId" value={formData.customerId} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="CUST-9999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau" placeholder="+62..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Tier</label>
                <select name="loyalty" value={formData.loyalty} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-hijau focus:ring-1 focus:ring-hijau">
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
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