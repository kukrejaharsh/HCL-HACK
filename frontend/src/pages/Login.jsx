/*import { Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import Input from '../components/Input'
import Button from '../components/Button'

const Login = () => {
  return (
    <AuthForm
      title="Welcome Back"
      footer={
        <span>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Sign Up
          </Link>
        </span>
      }
    >
      <form className="space-y-4">
        <Input label="Email" type="email" name="email" placeholder="you@example.com" required />
        <Input label="Password" type="password" name="password" placeholder="••••••••" required />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </AuthForm>
  )
}

export default Login
*/
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios' // Make sure to install axios if you haven't
import AuthForm from '../components/AuthForm'
import Input from '../components/Input'
import Button from '../components/Button'

const Login = () => {
  const navigate = useNavigate()

  // 1. State for the form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // 2. Handle typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 3. Handle the Login Logic
  const handleSubmit = async (e) => {
    e.preventDefault() // Stop page reload
    console.log('Logging in with:', formData)

    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      })

      console.log('Login Success:', response.data)

      // 4. Extract data from backend response
      // expecting response.data to look like: { token: "...", role: "doctor", ... }
      const { token, role } = response.data

      // 5. Save to LocalStorage so the user stays logged in
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      
      // 6. Redirect based on Role
      if (role === 'doctor') {
        navigate('/doctor/dashboard')
      } else if (role === 'patient') {
        navigate('/patient/dashboard')
      } else {
        // Fallback if role is weird
        alert('Unknown role: ' + role)
      }

    } catch (error) {
      console.error('Login Error:', error)
      // Show the error message from the backend (e.g., "Invalid password")
      alert(error.response?.data?.message || 'Login Failed. Please checks your credentials.')
    }
  }

  return (
    <AuthForm
      title="Welcome Back"
      footer={
        <span>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Sign Up
          </Link>
        </span>
      }
    >
      {/* Connect the submit handler here */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        <Input 
          label="Email" 
          type="email" 
          name="email" 
          placeholder="you@example.com" 
          required 
          value={formData.email}   // Bind value
          onChange={handleChange}  // Bind change
        />
        
        <Input 
          label="Password" 
          type="password" 
          name="password" 
          placeholder="••••••••" 
          required 
          value={formData.password} // Bind value
          onChange={handleChange}   // Bind change
        />
        
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </AuthForm>
  )
}

export default Login

