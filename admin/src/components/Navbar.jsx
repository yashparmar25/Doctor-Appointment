// import React, { useContext } from 'react'
// import PropTypes from 'prop-types'
// import { assets } from '../assets/assets'
// import { AdminContext } from '../context/AdminContext'
// import {useNavigate} from 'react-router-dom'
// import { DoctorContext } from '../context/DoctorContext'


// const Navbar = () => {
//     const { aToken, setAToken } = useContext(AdminContext)
//     const {dToken,setDtoken} = useContext(DoctorContext)
//     const navigate = useNavigate()

//     const logout = () => {
//         navigate('/')
//         if (aToken && setAToken) {
//             setAToken('')
//             localStorage.removeItem('aToken')
//         }
//         if(dToken && setDtoken){
//             navigate('/')
//             setDtoken('')
//             localStorage.removeItem('dToken')
//         }
//     }

//     return (
//         <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
//             <div className='flex items-center gap-2 text-xs'>
//                 <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="Logo" />
//                 <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'> 
//                     {aToken ? 'Admin' : 'Doctor'}
//                 </p>
//             </div>
//             <button onClick={logout} className='bg-primary text-white text-sm px-10 py-3 rounded-full'>Logout</button>
//         </div>
//     )
// }



// export default Navbar
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDtoken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
        setAToken && setAToken('')
        setDtoken && setDtoken('')
        localStorage.removeItem('aToken')
        localStorage.removeItem('dToken')
        navigate('/login')
    }

    const userRole = aToken ? 'Admin' : 'Doctor'

    return (
        <div className='flex justify-between items-center px-5 sm:px-10 py-3 border-b bg-white shadow-sm'>
            {/* Left Side - Logo & Role */}
            <div className='flex items-center gap-3 text-xs sm:text-sm'>
                <img className='w-36 sm:w-44 cursor-pointer' src={assets.admin_logo} alt="Logo" />
                <p className='border px-3 py-1 rounded-full text-gray-700 font-medium border-gray-400 shadow-sm'> 
                    {userRole}
                </p>
            </div>

            {/* Logout Button */}
            <button 
                onClick={logout} 
                className='bg-indigo-500 hover:bg-indigo-700 text-white text-sm px-6 py-2 rounded-full transition-all duration-300 shadow-md'
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar
