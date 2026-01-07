import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import { 
  getDoctorAppointments, 
  completeAppointment as completeAppointmentApi, 
  cancelAppointment as cancelAppointmentApi 
} from '../api/client';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Check if token is valid on component mount
    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, []);

    // Handle token expiration
    const handleTokenExpiration = () => {
        localStorage.removeItem('dToken');
        setDToken('');
        toast.error("Your session has expired. Please login again.");
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    };
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const slotDateFormate = (dateString) => {
        if (!dateString) return "Invalid Date";
        const [day, month, year] = dateString.split('-'); // Assuming "DD-MM-YYYY" format
        return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    };

    const getAppointments = useCallback(async () => {
        if (!dToken) {
            return;
        }
        
        setIsLoading(true);
        try {
            const data = await getDoctorAppointments();
            if (data.success) {
                setAppointments((data.appointments || []).slice().reverse());
            } else {
                toast.error(data.message || "Failed to fetch appointments");
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            
            // Check if token expired
            if (error.message?.includes("expired") || error.message?.includes("TokenExpiredError")) {
                handleTokenExpiration();
            } else if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error(error?.message || "Failed to fetch appointments");
            }
        } finally {
            setIsLoading(false);
        }
    }, [dToken]);

    const completeAppointment = async (appointmentId) => {
        if (!dToken) {
            toast.error("Please login first");
            return;
        }
        
        try {
            const data = await completeAppointmentApi(appointmentId);
            if (data.success) {
                toast.success(data.message || "Appointment completed successfully");
                getAppointments();
            } else {
                toast.error(data.message || "Failed to complete appointment");
            }
        } catch (error) {
            console.error("Error completing appointment:", error);
            
            // Check if token expired
            if (error.message?.includes("expired") || error.message?.includes("TokenExpiredError")) {
                handleTokenExpiration();
            } else {
                toast.error(error.message || "Failed to complete appointment");
            }
        }
    };

    const cancelAppointment = async (appointmentId) => {
        if (!dToken) {
            toast.error("Please login first");
            return;
        }
        
        try {
            const data = await cancelAppointmentApi(appointmentId);
            if (data.success) {
                toast.success(data.message || "Appointment cancelled successfully");
                getAppointments();
            } else {
                toast.error(data.message || "Failed to cancel appointment");
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            
            // Check if token expired
            if (error.message?.includes("expired") || error.message?.includes("TokenExpiredError")) {
                handleTokenExpiration();
            } else {
                toast.error(error.message || "Failed to cancel appointment");
            }
        }
    };
    
    const value = {
        dToken,
        setDToken,
        appointments,
        setAppointments,
        getAppointments,
        calculateAge,
        slotDateFormate,
        cancelAppointment,
        completeAppointment,
        isLoading,
        handleTokenExpiration
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;