import React, { useEffect, useState, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { getDoctorProfile, updateDoctorProfile } from '../../api/client'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken } = useContext(DoctorContext)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const fetchProfile = async () => {
    if (!dToken) return
    try {
      setLoading(true)
      const data = await getDoctorProfile()
      if (data.success) {
        setProfile(data.doctor)
      } else {
        toast.error(data.message || 'Failed to load profile')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [dToken])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, address: { ...(prev?.address || {}), [name]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!profile) return
    try {
      setSaving(true)
      const payload = {
        name: profile.name,
        speciality: profile.speciality,
        degree: profile.degree,
        experience: profile.experience,
        about: profile.about,
        fees: profile.fees,
        address: profile.address,
      }
      if (imageFile) payload.image = imageFile

      const data = await updateDoctorProfile(payload)
      if (data.success) {
        toast.success('Profile updated')
        setProfile(data.doctor)
        setImageFile(null)
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return (
      <div className='m-5'>
        <p className='text-lg font-medium'>Profile</p>
        <div className='bg-white rounded border p-6 mt-4'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='m-5 w-full max-w-3xl'>
      <p className='text-lg font-medium mb-4'>Profile</p>
      <form onSubmit={handleSubmit} className='bg-white rounded border p-6 space-y-4'>
        <div className='flex items-center gap-4'>
          <img className='w-20 h-20 rounded-full object-cover' src={imageFile ? URL.createObjectURL(imageFile) : profile.image} alt='' />
          <label className='text-sm'>
            <span className='border px-3 py-2 rounded cursor-pointer'>Change Photo</span>
            <input type='file' accept='image/*' className='hidden' onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm text-gray-600'>Name</label>
            <input name='name' value={profile.name || ''} onChange={handleChange} className='w-full border rounded p-2 mt-1' />
          </div>
          <div>
            <label className='text-sm text-gray-600'>Speciality</label>
            <input name='speciality' value={profile.speciality || ''} onChange={handleChange} className='w-full border rounded p-2 mt-1' />
          </div>
          <div>
            <label className='text-sm text-gray-600'>Degree</label>
            <input name='degree' value={profile.degree || ''} onChange={handleChange} className='w-full border rounded p-2 mt-1' />
          </div>
          <div>
            <label className='text-sm text-gray-600'>Experience</label>
            <input name='experience' value={profile.experience || ''} onChange={handleChange} className='w-full border rounded p-2 mt-1' />
          </div>
        </div>

        <div>
          <label className='text-sm text-gray-600'>About</label>
          <textarea name='about' value={profile.about || ''} onChange={handleChange} className='w-full border rounded p-2 mt-1' rows={3} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm text-gray-600'>Consultation Fee (₹)</label>
            <input name='fees' type='number' value={profile.fees || 0} onChange={handleChange} className='w-full border rounded p-2 mt-1' />
          </div>
        </div>

        <div>
          <p className='text-sm text-gray-600 mb-1'>Address</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input placeholder='Line 1' name='line1' value={profile.address?.line1 || ''} onChange={handleAddressChange} className='w-full border rounded p-2' />
            <input placeholder='Line 2' name='line2' value={profile.address?.line2 || ''} onChange={handleAddressChange} className='w-full border rounded p-2' />
            <input placeholder='City' name='city' value={profile.address?.city || ''} onChange={handleAddressChange} className='w-full border rounded p-2' />
            <input placeholder='State' name='state' value={profile.address?.state || ''} onChange={handleAddressChange} className='w-full border rounded p-2' />
            <input placeholder='Pincode' name='pincode' value={profile.address?.pincode || ''} onChange={handleAddressChange} className='w-full border rounded p-2' />
          </div>
        </div>

        <div className='pt-2'>
          <button disabled={saving} className='bg-primary text-white px-4 py-2 rounded disabled:opacity-60'>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DoctorProfile