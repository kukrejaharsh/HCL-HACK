
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Import useNavigate
import axios from 'axios' // Import Axios
import AuthForm from '../components/AuthForm'
import Input from '../components/Input'
import Button from '../components/Button'

const roleOptions = [
  { label: 'I am a Patient', value: 'patient' },
  { label: 'I am a Doctor', value: 'doctor' },
]

const SignUp = () => {
  const navigate = useNavigate()
  
  // 1. State to hold form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: ''
  })

  // 2. Function to handle typing in inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 3. Function to submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault() // <--- CRITICAL: Stops the page reload
    console.log('Sending data:', formData)

    try {
      // Make sure this URL matches your Backend exactly
      // Note: I mapped 'fullName' to 'name' because backends usually expect 'name'
      const payload = {
        name: formData.fullName, 
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      }

      const response = await axios.post('http://localhost:5000/api/auth/signup', payload)
      
      console.log('Success:', response.data)
      alert('Account Created! Please Log In.')
      navigate('/login') // Redirect to login page

    } catch (error) {
      console.error('Signup Error:', error)
      // Show alert if backend sends an error message (like "Email already exists")
      alert(error.response?.data?.message || 'Signup Failed')
    }
  }

  return (
    <AuthForm
      title="Create Your Account"
      footer={
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold">
            Log In
          </Link>
        </span>
      }
    >
      {/* Add onSubmit to the form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        <Input 
          label="Full Name" 
          name="fullName" 
          placeholder="Jane Doe" 
          required 
          value={formData.fullName} // Bind value
          onChange={handleChange}   // Bind change
        />
        
        <Input 
          label="Email" 
          name="email" 
          type="email" 
          placeholder="you@example.com" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
        
        <Input 
          label="Password" 
          name="password" 
          type="password" 
          placeholder="••••••••" 
          required 
          value={formData.password}
          onChange={handleChange}
        />
        
        <Input 
          label="Phone Number" 
          name="phone" 
          placeholder="(123) 456-7890" 
          value={formData.phone}
          onChange={handleChange}
        />
        
        <Input 
          label="Address" 
          name="address" 
          placeholder="123 Wellness Ave, Suite 200" 
          value={formData.address}
          onChange={handleChange}
        />

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Role
          <select
            name="role"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your role</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </AuthForm>
  )
}

export default SignUp