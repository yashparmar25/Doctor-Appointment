import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';

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


export { registerUser, loginUser, getProfile, updateProfile };
