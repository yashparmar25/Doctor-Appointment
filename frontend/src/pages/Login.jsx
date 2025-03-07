import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { backendUrl, token, setToken } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const trimmedEmail = email.trim().toLowerCase(); // Convert email to lowercase

            if (state === 'Sign Up') {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, { 
                    name: name.trim(), 
                    email: trimmedEmail, 
                    password 
                });

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    toast.success("Registration successful!");
                    navigate('/home');  // Redirect after signup
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { 
                    email: trimmedEmail, 
                    password 
                });

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    toast.success("Login successful!");
                    navigate('/home');  // Redirect after login
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
                <p className="text-2xl font-semibold">
                    {state === 'Sign Up' ? 'Create Account' : 'Login'}
                </p>
                <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>

                {state === 'Sign Up' && (
                    <div className="w-full">
                        <p>Full Name</p>
                        <input
                            className="border border-zinc-300 rounded w-full p-2 mt-1"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <p>Email</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>

                <button type="submit" className="bg-indigo-500 text-white w-full py-2 rounded-md text-base">
                    {state === 'Sign Up' ? 'Create Account' : 'Login'}
                </button>

                {state === 'Sign Up' ? (
                    <p>
                        Already have an account?{' '}
                        <span onClick={() => setState('Login')} className="text-indigo-500 underline cursor-pointer">
                            Login here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create a new account?{' '}
                        <span onClick={() => setState('Sign Up')} className="text-indigo-500 underline cursor-pointer">
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;



// import React, { useState } from 'react';

// const Login = () => {

//     const [state,setState] =useState('Sign Up')

//     const [email,setEmail] =useState('')
//     const [password,setPassword] = useState('')
//     const [name,setName] = useState('')

//     const onSubmitHandler = async (event) => {
//         event.preventDefult()
//     }
    
//     return (
//         <form className='min-h-[80vh] flex items-center'>
//             <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
//                 <p className='text-2xl font-semibold'>{state == 'Sign Up' ?"Create Account": "Login" }</p>
//                 <p>Please {state == 'Sign Up' ?"sign up": "log in" } to book appointment</p>
//                 {
//                     state === "Sign Up" && <div className='w-full'>
//                     <p>Full Name</p>
//                     <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.name)} value={name} required/>
//                 </div>
//                 }
                
//                 <div>
//                     <p className='w-full'>Email</p>
//                     <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e)=>setEmail(e.target.name)} value={name} required/>
//                 </div>
//                 <div>
//                     <p className='w-full'>Password</p>
//                     <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e)=>setPassword(e.target.name)} value={name} required/>
//                 </div>
//                 <button className='bg-indigo-500 text-white w-full py-2 rounded-md text-base'>{state == 'Sign Up' ?"Create Account": "Login" }</button>
//                 {
//                     state === "Sign Up"
//                     ?   <p>Already have an account? <span onClick={()=> setState('Login')} className='text-indigo-500 underline cursor-pointer'>Login here</span></p> 
//                     :   <p>Create an new account? <span onClick={()=> setState('Sign Up')} className='text-indigo-500 underline cursor-pointer'>click here</span></p>
//                 }
//             </div>
//         </form>
//     );
// };

// export default Login; 