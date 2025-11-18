import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button'

const Logout = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('pending')
  const [message, setMessage] = useState('Signing you out...')
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem('token')

      try {
        if (token) {
          await axios.post(
            'http://localhost:5000/api/auth/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        }

        setStatus('success')
        setMessage('You have been logged out successfully.')
      } catch (error) {
        console.error('Logout error:', error)
        setStatus('error')
        setMessage(error.response?.data?.message || 'There was an issue contacting the server. Your session was cleared locally.')
      } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setIsProcessing(false)
      }
    }

    performLogout()
  }, [])

  const handleLoginRedirect = () => navigate('/login')
  const handleReturn = () => navigate(-1)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center space-y-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Session</p>
          <h1 className="text-3xl font-bold text-gray-900">Logout</h1>
        </div>

        <p className="text-gray-600">{message}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button className="w-full sm:w-auto" onClick={handleLoginRedirect} disabled={isProcessing}>
            Go to Login
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={handleReturn} disabled={isProcessing && status === 'pending'}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Logout


