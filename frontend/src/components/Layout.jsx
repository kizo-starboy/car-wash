import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Layout = ({ children, user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout')
      setUser(null)
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/cars', label: 'Cars' },
    { path: '/services', label: 'Service Records' },
    { path: '/payments', label: 'Payments' },
    { path: '/reports', label: 'Reports' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-20 transition-opacity ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-red-600 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">SmartPark CWSMS</span>
          </div>
          <button onClick={toggleSidebar} className="text-white lg:hidden">
            ✕
          </button>
        </div>

        <nav className="mt-5 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mt-2 text-white transition-colors duration-200 rounded-lg ${
                location.pathname === item.path
                  ? 'bg-red-700'
                  : 'hover:bg-red-700'
              }`}
            >
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mt-2 text-white transition-colors duration-200 rounded-lg hover:bg-red-700"
          >
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-1 shadow">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden">
              ☰
            </button>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <span className="text-gray-800">
                Welcome, <span className="font-semibold">{user?.fullName || 'User'}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
