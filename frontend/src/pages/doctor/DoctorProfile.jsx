import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../../components/DashboardLayout'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { doctorLinks } from './DoctorDashboard'
import useLogoutNavigation from '../../hooks/useLogoutNavigation'

const API_BASE_URL = 'http://localhost:5000/api'
const initialInfoState = {
  name: '',
  phone: '',
  address: '',
  specialization: '',
  clinic: '',
  experienceYears: '',
}
const initialFieldState = { label: '', value: '' }

const DoctorProfile = () => {
  const handleLogout = useLogoutNavigation()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [infoForm, setInfoForm] = useState(initialInfoState)
  const [fieldForm, setFieldForm] = useState(initialFieldState)
  const [editingFieldId, setEditingFieldId] = useState(null)

  const [savingInfo, setSavingInfo] = useState(false)
  const [savingField, setSavingField] = useState(false)
  const [deletingFieldId, setDeletingFieldId] = useState(null)

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${API_BASE_URL}/doctor/profile`, {
        headers: authHeaders(),
      })
      setProfile(response.data)
      setInfoForm({
        name: response.data.name || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        specialization: response.data.specialization || '',
        clinic: response.data.clinic || '',
        experienceYears:
          typeof response.data.experienceYears === 'number' ? String(response.data.experienceYears) : '',
      })
    } catch (err) {
      console.error('Failed to load doctor profile', err)
      setError(err.response?.data?.message || 'Unable to load doctor profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleInfoChange = (e) => {
    const { name, value } = e.target
    setInfoForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...infoForm,
      experienceYears: infoForm.experienceYears === '' ? undefined : Number(infoForm.experienceYears),
    }

    try {
      setSavingInfo(true)
      setError('')
      await axios.put(`${API_BASE_URL}/doctor/profile`, payload, {
        headers: authHeaders(),
      })
      await fetchProfile()
    } catch (err) {
      console.error('Failed to update doctor profile', err)
      setError(err.response?.data?.message || 'Unable to update profile')
    } finally {
      setSavingInfo(false)
    }
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setFieldForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFieldSubmit = async (e) => {
    e.preventDefault()
    if (!fieldForm.label || !fieldForm.value) {
      setError('Please provide both label and value')
      return
    }

    try {
      setSavingField(true)
      setError('')

      if (editingFieldId) {
        await axios.put(`${API_BASE_URL}/doctor/profile/fields/${editingFieldId}`, fieldForm, {
          headers: authHeaders(),
        })
      } else {
        await axios.post(`${API_BASE_URL}/doctor/profile/fields`, fieldForm, {
          headers: authHeaders(),
        })
      }

      setFieldForm(initialFieldState)
      setEditingFieldId(null)
      await fetchProfile()
    } catch (err) {
      console.error('Failed to save doctor profile field', err)
      setError(err.response?.data?.message || 'Unable to save detail')
    } finally {
      setSavingField(false)
    }
  }

  const handleEditField = (field) => {
    setEditingFieldId(field._id)
    setFieldForm({ label: field.label, value: field.value })
  }

  const handleCancelEdit = () => {
    setEditingFieldId(null)
    setFieldForm(initialFieldState)
  }

  const handleDeleteField = async (fieldId) => {
    const confirmed = window.confirm('Delete this detail?')
    if (!confirmed) return

    try {
      setDeletingFieldId(fieldId)
      setError('')
      await axios.delete(`${API_BASE_URL}/doctor/profile/fields/${fieldId}`, {
        headers: authHeaders(),
      })
      await fetchProfile()
    } catch (err) {
      console.error('Failed to delete doctor profile field', err)
      setError(err.response?.data?.message || 'Unable to delete detail')
    } finally {
      setDeletingFieldId(null)
    }
  }

  return (
    <DashboardLayout links={doctorLinks} title="Doctor Portal" onLogout={handleLogout}>
      <section className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Profile</p>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
          </div>
          <p className="text-gray-500">Add new credentials, update professional info, or delete data you no longer want to display.</p>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
        </div>

        {loading && <p className="text-gray-500">Loading profile...</p>}

        {!loading && (
          <div className="space-y-8">
            <form className="space-y-4" onSubmit={handleInfoSubmit}>
              <h2 className="text-xl font-semibold text-gray-900">Update Professional Information</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Full Name" name="name" value={infoForm.name} onChange={handleInfoChange} required />
                <Input label="Phone Number" name="phone" value={infoForm.phone} onChange={handleInfoChange} />
                <Input label="Clinic Address" name="address" value={infoForm.address} onChange={handleInfoChange} />
                <Input label="Specialization" name="specialization" value={infoForm.specialization} onChange={handleInfoChange} />
                <Input label="Clinic / Hospital" name="clinic" value={infoForm.clinic} onChange={handleInfoChange} />
                <Input
                  label="Years of Experience"
                  name="experienceYears"
                  type="number"
                  min="0"
                  value={infoForm.experienceYears}
                  onChange={handleInfoChange}
                />
              </div>
              <Button type="submit" disabled={savingInfo}>
                {savingInfo ? 'Saving...' : 'Update Profile'}
              </Button>
            </form>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Custom Details</h2>
              <form className="grid gap-4 md:grid-cols-3" onSubmit={handleFieldSubmit}>
                <Input label="Label" name="label" value={fieldForm.label} onChange={handleFieldChange} required />
                <Input label="Value" name="value" value={fieldForm.value} onChange={handleFieldChange} required />
                <div className="flex items-end gap-2">
                  <Button type="submit" className="w-full" disabled={savingField}>
                    {editingFieldId ? (savingField ? 'Updating...' : 'Update Detail') : savingField ? 'Adding...' : 'Add Detail'}
                  </Button>
                  {editingFieldId && (
                    <Button type="button" variant="secondary" className="w-full" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>

              <div className="grid gap-4 md:grid-cols-2">
                {(profile?.profileFields || []).length === 0 && (
                  <p className="text-gray-500">No custom details yet. Add credentials, certifications, or achievements above.</p>
                )}
                {(profile?.profileFields || []).map((field) => (
                  <div key={field._id} className="flex flex-col justify-between border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div>
                      <p className="text-sm text-gray-500">{field.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{field.value}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="button" className="flex-1" variant="primary" onClick={() => handleEditField(field)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        variant="secondary"
                        onClick={() => handleDeleteField(field._id)}
                        disabled={deletingFieldId === field._id}
                      >
                        {deletingFieldId === field._id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}

export default DoctorProfile
