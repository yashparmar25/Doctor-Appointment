import React, { useContext, useEffect, useMemo } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const { dToken, appointments, getAppointments, isLoading } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const stats = useMemo(() => {
    const total = appointments?.length || 0
    const completed = appointments?.filter(a => a.isCompleted)?.length || 0
    const cancelled = appointments?.filter(a => a.cancelled)?.length || 0
    const upcoming = appointments?.filter(a => !a.isCompleted && !a.cancelled)?.length || 0
    const earnings = appointments?.filter(a => a.payment && a.isCompleted)
      ?.reduce((sum, a) => sum + (Number(a.amount) || 0), 0) || 0

    return { total, completed, cancelled, upcoming, earnings }
  }, [appointments])

  return (
    <div className='m-5 w-full'>
      <p className='text-xl font-semibold mb-4'>Dashboard</p>

      {/* Top Stat Cards */}
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{stats.total}</p>
            <p className='text-gray-400'>Total Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img src={assets.tick_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{stats.completed}</p>
            <p className='text-gray-400'>Completed</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img src={assets.cancel_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{stats.cancelled}</p>
            <p className='text-gray-400'>Cancelled</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{stats.upcoming}</p>
            <p className='text-gray-400'>Upcoming</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>₹{stats.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className='bg-white border rounded text-sm mt-6'>
        <div className='flex items-center justify-between px-6 py-3 border-b'>
          <p className='font-semibold'>Recent Appointments</p>
          {isLoading && <p className='text-gray-400 text-xs'>Loading...</p>}
        </div>

        {appointments && appointments.length > 0 ? (
          appointments.slice(0, 6).map((item, idx) => (
            <div key={item._id || idx} className='flex justify-between items-center px-6 py-3 border-b text-gray-600'>
              <div className='flex items-center gap-3'>
                <img className='w-8 h-8 rounded-full' src={item.userData?.image} alt='' />
                <div>
                  <p className='text-sm'>{item.userData?.name}</p>
                  <p className='text-xs text-gray-400'>{item.slotDate}, {item.slotTime}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {item.isCompleted ? (
                  <span className='text-xs px-2 py-1 rounded-full border border-green-500 text-green-600'>Completed</span>
                ) : item.cancelled ? (
                  <span className='text-xs px-2 py-1 rounded-full border border-red-500 text-red-600'>Cancelled</span>
                ) : (
                  <span className='text-xs px-2 py-1 rounded-full border border-blue-500 text-blue-600'>Upcoming</span>
                )}
                <span className='text-sm'>₹{item.amount}</span>
              </div>
            </div>
          ))
        ) : (
          <p className='px-6 py-4 text-gray-500'>No appointments found.</p>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard