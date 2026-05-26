import React, { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./assets/tailwind.css";
import Loading from "./components/Loading";
import NotFound from "./pages/ErrorPage";
import FiturXyz from "./pages/fiturXyz";

// Lazy loading untuk Pages dan Layouts
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Produk = React.lazy(() => import("./pages/Produk"));
const Orders = React.lazy(() => import("./pages/Orders"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));

// 1. TAMBAHKAN LAZY LOAD UNTUK COMPONENTS PAGE DI SINI
const ComponentsPage = React.lazy(() => import("./pages/Components")); 

const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

function App() {
  const [count, setCount] = useState(0);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Produk />} />
          <Route path="/products/:id" element={<ProductDetail />} /> 
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/FiturXyz" element={<FiturXyz/>} />
          
          <Route path="*" element={<NotFound errorCode="404" errorDescription="Sorry, we were unable to find that page" errorImage="/image_9dca28.jpg" />} />
          <Route path="/error-400" element={<NotFound errorCode="400" errorDescription="Bad Request. Server cannot process the request." />} />
          <Route path="/error-401" element={<NotFound errorCode="401" errorDescription="Unauthorized. You lack valid authentication credentials." />} />
          <Route path="/error-403" element={<NotFound errorCode="403" errorDescription="Forbidden. You don't have permission to access this resource." />} />
        </Route>
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot" element={<Forgot/>} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;