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
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{data.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{data.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{data.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Booking</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {data.latestAppointments.map((appointment, index) => (
            <div key={index} className="flex items-center px-6 py-3 gap-3">
              <img src={appointment.docData.image} alt="" className="w-10 rounded-full" />
              <div>
                <p className="text-gray-800 font-medium">{appointment.docData.name}</p>
                <p className="text-gray-800">{slotDateFormate(appointment.slotDate)}</p>
              </div>
              {appointment.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : (
                <img 
                  onClick={() => cancelAppointment(appointment._id)} 
                  className="w-10 cursor-pointer ml-auto" 
                  src={assets.cancel_icon} 
                  alt="Cancel" 
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



// import React from 'react'
// import { useContext, useEffect } from 'react'
// import { AdminContext } from '../../context/AdminContext'
// import {assets} from '../../assets/assets'

// const Dashboard = () => {

//   const {getDashData,dashData,aToken,cancelAppointment} = useContext(AdminContext)
//   useEffect(() => {
//     if(aToken){
//       getDashData()
//     }
//   }, [aToken])

//   return dashData &&(
//     <div className='m-5'>
//       <div className='flex flex-wrap gap-3'>
//         <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 trasition-all'>
//           <img src={assets.doctor_icon} alt="" />
//           <div>
//             <p>{dashData.doctors}</p>
//             <p>Doctors</p>
//           </div>
//         </div>

//         <div>
//           <img src={assets.appointment_icon} alt="" />
//           <div>
//             <p>{dashData.appointments}</p>
//             <p>Appointments</p>
//           </div>
//         </div>

//         <div>
//           <img src={assets.patients_icon} alt="" />
//           <div>
//             <p>{dashData.patients}</p>
//             <p>Patients</p>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default Dashboard