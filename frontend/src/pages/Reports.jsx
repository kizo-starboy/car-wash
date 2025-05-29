import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Reports = () => {
  const [payments, setPayments] = useState([])
  const [dailyReport, setDailyReport] = useState({ records: [], count: 0, totalAmount: 0 })
  const [comprehensiveReport, setComprehensiveReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all payments for the report
  const fetchPayments = async () => {
    try {
      const { data } = await axios.get('/reports/payments')
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to fetch payment data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch comprehensive report
  const fetchComprehensiveReport = async () => {
    try {
      const { data } = await axios.get('/reports/comprehensive')
      setComprehensiveReport(data)
    } catch (error) {
      console.error('Error fetching comprehensive report:', error)
      toast.error('Failed to fetch comprehensive report')
    }
  }

  // Fetch daily report
  const fetchDailyReport = async (date) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/reports/daily/${date}`)
      setDailyReport(data)
    } catch (error) {
      console.error('Error fetching daily report:', error)
      toast.error('Failed to fetch daily report')
      setDailyReport({ date, records: [], count: 0, totalAmount: 0 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
    fetchDailyReport(reportDate)
    fetchComprehensiveReport()
  }, [])

  // Handle date change
  const handleDateChange = (e) => {
    const date = e.target.value
    setReportDate(date)
    fetchDailyReport(date)
  }

  // Print report
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank')

    printWindow.document.write(`
      <html>
        <head>
          <title>SmartPark - Daily Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .report-info { margin-bottom: 20px; }
            .report-info div { margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; margin-top: 20px; text-align: right; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>SmartPark</h2>
            <p>Car Washing Sales Management System</p>
            <h3>Daily Report - ${new Date(reportDate).toLocaleDateString()}</h3>
          </div>

          <div class="report-info">
            <div><strong>Date:</strong> ${new Date(reportDate).toLocaleDateString()}</div>
            <div><strong>Total Services:</strong> ${dailyReport?.count || 0}</div>
            <div><strong>Total Revenue:</strong> ${dailyReport?.totalAmount?.toLocaleString() || 0} RWF</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Payment Number</th>
                <th>Payment Date</th>
                <th>Amount Paid (RWF)</th>
              </tr>
            </thead>
            <tbody>
              ${dailyReport?.records?.map(record => `
                <tr>
                  <td>#${record.PaymentNumber}</td>
                  <td>${new Date(record.PaymentDate).toLocaleDateString()}</td>
                  <td>${record.AmountPaid?.toLocaleString()} RWF</td>
                </tr>
              `).join('') || '<tr><td colspan="3">No records found</td></tr>'}
            </tbody>
          </table>

          <div class="total">
            <p>Total Amount: ${dailyReport?.totalAmount?.toLocaleString() || 0} RWF</p>
          </div>

          <div class="footer">
            <p>Report generated on ${new Date().toLocaleString()}</p>
            <p>SmartPark - Rubavu District, Western Province, Rwanda</p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  // Print comprehensive report
  const handlePrintComprehensiveReport = () => {
    if (!comprehensiveReport) {
      toast.error('No comprehensive report data available')
      return
    }

    const printWindow = window.open('', '_blank')

    printWindow.document.write(`
      <html>
        <head>
          <title>SmartPark - Comprehensive Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h3 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f9fafb; font-weight: bold; }
            .summary { background-color: #fee2e2; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
            .signature-line { margin-top: 50px; border-bottom: 1px solid #000; width: 200px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SmartPark</h1>
            <p>Car Washing Sales Management System</p>
            <h2>Comprehensive Business Report</h2>
            <p>Generated on: ${new Date(comprehensiveReport.generatedAt).toLocaleString()}</p>
          </div>

          <div class="summary">
            <h3>Business Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div><strong>Total Cars Registered:</strong> ${comprehensiveReport.summary.totalCars}</div>
              <div><strong>Total Service Records:</strong> ${comprehensiveReport.summary.totalServices}</div>
              <div><strong>Total Payments:</strong> ${comprehensiveReport.summary.totalPayments}</div>
              <div><strong>Total Revenue:</strong> ${comprehensiveReport.summary.totalRevenue.toLocaleString()} RWF</div>
            </div>
          </div>

          <div class="section">
            <h3>Cars Registered</h3>
            <table>
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>Car Type</th>
                  <th>Car Size</th>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                ${comprehensiveReport.cars.map(car => `
                  <tr>
                    <td>${car.PlateNumber}</td>
                    <td>${car.CarType}</td>
                    <td>${car.CarSize}</td>
                    <td>${car.DriverName}</td>
                    <td>${car.PhoneNumber}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Service Records</h3>
            <table>
              <thead>
                <tr>
                  <th>Record Number</th>
                  <th>Service Date</th>
                </tr>
              </thead>
              <tbody>
                ${comprehensiveReport.services.map(service => `
                  <tr>
                    <td>#${service.RecordNumber}</td>
                    <td>${new Date(service.ServiceDate).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Payment Records</h3>
            <table>
              <thead>
                <tr>
                  <th>Payment Number</th>
                  <th>Amount Paid</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                ${comprehensiveReport.payments.map(payment => `
                  <tr>
                    <td>#${payment.PaymentNumber}</td>
                    <td>${payment.AmountPaid.toLocaleString()} RWF</td>
                    <td>${new Date(payment.PaymentDate).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>This report contains confidential business information</p>
            <p>SmartPark - Rubavu District, Western Province, Rwanda</p>
            <div style="margin-top: 40px;">
              <p>Manager Signature: <span class="signature-line"></span> &nbsp;&nbsp;&nbsp;&nbsp; Date: ___________</p>
            </div>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment =>
    payment.PaymentNumber?.toString().includes(searchTerm) ||
    payment.AmountPaid?.toString().includes(searchTerm) ||
    new Date(payment.PaymentDate).toLocaleDateString().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Reports</h1>

      {/* Daily Report Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            Daily Report
          </h2>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-600 mb-1">Total Payments</div>
                  <div className="text-2xl font-bold text-gray-800">{dailyReport?.count || 0}</div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="text-sm text-red-600 mb-1">Total Revenue</div>
                  <div className="text-2xl font-bold text-red-800">
                    {dailyReport?.totalAmount?.toLocaleString() || 0} RWF
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handlePrintReport}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Print Daily
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handlePrintComprehensiveReport}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Print Full Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading report data...</div>
          ) : !dailyReport?.records || dailyReport.records.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No payment records found for this date
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyReport.records.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">#{record.PaymentNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{new Date(record.PaymentDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-gray-900">{record.AmountPaid?.toLocaleString()} RWF</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="2" className="px-6 py-4 text-right font-medium">
                      Total
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      {dailyReport.totalAmount?.toLocaleString() || 0} RWF
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* All Payments Report Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            All Payments Report
          </h2>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by payment number, amount, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading payment data...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No payments match your search' : 'No payment records found'}
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-gray-900">#{payment.PaymentNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {new Date(payment.PaymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-lg font-medium text-gray-900">{payment.AmountPaid?.toLocaleString()} RWF</div>
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

export default Reports
