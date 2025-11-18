import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import PatientDashboard from './pages/patient/PatientDashboard'
import BookAppointment from './pages/patient/BookAppointment'
import PatientProfile from './pages/patient/PatientProfile'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PatientList from './pages/doctor/PatientList'
import DoctorProfile from './pages/doctor/DoctorProfile'
import Logout from './pages/Logout'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/book-appointment" element={<BookAppointment />} />
      <Route path="/patient/profile" element={<PatientProfile />} />

      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/patient-list" element={<PatientList />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
    </Routes>
  )
}

export default App
