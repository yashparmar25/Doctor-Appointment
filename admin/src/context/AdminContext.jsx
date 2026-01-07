import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

// Create AdminContext
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointment] = useState([])
  const [dashData, setDashData] = useState(false);

  // Load backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/all-doctors',
        {},
        {
          headers: { aToken } // ✅ Correct format
        }
      );
      if (data) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
      if (data.success) {
        toast.success(data.message)
        getAllDoctors()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });
      if (data.success) {
        setAppointment(data.appointments)
        console.log(data.appointments);

      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });
      if (data.success) {
        setDashData(data);
        console.log(data.dashData);
        
      } else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message);
    }
  }
  // Context value
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments, setAppointment,
    getAllAppointments,
    cancelAppointment,
    getDashData,dashData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

