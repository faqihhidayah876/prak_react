import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  return (
    <div id="dashboard-container" className="flex flex-col">
      <PageHeader />
      
      <div id="dashboard-grid" className="p-4 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div id="orders-icon" className="bg-green-100 text-hijau rounded-full p-4 text-3xl">
            <FaShoppingCart />
          </div>
          <div id="orders-info" className="flex flex-col">
            <span id="orders-count" className="text-2xl font-bold text-gray-800">75</span>
            <span id="orders-text" className="text-gray-400 text-sm font-medium">Total Orders</span>
          </div>
        </div>

        {/* Card 2 */}
        <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div id="delivered-icon" className="bg-blue-100 text-blue-500 rounded-full p-4 text-3xl">
            <FaTruck />
          </div>
          <div id="delivered-info" className="flex flex-col">
            <span id="delivered-count" className="text-2xl font-bold text-gray-800">357</span>
            <span id="delivered-text" className="text-gray-400 text-sm font-medium">Total Delivered</span>
          </div>
        </div>

        {/* Card 3 */}
        <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div id="canceled-icon" className="bg-red-100 text-red-500 rounded-full p-4 text-3xl">
            <FaBan />
          </div>
          <div id="canceled-info" className="flex flex-col">
            <span id="canceled-count" className="text-2xl font-bold text-gray-800">65</span>
            <span id="canceled-text" className="text-gray-400 text-sm font-medium">Total Canceled</span>
          </div>
        </div>

        {/* Card 4 */}
        <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div id="revenue-icon" className="bg-yellow-100 text-yellow-500 rounded-full p-4 text-3xl">
            <FaDollarSign />
          </div>
          <div id="revenue-info" className="flex flex-col">
            <span id="revenue-amount" className="text-2xl font-bold text-gray-800">$128</span>
            <span id="revenue-text" className="text-gray-400 text-sm font-medium">Total Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}