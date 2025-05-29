import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Search, Edit, Trash } from 'lucide-react'

const Cars = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    plateNumber: '',
    carType: '',
    carSize: '',
    driverName: '',
    phoneNumber: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  
  // Fetch all cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/cars')
      setCars(data)
    } catch (error) {
      console.error('Error fetching cars:', error)
      toast.error('Failed to fetch cars')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchCars()
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
        await axios.put(`/cars/${formData.plateNumber}`, formData)
        toast.success('Car updated successfully')
      } else {
        await axios.post('/cars', formData)
        toast.success('Car added successfully')
      }
      
      // Reset form and fetch updated cars
      resetForm()
      fetchCars()
    } catch (error) {
      console.error('Error saving car:', error)
      toast.error(error.response?.data?.message || 'Failed to save car')
    }
  }
  
  // Reset form
  const resetForm = () => {
    setFormData({
      plateNumber: '',
      carType: '',
      carSize: '',
      driverName: '',
      phoneNumber: ''
    })
    setIsEditing(false)
    setShowForm(false)
  }
  
  // Edit car
  const handleEdit = (car) => {
    setFormData({
      plateNumber: car.PlateNumber,
      carType: car.CarType,
      carSize: car.CarSize,
      driverName: car.DriverName,
      phoneNumber: car.PhoneNumber
    })
    setIsEditing(true)
    setShowForm(true)
  }
  
  // Filter cars based on search term
  const filteredCars = cars.filter(car => 
    car.PlateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.DriverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.CarType.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Cars</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          <Plus size={20} className="mr-2" />
          {showForm ? 'Cancel' : 'Add New Car'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Car' : 'Add New Car'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plate Number
                </label>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  disabled={isEditing}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., RAA123A"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Type
                </label>
                <input
                  type="text"
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., Sedan, SUV"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Size
                </label>
                <select
                  name="carSize"
                  value={formData.carSize}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Driver's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., 078XXXXXXX"
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
                className="px-4 py-2 text-white bg-amber-600 rounded-md hover:bg-amber-700"
              >
                {isEditing ? 'Update Car' : 'Add Car'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search cars by plate number, driver name or car type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border-none focus:outline-none"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading cars...</div>
        ) : filteredCars.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No cars match your search' : 'No cars registered yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCars.map((car) => (
                  <tr key={car.PlateNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{car.PlateNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{car.CarType}</div>
                      <div className="text-gray-500 text-sm">{car.CarSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{car.DriverName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{car.PhoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(car)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={18} />
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

export default Cars
