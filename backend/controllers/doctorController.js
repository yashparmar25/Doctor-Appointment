import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary';

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            docId,
            { $set: { available: !docData.available } }, // Explicitly setting the value
            { new: true, runValidators: true } // Ensures updated document is returned & validation runs
        );
        

        res.json({ success: true, message: 'Availability changed', doctor: updatedDoctor });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find(); // 
        if (doctors.length === 0) {
            return res.json({ success: false, message: "No doctors found" }); // ❌ If empty, return error
        }
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
//api for doctor login
const loginDoctor = async (req, res) => {
    try {
        const {email, password} = req.body;
        const doctor = await doctorModel.findOne({email});

        if(!doctor){
            return res.json({success: false, message: "Doctor not found"});
        }
        const isMatch = await bcrypt.compare(password, doctor.password);

        if(isMatch){
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET);
            return res.json({success: true, message: "Doctor logged in successfully", token});
        }else{
            return res.json({success: false, message: "Invalid credentials"});
        }


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get logged-in doctor profile
const doctorProfile = async (req, res) => {
    try {
        const docId = req.body.docId || req.docId;
        if (!docId) return res.status(400).json({success:false,message:'Doctor ID missing'});

        const doctor = await doctorModel.findById(docId).select('-password');
        if (!doctor) return res.status(404).json({success:false,message:'Doctor not found'});

        return res.json({success:true, doctor});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false,message:error.message});
    }
}

// Update logged-in doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.body.docId || req.docId;
        if (!docId) return res.status(400).json({success:false,message:'Doctor ID missing'});

        const { name, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        const updatePayload = {};
        if (name) updatePayload.name = name;
        if (speciality) updatePayload.speciality = speciality;
        if (degree) updatePayload.degree = degree;
        if (experience) updatePayload.experience = experience;
        if (about) updatePayload.about = about;
        if (fees !== undefined) updatePayload.fees = fees;
        if (address) {
            try {
                updatePayload.address = typeof address === 'string' ? JSON.parse(address) : address;
            } catch {
                updatePayload.address = address;
            }
        }

        if (imageFile) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'doctors' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(imageFile.buffer);
            });
            updatePayload.image = uploadResult.secure_url;
        }

        const updated = await doctorModel.findByIdAndUpdate(docId, updatePayload, { new: true }).select('-password');
        return res.json({success:true, message:'Profile updated', doctor: updated});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false,message:error.message});
    }
}

//api for doctor appointment for doactor pannel
const appointmentsDoctor = async (req, res) => {
    try {
        // Prefer id injected by auth middleware; fallback to body/query for flexibility
        const docId = req.body.docId || req.query.docId || req.docId;
        if (!docId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required" });
        }

        const appointments = await appointmentModel.find({ docId });

        res.json({ success: true, appointments });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//api for mark appointment completed for doctor panel
const appointmentComplete = async (req,res) =>{
    try {
        const docId = req.body.docId || req.docId;
        const {appointmentId} = req.body;

        if (!appointmentId) {
            return res.json({success:false,message:'Appointment ID required'});
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if(appointmentData && String(appointmentData.docId) === String(docId)){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});

            return res.json({success:true,message:'Appointment Completed'});
        }
        else{
            return res.json({success:false,message:'Mark Failed'});
        }

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: error.message });
 
    }
} 

//api for Cancel appointment  for doctor panel
const appointmentCancel = async (req,res) =>{
    try {
        const docId = req.body.docId || req.docId;
        const {appointmentId} = req.body;

        if (!appointmentId) {
            return res.json({success:false,message:'Appointment ID required'});
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if(appointmentData && String(appointmentData.docId) === String(docId)){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});

            return res.json({success:true,message:'Appointment Canceled'});
        }
        else{
            return res.json({success:false,message:'Cancellation Failed'});
        }

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: error.message });
 
    }
} 



export { changeAvailablity, doctorList, loginDoctor, doctorProfile, updateDoctorProfile, appointmentsDoctor,appointmentCancel,appointmentComplete }