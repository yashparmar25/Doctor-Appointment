import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [experience,setExperience] = useState('1 Year')
  const [fees,setFees] = useState('')
  const [about,setAbout] = useState('')
  const [speciality,setSpeciality] = useState('Gynecologist')
  const [degree,setDegree] = useState('')
  const [address1,setAddress1] = useState('')
  const [address2,setAddress2] = useState('')

  const {backendUrl , aToken} = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if(!docImg){
        return toast.error('Image not selected')
      }
      const formData = new FormData()
      formData.append('image',docImg)
      formData.append('name',name)
      formData.append('email',email)
      formData.append('password',password)
      formData.append('experience',experience)
      formData.append('fees',fees)
      formData.append('about',about)
      formData.append('speciality',speciality)
      formData.append('degree',degree)
      formData.append('address',JSON.stringify({line1:address1,line2:address2}))

      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`);
        
      })

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formData,{headers:{aToken}})
      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error);
      
    }
  }


  

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-semibold'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-md'>
        <div className='flex items-center gap-4 mb-8 text-gray-600'>
          <label htmlFor="doc-img" className='cursor-pointer'>
            <img
              className='w-16 h-16 bg-gray-100 rounded-full object-cover'
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className='text-sm'>Upload doctor <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row gap-10 text-gray-700'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <label className='flex flex-col gap-1'>
              <span>Doctor Name</span>
              <input className='border-2 rounded' onChange={(e)=>setName(e.target.value)} value={name} type="text" name="name" required />
            </label>
            <label className='flex flex-col gap-1'>
              <span>Doctor Email</span>
              <input className='border-2 rounded' onChange={(e)=>setEmail(e.target.value)} value={email} type="email" name="email" required />
            </label>
            <label className='flex flex-col gap-1'>
              <span>Doctor Password</span>
              <input className='border-2 rounded' onChange={(e)=>setPassword(e.target.value)} value={password} type="password" name="password" required />
            </label>
            <label className='flex flex-col gap-1'>
              <span>Experience</span>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} name="experience">
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
                ))}
              </select>
            </label>
            <label className='flex flex-col gap-1'>
              <span>Fees</span>
              <input className='border-2 rounded' onChange={(e)=>setFees(e.target.value)} value={fees} type="number" name="fees" required />
            </label>
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <label className='flex flex-col gap-1'>
              <span>Speciality</span>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} name="speciality">
                {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((spec, i) => (
                  <option key={i} value={spec}>{spec}</option>
                ))}
              </select>
            </label>
            <label className='flex flex-col gap-1'>
              <span>Education</span>
              <input className='border-2 rounded' onChange={(e)=>setDegree(e.target.value)} value={degree} type="text" name="degree" required />
            </label>
            <label className='flex flex-col gap-1'>
              <span>Address</span>
              <input className='border-2 rounded' onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" name="address1" required />
              <input className='border-2 rounded' onChange={(e)=>setAddress2(e.target.value)} value={address2} type="text" name="address2" required />
            </label>
          </div>
        </div>
        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea onChange={(e)=>setAbout(e.target.value)} value={about} name="" id="" className='w-full h-20' placeholder='write about doctor'></textarea>
        </div>
        <button type='submit' className='mt-5 bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-700 transition'>
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
