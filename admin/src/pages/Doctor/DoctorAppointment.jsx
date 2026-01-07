import React, { useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DoctorAppointment = () => {
  const { 
    dToken, 
    appointments, 
    getAppointments, 
    slotDateFormate, 
    calculateAge, 
    completeAppointment, 
    cancelAppointment,
    isLoading,
    handleTokenExpiration
  } = useContext(DoctorContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!dToken) {
      toast.error("Please login first");
      navigate('/');
      return;
    }
    getAppointments();
  }, [dToken]);

  // Handle appointment actions
  const handleCompleteAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to complete this appointment?")) {
      completeAppointment(appointmentId);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment(appointmentId);
    }
  };

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

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          /* Table Rows */
          appointments?.length > 0 ? (
            appointments.map((item, index) => (
              <div
                key={index}
                className="flex flax-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100"
              >
                <p className="max-sm:hidden">{index+1}</p>
                <div className="flex items-center gap-2">
                  <img className="w-8 rounded-full" src={item.userData.image} alt="" />
                  <p>{item.userData.name}</p>
                </div>
                <div>
                  <p className="text-xs inline border border-indigo-500 px-2 rounded-full">{item.payment?'Online':'CASH'}</p>
                </div>
                <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
                <p>{slotDateFormate(item.slotDate)}, {item.slotTime}</p> 
                <p>{item.amount}</p>
                <div className="flex">
                  <img 
                    onClick={() => handleCancelAppointment(item._id)} 
                    className="w-10 cursor-pointer" 
                    src={assets.cancel_icon} 
                    alt="Cancel" 
                  />
                  <img 
                    onClick={() => handleCompleteAppointment(item._id)} 
                    className="w-10 cursor-pointer" 
                    src={assets.tick_icon} 
                    alt="Complete" 
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">No appointments found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
