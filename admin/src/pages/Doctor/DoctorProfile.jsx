import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, getProfileData, profileData, setProfileData,backendUrl } = useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async ()=>{
    try {
      const updateData = {
        address:profileData.address,
        fees:profileData.fees,
        available:profileData.available
      }
      const {data} = await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{dToken}})
      if(data.success){
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
        console.log(error);
        
    }
  }

  useEffect(() => {
    getProfileData();
  }, [dToken]);

  // Parse Address
  let addressObj = profileData.address ? JSON.parse(profileData.address) : { line1: "", line2: "" };

  return (
    profileData && (
      <div className="max-w-3xl ml-8 bg-white p-6 rounded-xl shadow-lg mt-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profileData.image}
            alt="Doctor"
            className="w-32 h-32 rounded-full shadow-md object-cover bg-indigo-500"
          />

          <div className="text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{profileData.name}</h2>
            <p className="text-gray-500">
              {profileData.degree} - {profileData.speciality}
            </p>
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded mt-2">
              {profileData.experience} Experience
            </span>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800">About</h3>
          <p className="text-gray-600 mt-2">{profileData.about || "No details provided."}</p>
        </div>

        {/* Appointment Fee */}
        <div className="mt-4">
          <p className="text-gray-800 font-medium">
            Appointment Fee:{" "}
            <span className="text-green-600 font-semibold">
              {isEdit ? (
                <input
                  type="number"
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, fees: e.target.value }))
                  }
                  value={profileData.fees}
                  className="border p-1 rounded"
                />
              ) : (
                `₹ ${profileData.fees}`
              )}
            </span>
          </p>
        </div>

        {/* Address Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
          <p className="text-gray-600">
            {isEdit ? (
              <input
                type="text"
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: JSON.stringify({ ...addressObj, line1: e.target.value }),
                  }))
                }
                value={addressObj.line1}
                className="border p-1 rounded"
              />
            ) : (
              addressObj.line1
            )}
            <br />
            {isEdit ? (
              <input
                type="text"
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: JSON.stringify({ ...addressObj, line2: e.target.value }),
                  }))
                }
                value={addressObj.line2}
                className="border p-1 rounded"
              />
            ) : (
              addressObj.line2
            )}
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="mt-6 flex items-center gap-3">
          <input
            onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
            checked={profileData.available}
            type="checkbox"
            className="w-5 h-5 text-blue-600 cursor-pointer"
          />
          <label className="text-gray-700 text-sm font-medium">Available</label>
        </div>

        {/* Edit Button */}
        <div className="mt-6">

          {
            isEdit
              ? <button
                onClick={updateProfile}
                className="bg-white text-indigo-500 px-5 py-2 rounded-full font-semibold shadow-md hover:bg-indigo-500 hover:text-white transition"
              >
                Save Profile
              </button>
              : <button
                onClick={() => setIsEdit(true)}
                className="bg-white text-indigo-500 px-5 py-2 rounded-full font-semibold shadow-md hover:bg-indigo-500 hover:text-white transition"
              >
                Edit Profile
              </button>
          }


        </div>
      </div>
    )
  );
};

export default DoctorProfile;
