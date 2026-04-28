import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout () {
    return(
    <div id="app-container" className="bg-latar min-h-screen flex font-barlow">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div
          id="main-content"
          className="flex-1 flex flex-col p-4 overflow-y-auto">
          <Header />

          <Outlet/>
        </div>
      </div>
    </div>
    );
}