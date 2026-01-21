import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { getDashData, dashData, aToken, cancelAppointment } = useContext(AdminContext);
  const {slotDateFormate } = useContext(AppContext);

  useEffect(() => {
    console.log("Fetching dashboard data...");
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  console.log("Dashboard Data:", dashData);

  if (!dashData || !dashData.success || !dashData.dashData) return <div>Loading...</div>;

  const data = dashData.dashData; // Extracting actual dashboard data

 return (
  <div className="p-6 bg-gray-50 min-h-screen w-full">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h2>
      
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

      <div className="bg-white p-6 rounded-2xl shadow 
      hover:shadow-xl transition w-full">

        <div className="flex items-center gap-4">
          <img src={assets.doctor_icon} className="w-12" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {data.doctors}
            </p>
            <p className="text-gray-400">
              Doctors
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow 
      hover:shadow-xl transition w-full">

        <div className="flex items-center gap-4">
          <img src={assets.appointment_icon} className="w-12" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {data.appointments}
            </p>
            <p className="text-gray-400">
              Appointments
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow 
      hover:shadow-xl transition w-full">

        <div className="flex items-center gap-4">
          <img src={assets.patients_icon} className="w-12" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {data.patients}
            </p>
            <p className="text-gray-400">
              Patients
            </p>
          </div>
        </div>
      </div>

    </div>

    {/* Table Section */}
    <div className="bg-white rounded-2xl shadow border w-full">

      <div className="flex items-center justify-between px-6 py-4 border-b">
        <p className="font-semibold text-gray-800 text-lg">
          Latest Bookings
        </p>
        <span className="text-sm text-gray-400">
          {data.latestAppointments.length} Records
        </span>
      </div>

      <div className="divide-y">

        {data.latestAppointments.map((appointment, index) => (
          <div
            key={index}
            className="flex items-center justify-between
            px-6 py-4 hover:bg-gray-50 transition"
          >

            <div className="flex items-center gap-4">
              <img
                src={appointment.docData.image}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold text-gray-800">
                  {appointment.docData.name}
                </p>
                <p className="text-sm text-gray-400">
                  {slotDateFormate(appointment.slotDate)}
                </p>
              </div>
            </div>

            {appointment.cancelled ? (
              <span className="bg-red-100 text-red-600 
              px-4 py-1 rounded-full text-xs font-semibold">
                Cancelled
              </span>
            ) : (
              <img
                onClick={() => cancelAppointment(appointment._id)}
                src={assets.cancel_icon}
                className="w-9 cursor-pointer hover:scale-110"
              />
            )}
          </div>
        ))}

      </div>
    </div>

  </div>
);



};

export default Dashboard;


