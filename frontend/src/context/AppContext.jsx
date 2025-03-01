import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencysymbol = "$";
    const [doctors, setDoctors] = useState([]);
    const [token,setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token') : null);
    const [userData,setUserData] =useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    

    const getDoctorsData = async () => {
        try {
            const {data} =  await axios.get(backendUrl+'/api/doctor/list')
            console.log(backendUrl)
            if(data.success){
                setDoctors(data.doctors)
                toast.success(doctors)
            } 
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Axios Error:", error?.response?.data || error.message);
            toast.error(error?.response?.data?.message || "Error fetching doctors");
        }
    };

    const loadUserProfileData = async () => {
        if (!token) return;
    
        try {
            const response = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });
            console.log("🔍 Full API Response:", response); // ✅ Log full response
    
            // Extract data safely
            const data = response?.data;
    
            if (data?.success && data?.user) {
                setUserData(data.user);
                toast.success("User data successfully loaded");
            } else {
                console.error("❌ Invalid API response structure:", data);
                toast.error("Invalid response structure");
            }
        } catch (error) {
            console.error("Axios Error:", error?.response?.data || error.message);
            toast.error(error?.response?.data?.message || "Error fetching user profile");
        }
    };
    
    
    

    const value = {
        doctors,
        currencysymbol,
        getDoctorsData,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData
        
    };
    
    
    
    useEffect(() => {
        getDoctorsData();
    }, []);
    
    useEffect(() => {
        console.log("Doctors State Updated:", doctors); 
    }, [doctors]); 
     
    useEffect(() => {
        if(token){

            loadUserProfileData();
        }
        else{
            setUserData(false)
        }
    }, [token]);

    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
