import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors.jsx'

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencysymbol } = useContext(AppContext);
    const dayOfWeeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    // ✅ Fetch doctor info
    const fetchDocInfo = () => {
        const docInfo = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfo);
    };

    // ✅ Generate available slots
    const getAvailableSlots = () => {
        let today = new Date();
        let slots = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0); // End at 9:00 PM

            // ✅ Adjust hours only for the first day (today)
            if (i === 0) {
                const now = new Date();
                currentDate.setHours(Math.max(now.getHours() + (now.getMinutes() > 30 ? 1 : 0), 10));
                currentDate.setMinutes(now.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10, 0, 0, 0); // Start at 10:00 AM
            }

            let timeSlots = [];
            while (currentDate < endTime) {
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                });
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            // ✅ Push only if slots are available
            if (timeSlots.length > 0) slots.push(timeSlots);
        }

        setDocSlots(slots);
    };

    // ✅ UseEffect for doctor info
    useEffect(() => {
        if (doctors.length > 0 && docId) {
            fetchDocInfo();
        }
    }, [doctors, docId]);

    // ✅ UseEffect for slots
    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    // ✅ Debugging slots
    useEffect(() => {
        console.log(docSlots);
    }, [docSlots]);

    return (
        docInfo && (
            <div className="">
                {/* ------------ Doctor Details ----------- */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                        <img className="bg-indigo-500 w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
                    </div>
                    <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                        {/* ------------ Doctor Info ---------- */}
                        <p className="flex items-center gap-2 text-2xl text-gray-900 font-medium">
                            {docInfo.name}
                            <img className="w-5" src={assets.verified_icon} alt="" />
                        </p>
                        <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                            <p>
                                {docInfo.degree} - {docInfo.speciality}
                            </p>
                            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
                        </div>
                        {/* ------------ Doctor About --------- */}
                        <div>
                            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                                About <img className="w-3" src={assets.info_icon} alt="" />
                            </p>
                            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                        </div>
                        <p className="text-gray-500 font-medium mt-4">
                            Appointment fee: <span className="text-gray-600">{currencysymbol} {docInfo.fees}</span>
                        </p>
                    </div>
                </div>

                {/* ------------ Booking Slots ------- */}
                <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                    <p>Booking Slots</p>
                    <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                        {docSlots.length > 0 &&
                            docSlots.map((item, index) => (
                                <div
                                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-indigo-500 text-white' : 'border border-gray-200 text-black'
                                        }`}
                                    key={index}
                                    onClick={() => {
                                        setSlotIndex(index);
                                        setSlotTime(item[0]?.time || '');
                                    }}
                                >
                                    <p>{item[0]?.datetime && dayOfWeeks[new Date(item[0].datetime).getDay()]}</p>
                                    <p>{item[0]?.datetime && new Date(item[0].datetime).getDate()}</p>
                                </div>
                            ))}
                    </div>
                    <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                        {docSlots.length && docSlots[slotIndex].map((item, index) => (
                            <p onClick={() => {
                                setSlotTime(item.time);

                            }} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-indigo-500 text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                                {item.time.toLowerCase()}
                            </p>
                        ))}
                    </div>
                    <button className="bg-gradient-to-l from-indigo-500 to-purple-600 text-white text-sm font-medium px-16 py-3 rounded-full my-6 hover:scale-105 hover:shadow-lg transition-transform duration-300 shadow-md">
                        Book an Appointment
                    </button>
                </div>
                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

            </div>
        )
    );
};

export default Appointment;
