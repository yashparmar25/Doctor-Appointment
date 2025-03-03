import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";


// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hashedPassword });

        // ✅ Ensure save() completes before proceeding
        await newUser.save();

        // ✅ Fetch user again to ensure it's saved
        const savedUser = await userModel.findOne({ email });

        if (!savedUser) {
            return res.status(500).json({ success: false, message: "Error saving user. Please try again." });
        }

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(201).json({ success: true, token, message: "User registered successfully!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.json({ success: true, token, userId: user._id, message: "Login successful!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


//app to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

        const user = await userModel.findById(userId).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


// api to upadte user profile 

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!userId || !name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data is missing" });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });

        if (imageFile) {
            // Convert buffer to a Cloudinary upload
            const imageUpload = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(imageFile.buffer); // Send buffer as stream
            });

            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

        return res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
};

//api to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;



        // Fetch doctor details
        const docData = await doctorModel.findById(docId).select("-password");


        if (!docData.available) {
            return res.status(400).json({ success: false, message: "Doctor is not available" });
        }

        // Initialize `slots_booked` if undefined
        let slots_booked = docData.slots_booked;

        // Check if slot is already booked
        if (slots_booked[slotDate]?.includes(slotTime)) {
            return res.json({ success: false, message: "Slot already booked" });
        }

        // Add new slot
        if (!slots_booked[slotDate]) slots_booked[slotDate] = [];
        slots_booked[slotDate].push(slotTime);

        // Fetch user details
        const userData = await userModel.findById(userId).select("-password");
        delete docData.slots_booked; // Remove slots_booked from doctor data


        // Save appointment
        const appointmentData = new appointmentModel({
            userId,
            docId,
            slotDate,
            slotTime,
            userData,
            docData,
            amount: docData.fees,
            date: Date.now(),
        });

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        return res.status(200).json({ success: true, message: "Appointment booked successfully" });
    } catch (error) {
        console.error("Error booking appointment:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// api to get user appointment

const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body; // Ensure userId is received properly

        const appointments = await appointmentModel.find({ userId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}
//api to cancle appointment

const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        //verify data
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized access" });
        }
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

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment with Razorpay
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Fetch appointment details
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.status(400).json({ success: false, message: "Invalid appointment" });
        }

        // Creating payment options for Razorpay
        const options = {
            amount: appointmentData.amount * 100, // Convert to smallest currency unit
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId,
        };

        // Creating order in Razorpay
        const order = await razorpayInstance.orders.create(options);

        res.json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

//api to verify payment
const verifyRazorpay = async (req, res) => {
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            return res.json({ success: true, message: "Payment successful" });
        }
        else{
            return res.json({ success: false, message: "Payment failed" });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error, please try"})
        
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment,paymentRazorpay,verifyRazorpay };
