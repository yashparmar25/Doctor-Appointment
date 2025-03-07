import React, { useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments, slotDateFormate, calculateAge, completeAppointment, cancelAppointment } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken, getAppointments]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        {/* Table Header */}
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b font-semibold">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Table Rows */}
        {appointments?.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flax-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100"
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.userData.image} alt="" /><p>{item.userData.name}</p>
              </div>
              <div>
  <p
    className={`text-xs inline px-3 py-1 rounded-full font-semibold shadow-md 
      ${item.payment ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-yellow-400 text-black border-yellow-500'}`}
  >
    {item.payment ? 'Online' : 'CASH'}
  </p>
</div>

              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormate(item.slotDate)}, {item.slotTime}</p>
              <p>₹ {item.amount}</p>
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
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 h-10 cursor-pointer transition-transform transform hover:scale-110 hover:opacity-80"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
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
          ))
        ) : (
          <p className="text-center py-4 text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
