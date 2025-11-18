import DashboardLayout from '../../components/DashboardLayout'
import useLogoutNavigation from '../../hooks/useLogoutNavigation'
import useProfile from '../../hooks/useProfile'

export const patientLinks = [
  { label: 'Dashboard', path: '/patient/dashboard' },
  { label: 'Book Appointment', path: '/patient/book-appointment' },
  { label: 'Profile', path: '/patient/profile' },
]

const PatientDashboard = () => {
  const handleLogout = useLogoutNavigation()
  const { profile, loading, error } = useProfile('patient')
  const displayName = profile?.name || 'there'

  return (
    <DashboardLayout links={patientLinks} title="Patient Portal" onLogout={handleLogout}>
      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
        <h1 className="text-3xl font-bold text-gray-900">
          {loading ? 'Loading your dashboard...' : `Welcome, ${displayName}!`}
        </h1>
        <p className="text-gray-600">
          Access your upcoming appointments, book new visits, and manage your health profile all in one place.
        </p>
      </section>
    </DashboardLayout>
  )
}

export default PatientDashboard


