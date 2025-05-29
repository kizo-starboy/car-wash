import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ServiceRecords = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    serviceDate: new Date().toISOString().split('T')[0]
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  // Fetch all service records
  const fetchData = async () => {
    try {
      const { data } = await axios.get('/services')
      setServices(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
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
      serviceDate: new Date().toISOString().split('T')[0]
    })
    setIsEditing(false)
    setEditId(null)
    setShowForm(false)
  }

  // Edit service record
  const handleEdit = (service) => {
    setFormData({
      serviceDate: service.ServiceDate.split('T')[0]
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
  const filteredServices = services.filter(service =>
    service.RecordNumber.toString().includes(searchTerm) ||
    new Date(service.ServiceDate).toLocaleDateString().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Service Records</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
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
              placeholder="Search by record number or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                      <div className="text-gray-900">
                        {new Date(service.ServiceDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-red-600 hover:text-red-900 mr-3 px-3 py-1 border border-red-600 rounded hover:bg-red-50"
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
