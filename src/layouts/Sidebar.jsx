import { FaHome, FaBox, FaUsers, FaPlus, FaBan } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom"

export default function Sidebar() {
      const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4  space-x-2
        ${isActive ? 
            "text-hijau bg-green-200 font-extrabold" : 
            "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`
  return (
    <div id="sidebar" className="flex flex-col min-h-screen w-80 bg-white p-8 shadow-lg">
      {/* Logo */}
      <div id="sidebar-logo" className="flex flex-col mb-10">
        <span id="logo-title" className="font-poppins text-[48px] text-gray-900 font-bold leading-none">
          Sedap<b id="logo-dot" className="text-hijau">.</b>
        </span>
        <span id="logo-subtitle" className="font-semibold text-gray-400 text-sm">
          Modern Admin Dashboard
        </span>
      </div>

      {/* List Menu */}
      <div id="sidebar-menu" className="mt-10 flex-1">
        <ul id="menu-list" className="space-y-3">
          <li>
            <NavLink id="menu-1" to="/" className={menuClass}>
              <FaHome className="mr-4 text-xl" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink id="menu-2" to="/orders" className={menuClass}>
              <FaBox className="mr-4 text-xl" /> Order List
            </NavLink>
          </li>
          <li>
            <NavLink id="menu-3" to="/customers" className={menuClass}>
              <FaUsers className="mr-4 text-xl" /> Customer
            </NavLink>
          </li>
          <li>
            <NavLink to="/error-400" className={menuClass}>
              <FaBan className="mr-4 text-xl" /> Error 400
            </NavLink>
          </li>
          <li>
            <NavLink to="/error-401" className={menuClass}>
              <FaBan className="mr-4 text-xl" /> Error 401
            </NavLink>
          </li>
          <li>
            <NavLink to="/error-403" className={menuClass}>
              <FaBan className="mr-4 text-xl" /> Error 403
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div id="sidebar-footer" className="mt-auto">
        <div id="footer-card" className="bg-hijau px-4 py-4 rounded-xl shadow-lg mb-6 flex flex-col items-center">
          <div id="footer-text" className="text-white text-sm text-center mb-3">
            <span>Please organize your menus through button below!</span>
          </div>
          <div id="add-menu-button" className="flex justify-center items-center p-2 bg-white rounded-md space-x-2 text-gray-600 w-full cursor-pointer hover:bg-gray-100">
            <FaPlus /> <span>Add Menus</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <span id="footer-brand" className="font-bold text-gray-400 text-sm">Sedap Restaurant Admin Dashboard</span>
        </div>
        <p id="footer-copyright" className="font-light text-gray-400 text-xs mt-1">&copy; 2025 All Right Reserved</p>
      </div>
    </div>
  );
}