import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

export default function NotFound() {
  return (
    <div id="dashboard-container" className="flex flex-col">
      <PageHeader title="Orders"/>
      <p>404 Error Not Found</p>
    </div>
  );
}