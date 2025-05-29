import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Car, Package, FileText, CreditCard } from 'lucide-react'

const Dashboard = () => {
  const [summary, setSummary] = useState({
    carCount: 0,
    serviceCount: 0,
    totalRevenue: 0,
    paymentCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get('/reports/summary')
        setSummary(data)
      } catch (error) {
        console.error('Error fetching summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  const cards = [
    {
      title: 'Total Cars',
      value: summary.carCount,
      icon: <Car size={24} className="text-blue-500" />,
      link: '/cars',
      color: 'bg-blue-100 border-blue-500'
    },
    {
      title: 'Total Payments',
      value: summary.paymentCount,
      icon: <Package size={24} className="text-green-500" />,
      link: '/payments',
      color: 'bg-green-100 border-green-500'
    },
    {
      title: 'Service Records',
      value: summary.serviceCount,
      icon: <FileText size={24} className="text-amber-500" />,
      link: '/services',
      color: 'bg-amber-100 border-amber-500'
    },
    {
      title: 'Total Revenue',
      value: `${summary.totalRevenue?.toLocaleString() || 0} RWF`,
      icon: <CreditCard size={24} className="text-purple-500" />,
      link: '/payments',
      color: 'bg-purple-100 border-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium text-gray-500">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to SmartPark Car Washing Sales Management System</p>

      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`p-6 rounded-lg shadow-md border-l-4 ${card.color} hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                <p className="mt-2 text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div>{card.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/cars"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Car size={20} className="text-amber-600" />
            <span className="ml-3 font-medium text-gray-700">Register New Car</span>
          </Link>

          <Link
            to="/services"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <FileText size={20} className="text-amber-600" />
            <span className="ml-3 font-medium text-gray-700">Create Service Record</span>
          </Link>

          <Link
            to="/payments"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <CreditCard size={20} className="text-amber-600" />
            <span className="ml-3 font-medium text-gray-700">Record Payment</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
