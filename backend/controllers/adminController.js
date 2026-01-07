import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file; // Uploaded file

        // Checking for all required data
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password length
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imageUrl = "";
        if (imageFile) {
            // Upload file to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "doctors" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(imageFile.buffer); // Pass file buffer
            });

            imageUrl = uploadResult.secure_url;
        }

        // Construct and save doctor
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.json({ success: true, message: "Doctor Added Successfully!" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Invalid credentials" });
    }
};

// api to get all doctor
 const allDoctors = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
 }

 const appointmentsAdmin = async (req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
 }
 //api for appointment cancel
 const appointmentCancel = async (req, res) => {
    try {
        const {appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
       
        await appointmentModel.findByIdAndDelete(appointmentId, { cancelled: true });
        //release doctos slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        return res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}
//api to get dashboard for admin panel
const adminDashboard = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({success:true,dashData})

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}



export { addDoctor, loginAdmin,allDoctors,appointmentsAdmin, appointmentCancel,adminDashboard };
