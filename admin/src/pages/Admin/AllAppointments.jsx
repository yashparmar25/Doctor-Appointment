import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormate } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <p className="mb-4 text-xl font-semibold text-gray-700">All Appointments</p>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Table Headers */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_0.8fr_1.2fr_1fr_1.5fr_0.8fr_1fr] text-gray-600 bg-gray-100 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date</p>
          <p>Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_0.8fr_1.2fr_1fr_1.5fr_0.8fr_1fr] items-center text-gray-700 py-4 px-6 border-b hover:bg-gray-50 transition"
            >
              <p className="hidden sm:block">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full border border-gray-300"
                  src={item.userData.image}
                  alt="Patient"
                />
                <p className="text-sm font-medium">{item.userData.name}</p>
              </div>

              {/* Age */}
              <p className="hidden sm:block text-sm">{calculateAge(item.userData.dob)}</p>

              {/* Appointment Date & Time */}
              <p className="text-sm">{slotDateFormate(item.slotDate)}</p>
              <p className="text-sm">{item.slotTime}</p>

              {/* Doctor Info */}
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300"
                  src={item.docData.image}
                  alt="Doctor"
                />
                <p className="text-sm font-medium">{item.docData.name}</p>
              </div>

              {/* Fees */}
              <p className="text-sm font-semibold text-green-600">₹ {item.amount}</p>

              {/* Actions */}
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : (
                <img onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer ml-2" src={assets.cancel_icon} alt="Cancel" />
              )}
            </div>
          ))
        ) : (
          <p className="p-6 text-center text-gray-500">No Appointments Found</p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
