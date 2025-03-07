import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { getDashData, dashData, aToken, cancelAppointment } = useContext(AdminContext)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const slotDateFormate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const [day, month, year] = dateString.split('-'); // Assuming "DD-MM-YYYY" format
    return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  };
  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken, getDashData])

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Booking Section */}
      <div className='bg-white mt-6'>
        <div className='flex items-center gap-2.5 px-4 py-4 mb-4 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Booking</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointment.map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.docData.image} alt="Doctor" />

              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600'>{slotDateFormate(item.slotDate)}</p>
              </div>

              {
  item.cancelled ? (
    <p className="bg-red-500 text-white px-4 py-2 rounded-lg text-center font-semibold shadow-md">
      Cancelled
    </p>
  ) : item.isCompleted ? (
    <p className="bg-green-500 text-white px-4 py-2 rounded-lg text-center font-semibold shadow-md">
      Completed
    </p>
  ) : (
    <div className="flex gap-4 items-center">
      {/* Cancel Appointment Button */}
      <img
        onClick={() => cancelAppointment(item._id)}
        className="w-10 h-10 cursor-pointer transition-transform transform hover:scale-110 hover:opacity-80"
        src={assets.cancel_icon}
        alt="Cancel"
      />
      {/* Complete Appointment Button */}
      <img
        onClick={() => completeAppointment(item._id)}
        className="w-10 h-10 cursor-pointer transition-transform transform hover:scale-110 hover:opacity-80"
        src={assets.tick_icon}
        alt="Complete"
      />
    </div>
  )
}

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
