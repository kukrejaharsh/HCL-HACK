import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const useProfile = (role) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const endpoint = role === 'doctor' ? '/doctor/profile' : '/patient/profile'
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: authHeaders(),
      })

      setProfile(response.data)
    } catch (err) {
      console.error('Failed to load profile', err)
      setError(err.response?.data?.message || 'Unable to load profile information')
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, refreshProfile: fetchProfile }
}

export default useProfile


