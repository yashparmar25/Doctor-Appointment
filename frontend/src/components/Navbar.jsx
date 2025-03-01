import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../index.css';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { token, setToken, userData } = useContext(AppContext);

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm bg-white">
            {/* Logo */}
            <div className="flex items-center gap-12">
                <img
                    onClick={() => navigate('/')}
                    className="w-36 cursor-pointer mr-20"
                    src={assets.logo}
                    alt="Logo"
                />

                {/* Desktop Nav Links */}
                <nav className="ml-10 pl-20 items-center hidden md:flex gap-8 text-gray-600 font-semibold text-base">
                    {["Home", "All Doctors", "About", "Contact"].map((item, index) => (
                        <NavLink
                            key={index}
                            to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-blue-500 border-b-2 border-blue-500 pb-1 transition-all'
                                    : 'hover:text-blue-500 transition-all'
                            }
                        >
                            {item}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Profile or Create Account */}
            <div className="flex items-center gap-4">
                {token && userData ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img className="w-8 rounded-full" src={userData.image} alt="Profile" />
                        <img className="w-3" src={assets.dropdown_icon} alt="Dropdown Icon" />
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-2 p-4 shadow-lg">
                                <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">
                                    My Profile
                                </p>
                                <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">
                                    My Appointment
                                </p>
                                <p onClick={logout} className="hover:text-black cursor-pointer">
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all font-medium"
                    >
                        Create Account
                    </button>
                )}

                {/* Mobile Menu Icon */}
                <img onClick={() => setShowMenu(true)} className="w-6 md:hidden cursor-pointer" src={assets.menu_icon} alt="Menu Icon" />
            </div>

            {/* Mobile Menu */}
            {showMenu && (
                <>
                    <div className="fixed top-0 right-0 w-[75%] h-full bg-white z-50 shadow-lg transition-transform duration-300">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <img className="w-36" src={assets.logo} alt="Logo" />
                            <img onClick={() => setShowMenu(false)} className="w-6 cursor-pointer" src={assets.cross_icon} alt="Close Icon" />
                        </div>
                        <ul className="flex flex-col items-center gap-6 text-lg font-medium text-gray-600 mt-8">
                            {["Home", "All Doctors", "About", "Contact"].map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.toLowerCase().replace(" ", "-")}
                                    onClick={() => setShowMenu(false)}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'text-indigo-500 border-b-2 border-blue-500 pb-1 transition-all'
                                            : 'hover:text-blue-500 transition-all'
                                    }
                                >
                                    {item}
                                </NavLink>
                            ))}
                        </ul>
                    </div>
                    <div onClick={() => setShowMenu(false)} className="fixed inset-0 bg-black bg-opacity-40 z-40"></div>
                </>
            )}
        </div>
    );
};

export default Navbar;


// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets';

// import '../index.css';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const [showMenu, setshowMenu] = useState(false);
//     const [token, setToken] = useState(true);

//     return (
//         <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 shadow-sm bg-white">
//             {/* Logo and NavLinks in One Horizontal Line */}
//             <div className="flex items-center gap-12">
//                 <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />
//                 <nav className="flex gap-8 text-gray-600 font-semibold text-base ml-44">
//                     <NavLink
//                         to="/"
//                         className={({ isActive }) => isActive
//                             ? 'text-blue-500 border-b-2 border-blue-500 pb-1 transition-all'
//                             : 'hover:text-blue-500 transition-all'
//                         }
//                     >
//                         Home
//                     </NavLink>
//                     <NavLink
//                         to="/doctors"
//                         className={({ isActive }) => isActive
//                             ? 'text-blue-500 border-b-2 border-blue-500 pb-1 transition-all'
//                             : 'hover:text-blue-500 transition-all'
//                         }
//                     >
//                         All Doctors
//                     </NavLink>
//                     <NavLink
//                         to="/about"
//                         className={({ isActive }) => isActive
//                             ? 'text-blue-500 border-b-2 border-blue-500 pb-1 transition-all'
//                             : 'hover:text-blue-500 transition-all'
//                         }
//                     >
//                         About
//                     </NavLink>
//                     <NavLink
//                         to="/contact"
//                         className={({ isActive }) => isActive
//                             ? 'text-blue-500 border-b-2 border-blue-500 pb-1 transition-all'
//                             : 'hover:text-blue-500 transition-all'
//                         }
//                     >
//                         Contact
//                     </NavLink>
//                 </nav>
//             </div>

//             <div>
//                 {
//                     token
//                         ? <div className='flex item-center gap-2 cursor-pointer group relative'>
//                             <img className='w-8 rounded-full' src={assets.profile_pic} />
//                             <img className='w-3' src={assets.dropdown_icon} />
//                             <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
//                                 <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-2 p-4 '>
//                                     <p onClick={() => { navigate('/my-profile') }} className='hover:text-black cursor-pointer'>My Profile</p>
//                                     <p onClick={() => { navigate('/my-appointments') }} className='hover:text-black cursor-pointer'>My Appointment</p>
//                                     <p onClick={() => { setToken(false) }} className='hover:text-black cursor-pointer'>Logout</p>
//                                 </div>
//                             </div>
//                         </div>
//                         : <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all font-medium">
//                             Create Account
//                         </button>
//                 }
//                 <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
//                 {/* -----------mobile menui------------- */}
//                 <div className={`${showMenu? 'fixed w-full': 'h-0 w-0'} md:hidden right-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>

//                     <div>
//                         <img src={assets.logo} alt="" />
//                         <img onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
//                     </div>
//                     <ul>
//                         <NavLink>HOME</NavLink>
//                         <NavLink>ALL DOCTORS</NavLink>
//                         <NavLink>ABOUT</NavLink>
//                         <NavLink>CONTACT</NavLink>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Navbar;
