import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    PackageNumber: '',
    PackageName: '',
    PackageDescription: '',
    PackagePrice: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const response = await axios.get('/packages')
      const data = response.data

      if (data.success && Array.isArray(data.data)) {
        setPackages(data.data)
      } else if (Array.isArray(data)) {
        setPackages(data)
      } else {
        console.error('Invalid packages data:', data)
        setPackages([]) // Set empty array as fallback
        toast.error('Failed to fetch packages - Invalid data format')
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      setPackages([]) // Set empty array as fallback
      if (error.response?.status === 500) {
        toast.error('Database error: Please make sure the Package table exists')
      } else {
        toast.error('Failed to fetch packages')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
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
        await axios.put(`/packages/${editId}`, formData)
        toast.success('Package updated successfully')
      } else {
        await axios.post('/packages', formData)
        toast.success('Package added successfully')
      }

      // Reset form and fetch updated packages
      resetForm()
      fetchPackages()
    } catch (error) {
      console.error('Error saving package:', error)
      toast.error(error.response?.data?.message || 'Failed to save package')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      PackageNumber: '',
      PackageName: '',
      PackageDescription: '',
      PackagePrice: ''
    })
    setIsEditing(false)
    setEditId(null)
    setShowForm(false)
  }

  // Edit package
  const handleEdit = (pkg) => {
    setFormData({
      PackageNumber: pkg.PackageNumber,
      PackageName: pkg.PackageName,
      PackageDescription: pkg.PackageDescription,
      PackagePrice: pkg.PackagePrice
    })
    setIsEditing(true)
    setEditId(pkg.PackageNumber)
    setShowForm(true)
  }

  // Delete package
  const handleDelete = async (packageNumber) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return
    }

    try {
      await axios.delete(`/packages/${packageNumber}`)
      toast.success('Package deleted successfully')
      fetchPackages()
    } catch (error) {
      console.error('Error deleting package:', error)
      toast.error(error.response?.data?.message || 'Failed to delete package')
    }
  }

  // Filter packages based on search term
  const filteredPackages = packages.filter(pkg =>
    pkg.PackageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.PackageDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.PackagePrice.toString().includes(searchTerm)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Service Packages</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : 'Add New Package'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Package' : 'Add New Package'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Number
                </label>
                <input
                  type="number"
                  name="PackageNumber"
                  value={formData.PackageNumber}
                  onChange={handleChange}
                  disabled={isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700 disabled:bg-gray-100"
                  placeholder="Auto-generated"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isEditing ? 'Cannot be changed' : 'Leave empty for auto-generation'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  name="PackageName"
                  value={formData.PackageName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
                  placeholder="e.g., Basic wash"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Price (RWF)
                </label>
                <input
                  type="number"
                  name="PackagePrice"
                  value={formData.PackagePrice}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
                  placeholder="e.g., 5000"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Description
                </label>
                <textarea
                  name="PackageDescription"
                  value={formData.PackageDescription}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
                  placeholder="Describe the package services..."
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-800"
              >
                {isEditing ? 'Update Package' : 'Add Package'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search packages by name, description, or price..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-700 focus:border-gray-700"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading packages...</div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No packages match your search' : 'No packages available yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (RWF)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.PackageNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-gray-900">#{pkg.PackageNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{pkg.PackageName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{pkg.PackageDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-gray-900">{pkg.PackagePrice?.toLocaleString()} RWF</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="text-gray-700 hover:text-gray-900 mr-3 px-3 py-1 border border-gray-700 rounded hover:bg-gray-50"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.PackageNumber)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 rounded hover:bg-red-50"
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

export default Packages
