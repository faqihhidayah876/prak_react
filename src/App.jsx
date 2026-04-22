import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./assets/tailwind.css";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import NotFound from "./pages/ErrorPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div id="app-container" className="bg-latar min-h-screen flex font-barlow">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div
          id="main-content"
          className="flex-1 flex flex-col p-4 overflow-y-auto"
        >
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="*" element={<NotFound errorCode="404" errorDescription="Sorry, we were unable to find that page" errorImage="/image_9dca28.jpg" />} />
            <Route path="/error-400" element={<NotFound errorCode="400" errorDescription="Bad Request. Server cannot process the request." />} />
            <Route path="/error-401" element={<NotFound errorCode="401" errorDescription="Unauthorized. You lack valid authentication credentials." />} />
            <Route path="/error-403" element={<NotFound errorCode="403" errorDescription="Forbidden. You don't have permission to access this resource." />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
