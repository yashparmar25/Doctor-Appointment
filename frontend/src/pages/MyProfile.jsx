import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyProfile = () => {
    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('dob', userData.dob);
            formData.append('gender', userData.gender);

            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
                headers: { token },
            });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Axios Error:", error?.response?.data || error.message);
            toast.error(error?.response?.data?.message || "Error updating user profile");
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="max-w-lg mx-auto flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg">
            {/* Profile Image */}
            <div className="flex justify-center">
                {isEdit ? (
                    <label htmlFor="image" className="cursor-pointer">
                        <div className="relative">
                            <img
                                className="w-36 h-36 rounded-full object-cover opacity-75"
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt="Profile"
                            />
                            <img className="w-10 absolute bottom-0 right-0 p-2 bg-white rounded-full" src={assets.upload_icon} alt="Upload" />
                        </div>
                        <input
                            onChange={(e) => setImage(e.target.files[0])}
                            type="file"
                            id="image"
                            hidden
                        />
                    </label>
                ) : (
                    <img className="w-36 h-36 rounded-full object-cover" src={userData?.image || assets.defaultProfile} alt="Profile" />
                )}
            </div>

            {/* Name */}
            {isEdit ? (
                <input
                    className="w-full bg-gray-50 text-3xl font-medium mt-4 p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                />
            ) : (
                <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
            )}

            <hr className="bg-zinc-400 h-[1px] border-none" />

            {/* Contact Information */}
            <div>
                <p className="text-neutral-500 text-lg font-semibold mt-3">Contact Information</p>
                <div className="grid grid-cols-[1fr_3fr] gap-4 mt-3 text-neutral-700">
                    <p className="font-medium">Email:</p>
                    <p className="text-blue-500">{userData.email}</p>

                    <p className="font-medium">Phone:</p>
                    {isEdit ? (
                        <input
                            className="bg-gray-100 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            value={userData.phone}
                            onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                    ) : (
                        <p className="text-blue-400">{userData.phone}</p>
                    )}

                    <p className="font-medium">Address:</p>
                    {isEdit ? (
                        <div>
                            <input
                                className="bg-gray-50 p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full mb-2"
                                type="text"
                                value={userData.address?.line1 || ''}
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        address: { ...(prev.address || {}), line1: e.target.value },
                                    }))
                                }
                            />
                            <input
                                className="bg-gray-50 p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                                type="text"
                                value={userData.address?.line2 || ''}
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        address: { ...(prev.address || {}), line2: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            {userData.address?.line1} <br />
                            {userData.address?.line2}
                        </p>
                    )}
                </div>
            </div>

            {/* Basic Information */}
            <div>
                <p className="text-neutral-500 text-lg font-semibold mt-3">Basic Information</p>
                <div className="grid grid-cols-[1fr_3fr] gap-4 mt-3 text-neutral-700">
                    <p className="font-medium">Gender:</p>
                    {isEdit ? (
                        <select
                            className="p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={userData.gender}
                            onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className="text-gray-400">{userData.gender}</p>
                    )}

                    <p className="font-medium">Birthday:</p>
                    {isEdit ? (
                        <input
                            className="p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="date"
                            value={userData.dob}
                            onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                        />
                    ) : (
                        <p className="text-gray-400">{userData.dob}</p>
                    )}
                </div>
            </div>

            {/* Save / Edit Button */}
            <div className="mt-8">
                {isEdit ? (
                    <button
                        className="w-full py-3 text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition-all"
                        onClick={updateUserProfileData}
                    >
                        Save Changes
                    </button>
                ) : (
                    <button
                        className="w-full py-3 text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition-all"
                        onClick={() => setIsEdit(true)}
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default MyProfile;
