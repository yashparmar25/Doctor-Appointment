import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import appointmentModel from "../models/appointmentModel.js";

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
        const doctors = await doctorModel.find(); // ✅ Fetch all doctors
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
const loginDoctor = async (req,res)=>{
    try {
        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:"Invalid email or password"})
        }
        const isMatch = await bcrypt.compare(password,doctor.password)
        if(isMatch){
            
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,message:"Logged in successfully",token})
        }
        else{
            res.json({success:false,message:"invalid credential",token})

        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to get doctor appointment for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const {docId} = req.body // ✅ Extract from token (since authDoctor middleware decodes it)
        const appointments = await appointmentModel.find({ docId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api for mark appointment isCompleted
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        // Fetch the appointment data
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (String(appointmentData.docId) === String(docId)) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: "Appointment completed" });
        } else {
            return res.status(403).json({ success: false, message: "Marking failed, unauthorized access" });
        }
    } catch (error) {
        console.error("Error in appointmentComplete:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// API for canceling an appointment for the doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        // Fetch the appointment data
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (String(appointmentData.docId) === String(docId)) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: "Appointment cancelled" });
        } else {
            return res.status(403).json({ success: false, message: "Cancellation failed, unauthorized access" });
        }
    } catch (error) {
        console.error("Error in appointmentCancel:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
//api to get dashboard dat for doctor panel
const doctorDashboard = async (req,res)=>{
    try {
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})
        let earning = 0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earning += item.amount
            }
        })
        let patients = []
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })
        const dashData = {
            earning,
            patients: patients.length,
            appointments: appointments.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }
        return res.json({success:true,dashData})

    } catch (error) {
        console.error("Error in appointmentCancel:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
//api to get doctor profile for doctor panelo

const doctorProfile = async(req,res) =>{
    try {
        const {docId} = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({success:true,profileData})
    } catch (error) {
        console.error("Error in appointmentCancel:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
//api to upadate doctor data for doctor panel
const updateDoctorProfile = async(req,res)=>{
    try {
        const {docId,fees,address,available} = req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:'Profile Updated'})


    } catch (error) {
        console.error("Error in appointmentCancel:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export { changeAvailablity, doctorList,loginDoctor,appointmentsDoctor, appointmentCancel,appointmentComplete, doctorDashboard,doctorProfile,updateDoctorProfile }