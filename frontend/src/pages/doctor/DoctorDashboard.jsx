import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/Button'
import useLogoutNavigation from '../../hooks/useLogoutNavigation'
import useProfile from '../../hooks/useProfile'

export const doctorLinks = [
  { label: 'Dashboard', path: '/doctor/dashboard' },
  { label: 'Patient List', path: '/doctor/patient-list' },
  { label: 'Profile', path: '/doctor/profile' },
]

const API_BASE_URL = 'http://localhost:5000/api'

const DoctorDashboard = () => {
  const handleLogout = useLogoutNavigation()
  const { profile, loading, error } = useProfile('doctor')
  const displayName = profile?.name || 'Doctor'

  const [pendingAppointments, setPendingAppointments] = useState([])
  const [loadingPending, setLoadingPending] = useState(true)
  const [pendingError, setPendingError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchPendingAppointments = async () => {
    try {
      setLoadingPending(true)
      setPendingError('')
      const response = await axios.get(`${API_BASE_URL}/doctor/appointments/pending`, { headers: authHeaders() })
      setPendingAppointments(response.data)
    } catch (err) {
      console.error('Failed to load pending appointments', err)
      setPendingError(err.response?.data?.message || 'Unable to load appointment requests')
    } finally {
      setLoadingPending(false)
    }
  }

  useEffect(() => {
    fetchPendingAppointments()
  }, [])

  const handleDecision = async (appointmentId, decision) => {
    try {
      setProcessingId(appointmentId)
      setPendingError('')
      await axios.post(
        `${API_BASE_URL}/doctor/appointments/${appointmentId}/respond`,
        { decision },
        { headers: authHeaders() }
      )
      await fetchPendingAppointments()
    } catch (err) {
      console.error('Failed to respond to appointment', err)
      setPendingError(err.response?.data?.message || 'Unable to update appointment')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <DashboardLayout links={doctorLinks} title="Doctor Portal" onLogout={handleLogout}>
      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
        <h1 className="text-3xl font-bold text-gray-900">
          {loading ? 'Loading your dashboard...' : `Welcome, Dr. ${displayName}!`}
        </h1>
        <p className="text-gray-600">Review your upcoming appointments and patient insights.</p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Requests</p>
            <h2 className="text-2xl font-bold text-gray-900">Pending Appointment Requests</h2>
          </div>
          <Button variant="outline" onClick={fetchPendingAppointments} disabled={loadingPending}>
            Refresh
          </Button>
        </div>

        {pendingError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{pendingError}</p>}
        {loadingPending && <p className="text-gray-500">Loading pending appointments...</p>}

        {!loadingPending && pendingAppointments.length === 0 && (
          <p className="text-gray-500">No pending appointments right now.</p>
        )}

        <div className="space-y-4">
          {pendingAppointments.map((appointment) => (
            <div key={appointment._id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{appointment.patientId?.name}</p>
                  <p className="text-sm text-gray-600">{appointment.patientId?.email}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()} · {appointment.time}
                  </p>
                  {appointment.reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      Reason: <span className="font-medium">{appointment.reason}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleDecision(appointment._id, 'accept')}
                    disabled={processingId === appointment._id}
                  >
                    {processingId === appointment._id ? 'Processing...' : 'Accept'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDecision(appointment._id, 'decline')}
                    disabled={processingId === appointment._id}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default DoctorDashboard


