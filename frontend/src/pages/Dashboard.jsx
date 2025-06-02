import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
      link: '/cars',
      color: 'bg-gray-100 border-gray-500'
    },
    {
      title: 'Service Packages',
      value: summary.packageCount,
      link: '/packages',
      color: 'bg-white border-gray-700'
    },
    {
      title: 'Service Records',
      value: summary.serviceCount,
      link: '/services',
      color: 'bg-gray-200 border-gray-600'
    },
    {
      title: 'Total Payments',
      value: summary.paymentCount,
      link: '/payments',
      color: 'bg-gray-100 border-gray-700'
    },
    {
      title: 'Total Revenue',
      value: `${summary.totalRevenue?.toLocaleString() || 0} RWF`,
      link: '/payments',
      color: 'bg-white border-gray-700'
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

      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/cars"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-gray-700"
          >
            <span className="font-medium text-gray-700">Register New Car</span>
          </Link>

          <Link
            to="/packages"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-gray-700"
          >
            <span className="font-medium text-gray-700">Manage Packages</span>
          </Link>

          <Link
            to="/services"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-gray-500"
          >
            <span className="font-medium text-gray-700">Create Service Record</span>
          </Link>

          <Link
            to="/payments"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-gray-700"
          >
            <span className="font-medium text-gray-700">Record Payment</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
