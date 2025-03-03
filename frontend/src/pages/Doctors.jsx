import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
    const navigate = useNavigate();
    const { speciality } = useParams();
    const [filterDoc, setFilterDoc] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const { doctors } = useContext(AppContext);

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
        } else {
            setFilterDoc(doctors);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality]);

    return (
        <div>
            <p className='text-gray-600'>Browse through doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                {/* Toggle Filter Button for Small Screens */}
                <button 
                    className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-indigo-500 text-white' : ''}`} 
                    onClick={() => setShowFilter(prev => !prev)}
                >
                    Filters
                </button>

                {/* Sidebar Filters */}
                <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map((spec) => (
                        <p 
                            key={spec} 
                            onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)} 
                            className={`w-[200px] pl-3 py-1.5 border border-gray-300 rounded transition-all cursor-pointer ${speciality === spec ? "bg-indigo-100 text-black" : ""}`}
                        >
                            {spec}
                        </p>
                    ))}
                </div>

                {/* Doctors List */}
                <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                    {filterDoc.map((doctor) => (
                        <div 
                            key={doctor._id} 
                            onClick={() => navigate(`/appointment/${doctor._id}`)} 
                            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        >
                            <img className='bg-blue-50' src={doctor.image} alt={doctor.name} />
                            <div className='p-4'>
                                {/* Availability Indicator */}
                                <div className='flex items-center gap-2 text-sm'>
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
            </div>
        </div>
    );
};

export default Doctors;

