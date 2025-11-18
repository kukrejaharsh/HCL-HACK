import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../../components/DashboardLayout'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { patientLinks } from './PatientDashboard'
import useLogoutNavigation from '../../hooks/useLogoutNavigation'

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM']
const API_BASE_URL = 'http://localhost:5000/api'

const BookAppointment = () => {
  const handleLogout = useLogoutNavigation()
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [reason, setReason] = useState('')
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true)
        const response = await axios.get(`${API_BASE_URL}/patient/doctors`, {
          headers: authHeaders(),
        })
        setDoctors(response.data)
      } catch (error) {
        console.error('Failed to load doctors', error)
        setFeedback({ type: 'error', message: error.response?.data?.message || 'Unable to load doctor list' })
      } finally {
        setLoadingDoctors(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setFeedback({ type: 'error', message: 'Please select doctor, date, and time slot' })
      return
    }

    try {
      setSubmitting(true)
      setFeedback({ type: '', message: '' })

      await axios.post(
        `${API_BASE_URL}/appointments`,
        {
          doctorId: selectedDoctor,
          date: new Date(selectedDate).toISOString(),
          time: selectedSlot,
          reason,
        },
        { headers: authHeaders() }
      )

      setFeedback({ type: 'success', message: 'Appointment requested! Awaiting doctor response.' })
      setSelectedDoctor('')
      setSelectedDate('')
      setSelectedSlot('')
      setReason('')
    } catch (error) {
      console.error('Failed to book appointment', error)
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Unable to book appointment' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout links={patientLinks} title="Patient Portal" onLogout={handleLogout}>
      <section className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-500">Select your preferred doctor, date, and time slot.</p>
        </div>

        {feedback.message && (
          <p
            className={`text-sm rounded-lg border p-3 ${
              feedback.type === 'success'
                ? 'text-green-700 bg-green-50 border-green-200'
                : 'text-red-600 bg-red-50 border-red-100'
            }`}
          >
            {feedback.message}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Select Doctor
            <select
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              disabled={loadingDoctors}
            >
              <option value="" disabled>
                {loadingDoctors ? 'Loading doctors...' : 'Choose a doctor'}
              </option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} {doctor.specialization ? `– ${doctor.specialization}` : ''}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Select Date"
            type="date"
            required
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Select Time Slot</p>
            <div className="flex flex-wrap gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={selectedSlot === slot ? 'primary' : 'outline'}
                  className="min-w-[96px]"
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>

          <Input
            label="Reason for Visit"
            as="textarea"
            rows={4}
            placeholder="Describe your symptoms..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Booking...' : 'Book Now'}
          </Button>
        </form>
      </section>
    </DashboardLayout>
  )
}

export default BookAppointment

