import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },  // Fix: Changed from "sloteDate" to "slotDate"
    slotTime: { type: String, required: true },  // Fix: Changed from "sloteTime" to "slotTime"
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
});

const appointmentModel = mongoose.model.appointment || mongoose.model('appointment', appointmentSchema);

export default appointmentModel;