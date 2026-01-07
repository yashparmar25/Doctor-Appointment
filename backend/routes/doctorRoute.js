import express from 'express';
import { doctorList, loginDoctor,appointmentsDoctor,appointmentCancel,appointmentComplete, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js'

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);

doctorRouter.get('/me', authDoctor, doctorProfile);
doctorRouter.post('/me', authDoctor, upload.single('image'), updateDoctorProfile);

doctorRouter.get('/appointments',authDoctor, appointmentsDoctor);
doctorRouter.post('/complete-appointment',authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment',authDoctor, appointmentCancel);



export default doctorRouter;
