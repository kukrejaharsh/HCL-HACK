import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../../components/DashboardLayout'
import { doctorLinks } from './DoctorDashboard'
import useLogoutNavigation from '../../hooks/useLogoutNavigation'

const API_BASE_URL = 'http://localhost:5000/api'

const PatientList = () => {
  const handleLogout = useLogoutNavigation()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${API_BASE_URL}/doctor/patients`, {
        headers: authHeaders(),
      })
      setPatients(response.data)
    } catch (err) {
      console.error('Failed to load patients', err)
      setError(err.response?.data?.message || 'Unable to load patient list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return (
    <DashboardLayout links={doctorLinks} title="Doctor Portal" onLogout={handleLogout}>
      <section className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient List</h1>
            <p className="text-gray-500">Monitor confirmed patients and their scheduled visits.</p>
          </div>
          <button
            onClick={fetchPatients}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
        {loading && <p className="text-gray-500">Loading patients...</p>}

        {!loading && patients.length === 0 && <p className="text-gray-500">No confirmed patients yet.</p>}

        {patients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Patient Name', 'Email', 'Phone', 'Scheduled Date', 'Time'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {patients.map((appointment) => (
                  <tr key={appointment.appointmentId}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{appointment.patient?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.patient?.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.patient?.phone || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}

export default PatientList

