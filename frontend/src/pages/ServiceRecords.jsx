import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ServiceRecords = () => {
  const [services, setServices] = useState([])
  const [cars, setCars] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    plateNumber: '',
    serviceDate: new Date().toISOString().split('T')[0],
    packageNumber: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  // Fetch all service records, cars, and packages
  const fetchData = async () => {
    try {
      const [servicesResponse, carsResponse, packagesResponse] = await Promise.all([
        axios.get('/services'),
        axios.get('/cars'),
        axios.get('/packages')
      ])

      // Handle services data
      setServices(Array.isArray(servicesResponse.data) ? servicesResponse.data : [])

      // Handle cars data
      setCars(Array.isArray(carsResponse.data) ? carsResponse.data : [])

      // Handle packages data (check for both formats)
      const packagesData = packagesResponse.data
      if (packagesData.success && Array.isArray(packagesData.data)) {
        setPackages(packagesData.data)
      } else if (Array.isArray(packagesData)) {
        setPackages(packagesData)
      } else {
        console.error('Invalid packages data:', packagesData)
        setPackages([])
        toast.error('Failed to load packages. Please check if Package table exists.')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setServices([])
      setCars([])
      setPackages([])

      if (error.response?.status === 500) {
        toast.error('Database error: Please make sure all tables exist')
      } else {
        toast.error('Failed to fetch data')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing) {
        await axios.put(`/services/${editId}`, formData)
        toast.success('Service record updated successfully')
      } else {
        await axios.post('/services', formData)
        toast.success('Service record added successfully')
      }

      // Reset form and fetch updated data
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving service record:', error)
      toast.error(error.response?.data?.message || 'Failed to save service record')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      plateNumber: '',
      serviceDate: new Date().toISOString().split('T')[0],
      packageNumber: ''
    })
    setIsEditing(false)
    setEditId(null)
    setShowForm(false)
  }

  // Edit service record
  const handleEdit = (service) => {
    setFormData({
      plateNumber: service.PlateNumber,
      serviceDate: service.ServiceDate.split('T')[0],
      packageNumber: service.PackageNumber || ''
    })
    setIsEditing(true)
    setEditId(service.RecordNumber)
    setShowForm(true)
  }

  // Delete service record
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service record?')) {
      return
    }

    try {
      await axios.delete(`/services/${id}`)
      toast.success('Service record deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting service record:', error)
      toast.error(error.response?.data?.message || 'Failed to delete service record')
    }
  }

  // Filter services based on search term
  const filteredServices = Array.isArray(services) ? services.filter(service =>
    service.RecordNumber?.toString().includes(searchTerm) ||
    service.PlateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.DriverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(service.ServiceDate).toLocaleDateString().includes(searchTerm.toLowerCase())
  ) : []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Service Records</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : 'Add New Service Record'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Service Record' : 'Add New Service Record'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car (Plate Number)
                </label>
                <select
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
                >
                  <option value="">Select a car...</option>
                  {cars.map((car) => (
                    <option key={car.PlateNumber} value={car.PlateNumber}>
                      {car.PlateNumber} - {car.DriverName} ({car.CarType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Package
                </label>
                <select
                  name="packageNumber"
                  value={formData.packageNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
                >
                  <option value="">Select a package...</option>
                  {packages.map((pkg) => (
                    <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
                      {pkg.PackageName} - {pkg.PackagePrice?.toLocaleString()} RWF
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Date
                </label>
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-800"
              >
                {isEditing ? 'Update Record' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by record number, plate number, driver name, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading service records...</div>
        ) : filteredServices.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No records match your search' : 'No service records available yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.RecordNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-gray-900">#{service.RecordNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{service.PlateNumber}</div>
                      <div className="text-gray-500 text-sm">{service.DriverName}</div>
                      <div className="text-gray-500 text-sm">{service.CarType} - {service.CarSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{service.PackageName || 'N/A'}</div>
                      <div className="text-gray-500 text-sm">{service.PackageDescription || ''}</div>
                      <div className="text-gray-700 text-sm font-medium">{service.PackagePrice ? `${service.PackagePrice.toLocaleString()} RWF` : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {new Date(service.ServiceDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-gray-700 hover:text-gray-900 mr-3 px-3 py-1 border border-gray-700 rounded hover:bg-gray-50"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.RecordNumber)}
                        className="text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-600 rounded hover:bg-gray-50"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceRecords
