import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";

export default function NotFound({ errorCode, errorDescription, errorImage }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center min-h-screen text-white bg-cover bg-center"
      // Jika ada URL gambar, gunakan sebagai background. Jika tidak, pakai warna solid gelap.
      style={{
        backgroundColor: "#0d1117", 
        backgroundImage: errorImage ? `url(${errorImage})` : "none"
      }}
    >
      <div className="text-center z-10 flex flex-col items-center">
        <h1 className="text-8xl font-bold mb-4 tracking-wider">{errorCode}</h1>
        <p className="text-xl mb-8 text-gray-300 font-light">{errorDescription}</p>

        <div className="relative w-80 mb-8">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />
          {/* Icon search sederhana */}
          <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div className="text-sm text-gray-400">
          Start from <Link to="/" className="text-white hover:underline transition-all">home page</Link>
        </div>
      </div>
    </div>
  );
}