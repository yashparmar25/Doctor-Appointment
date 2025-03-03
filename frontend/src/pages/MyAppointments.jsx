import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([])
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const slotDateFormate = (dateString) => {
        if (!dateString) return "Invalid Date";
        const [day, month, year] = dateString.split('-'); // Assuming "DD-MM-YYYY" format
        return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    };



    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + `/api/user/appointments`, { headers: { token } });

            if (data.success) {
                setAppointments(data.appointments.reverse());
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error(error.message)
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + `/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error(error.message)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: 'Payment for appointment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response);
                try {
                    const { data } = await axios.post(backendUrl + `/api/user/verifyRazorpay`, response, { headers: { token } });
                    if (data.success) {
                        toast.success(data.message);
                        getUserAppointments();
                        navigate('/my-appointments');
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message)

                }
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + `/api/user/payment-razorpay`, { appointmentId }, { headers: { token } });
            if (data.success) {
                initPay(data.order);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
            <div>
                {
                    appointments.slice(0, 10).map((item, index) => (
                        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                            <div>
                                <img className='w-32 bg-indigo-100' src={item.docData.image} alt="" />
                            </div>
                            <div className='flex-1 text-sm text-zinc-600'>
                                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                                <p>{item.docData.speciality}</p>
                                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                                <p className='text-xs'>{item.docData.address.line1}</p>
                                <p className='text-xs'>{item.docData.address.line2}</p>
                                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>{slotDateFormate(item.slotDate)} | {item.slotTime}</p>
                            </div>
                            <div></div>
                            <div className='flex flex-col gap-2 justify-end'>
                                {item.payment ? (
                                    <button className="sm:min-w-48 py-2 border rounded text-black bg-green-500">Paid</button>
                                ) : (
                                    <button
                                        onClick={() => appointmentRazorpay(item._id)}
                                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-indigo-500 hover:text-white transition-all duration-300"
                                    >
                                        Pay Online
                                    </button>
                                )}


                                <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-cneter sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancle appointment</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default MyAppointments; 