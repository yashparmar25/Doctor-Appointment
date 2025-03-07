import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, slotDateFormate, cancelAppointment, completeAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [])

  return dashData && (
    <div className="m-5 bg-gray-50 min-h-screen p-6 rounded-lg shadow-md">
      {/* Dashboard Cards */}
      <div className="flex flex-wrap gap-4">
        {[
          { icon: assets.earning_icon, value: `₹ ${dashData.earning}`, label: "Earning" },
          { icon: assets.appointment_icon, value: dashData.appointments, label: "Appointments" },
          { icon: assets.patients_icon, value: dashData.patients, label: "Patients" },
        ].map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white p-4 min-w-52 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
          >
            <img className="w-14" src={card.icon} alt={card.label} />
            <div>
              <p className="text-xl font-semibold text-gray-700">{card.value}</p>
              <p className="text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Booking Section */}
      <div className="bg-white mt-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 px-4 py-4 rounded-t border-b bg-gray-100">
          <img src={assets.list_icon} alt="Latest Bookings" />
          <p className="font-semibold text-gray-700">Latest Booking</p>
        </div>

        <div className="pt-4 border border-t-0 rounded-b-lg">
          {dashData.latestAppointments.map((item, index) => (
            <div key={index} className="flex items-center px-6 py-4 gap-4 hover:bg-gray-100 transition-all">
              <img className="rounded-full w-12 h-12 object-cover border border-gray-300" src={item.userData.image} alt="User" />

              <div className="flex-1 text-sm">
                <p className="text-gray-900 font-medium">{item.userData.name}</p>
                <p className="text-gray-600">{slotDateFormate(item.slotDate)}</p>
              </div>

              {/* Status Label */}
              {item.cancelled ? (
                <p className="bg-red-600 text-white px-4 py-2 rounded-lg text-center font-semibold shadow-md">
                  Cancelled
                </p>
              ) : item.isCompleted ? (
                <p className="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold shadow-md">
                  Completed
                </p>
              ) : (
                <div className="flex gap-4 items-center">
                  {/* Cancel Appointment Button */}
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 h-10 object-contain flex-shrink-0 cursor-pointer transition-transform transform hover:scale-110 hover:opacity-80"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  {/* Complete Appointment Button */}
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-10 h-10 object-contain flex-shrink-0 cursor-pointer transition-transform transform hover:scale-110 hover:opacity-80"
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
