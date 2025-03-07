import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors, setDoctors } = useContext(AppContext); // Ensure setDoctors is available

    const fetchDoctors = async () => {
        try {
            const response = await fetch("/api/doctorList");
            const data = await response.json();

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                console.error("Failed to fetch doctors:", data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    useEffect(() => {
        fetchDoctors(); // Fetch doctors when the component loads
    }, []);

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>
                Simply browse through our extensive list of trusted doctors.
            </p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((doctor) => (
                    <div 
                        key={doctor._id} 
                        onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0); }} 
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                    >
                        <img className='bg-blue-50' src={doctor.image} alt={doctor.name} />
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-center text-sm'>
                                <p className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}></p>
                                <p className={doctor.available ? 'text-green-500' : 'text-red-500'}>
                                    {doctor.available ? "Available" : "Unavailable"}
                                </p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p>
                            <p className='text-gray-600 text-sm'>{doctor.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} 
                className='bg-blue-50 text-gray-900 px-12 py-3 rounded-full mt-10'
            >
                More
            </button>
        </div>
    );
};

export default TopDoctors;

// import {AppContext} from '../context/AppContext'
// import { useNavigate } from 'react-router-dom'

// const TopDoctors = () => {

//     const navigate = useNavigate()
//     const {doctors} = useContext(AppContext)

//   return (
    
//     <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
//         <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
//         <p className='sm:w-1/3 text-center test-sm'>Simply browse through our extensive list of trusted doctors.</p>
//         <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
//             {doctors.slice(0,10).map((item,index)=>(
//                 <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
//                     <img className='bg-blue-50' src={item.image} alt="" />
//                     <div className='p-4'>
//                         <div className='flex items-center gap-2 text-center text-sm text-green-500'>
//                             <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
//                         </div>
//                         <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
//                         <p className='text-gray-600 text-sm'>{item.speciality}</p>
//                     </div>
                    
//                 </div>
//             ))}
//         </div>
//         <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='bg-blue-50 text-gray-000 px-12 py-3 rounded-full mt-10'>more</button>
//     </div>
//   )
// }

// export default TopDoctors