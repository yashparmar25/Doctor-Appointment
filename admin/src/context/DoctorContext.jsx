import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider =  (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setAppointments] = useState([])
    const [dashData,setDashData] = useState(false)
    const [ profileData,setProfileData] = useState(false)

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const slotDateFormate = (dateString) => {
        if (!dateString) return "Invalid Date";
        const [day, month, year] = dateString.split('-'); // Assuming "DD-MM-YYYY" format
        return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    };


    const getAppointments = async () => {
        try {

            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {headers: {dToken}});
            if (data.success) {
                setAppointments(data.appointments.reverse())
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);

            toast.error(error.message)
        }
    }
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`, 
                { appointmentId }, 
                { 
                    headers: { 
                        dtoken: dToken,  // ✅ Ensure key matches what the backend expects
                        "Content-Type": "application/json"
                    } 
                }
            );
    
            if (data.success) {
                toast.success(data.message);
                getAppointments();  // ✅ Use correct function name
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
    
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`, 
                { appointmentId }, 
                { 
                    headers: { 
                        dtoken: dToken,  // ✅ Ensure key matches what the backend expects
                        "Content-Type": "application/json"
                    } 
                }
            );
    
            if (data.success) {
                toast.success(data.message);
                getAppointments();  // ✅ Use correct function name
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const getDashData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{ dToken }})
            if(data.success){
                setDashData(data.dashData)                
                }else{
                    toast.error(data.message)
                }
            
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getProfileData = async()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/profile',{headers:{dToken}})
            if(data.success){
                setProfileData(data.profileData)
            }

        } catch (error) {
            console.log(error);
            
            toast.error(error.response?.data?.message || error.message);
        }
    }
    
    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        calculateAge,
        slotDateFormate,
        cancelAppointment,
        completeAppointment,
        getDashData,dashData,setDashData,
        getProfileData,setProfileData,profileData
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider