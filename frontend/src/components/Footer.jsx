import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ----------left--------- */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                </div>
                {/* ----------center-------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                {/* ---------right---------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91 9265195877</li>
                        <li>yashparmar2055@gmail.com</li>
                    </ul>
                </div>
                {/* ---------copyright--------- */}
                <div className="col-span-3">
                    <div className="w-full border-t border-gray-300 mt-10">
                        <p className="w-full py-5 text-sm text-center text-gray-600">
                            Copyright 2025 @ PresScripto - All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
