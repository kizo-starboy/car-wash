import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Search, Edit, Trash, Printer } from 'lucide-react'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0]
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  // Fetch all payments
  const fetchData = async () => {
    try {
      const { data } = await axios.get('/payments')
      setPayments(data)
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
        await axios.put(`/payments/${editId}`, formData)
        toast.success('Payment updated successfully')
      } else {
        await axios.post('/payments', formData)
        toast.success('Payment recorded successfully')
      }

      // Reset form and fetch updated data
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving payment:', error)
      toast.error(error.response?.data?.message || 'Failed to save payment')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      amountPaid: '',
      paymentDate: new Date().toISOString().split('T')[0]
    })
    setIsEditing(false)
    setEditId(null)
    setShowForm(false)
  }

  // Edit payment
  const handleEdit = (payment) => {
    setFormData({
      amountPaid: payment.AmountPaid,
      paymentDate: payment.PaymentDate.split('T')[0]
    })
    setIsEditing(true)
    setEditId(payment.PaymentNumber)
    setShowForm(true)
  }

  // Delete payment
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this payment?')) {
      return
    }

    try {
      await axios.delete(`/payments/${id}`)
      toast.success('Payment deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast.error(error.response?.data?.message || 'Failed to delete payment')
    }
  }

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment =>
    payment.PaymentNumber.toString().includes(searchTerm) ||
    payment.AmountPaid.toString().includes(searchTerm) ||
    new Date(payment.PaymentDate).toLocaleDateString().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Payments</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          <Plus size={20} className="mr-2" />
          {showForm ? 'Cancel' : (isEditing ? 'Cancel Edit' : 'Add New Payment')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Payment' : 'Add New Payment'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid (RWF)
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., 5000"
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
                {isEditing ? 'Update Payment' : 'Add Payment'}
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
              placeholder="Search by payment number, amount, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border-none focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No payments match your search' : 'No payments recorded yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.PaymentNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-gray-900">#{payment.PaymentNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {new Date(payment.PaymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-gray-900">{payment.AmountPaid?.toLocaleString()} RWF</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(payment.PaymentNumber)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash size={18} />
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

export default Payments
