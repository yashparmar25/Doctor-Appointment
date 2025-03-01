import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

// Create AdminContext
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'): '');
  const [doctors,setDoctors] =useState([])

  // Load backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/all-doctors',
        {},
        {
          headers: {aToken} // ✅ Correct format
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
  
  const changeAvailability = async (docId) =>{
    try {
      const {data} = await axios.post(backendUrl+'/api/admin/change-availability',{docId}, { headers: { aToken } })
      if(data.success){
        toast.success(data.message)
        getAllDoctors()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message); 
    }
  }

  // Context value
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

