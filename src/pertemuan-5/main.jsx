import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import Sidebar from './layouts/Sidebar'
import Header from './layouts/Header'
import Dashboard from './pages/Dashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div id="app-container" className="bg-latar min-h-screen flex font-barlow">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div id="main-content" className="flex-1 flex flex-col p-4 overflow-y-auto">
          <Header />
          <Dashboard />
        </div>
      </div>
    </div>
  </StrictMode>,
)