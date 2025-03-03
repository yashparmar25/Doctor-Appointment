import doctorModel from "../models/doctorModel.js";

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
export { changeAvailablity, doctorList }