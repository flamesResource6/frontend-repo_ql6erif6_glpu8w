import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { MessageSquare, Users, ShoppingCart, Boxes, BarChart3, Settings } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import ChatAssistant from './components/ChatAssistant'
import Customers from './components/Customers'
import Products from './components/Products'
import Sales from './components/Sales'
import Dashboard from './components/Dashboard'
import SettingsView from './components/SettingsView'

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  )
}

function Layout() {
  const [backendUrl, setBackendUrl] = useState('')
  useEffect(() => {
    setBackendUrl(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex h-screen">
        <aside className="w-72 bg-white border-r border-gray-200 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold">B</div>
            <div>
              <div className="text-lg font-bold">BizMate</div>
              <div className="text-xs text-gray-500">Your Smart Business Partner</div>
            </div>
          </div>
          <nav className="mt-4 flex flex-col gap-2">
            <NavItem to="/" icon={MessageSquare} label="AI Chat" />
            <NavItem to="/customers" icon={Users} label="Customers" />
            <NavItem to="/sales" icon={ShoppingCart} label="Sales" />
            <NavItem to="/stock" icon={Boxes} label="Stock" />
            <NavItem to="/dashboard" icon={BarChart3} label="Dashboard" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </nav>
          <div className="mt-auto text-xs text-gray-500 px-2">
            Backend: <span className="font-mono">{backendUrl}</span>
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ChatAssistant />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/stock" element={<Products />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
        <div className="hidden xl:block w-[32rem] relative bg-gradient-to-b from-gray-900 to-black">
          <div className="absolute inset-0">
            <Spline scene="https://prod.spline.design/AeAqaKLmGsS-FPBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-white">
              <div className="text-sm opacity-90">BizMate Assistant</div>
              <div className="text-lg font-semibold">Black & white mini robot at your service 🤖</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
