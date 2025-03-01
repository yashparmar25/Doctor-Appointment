// import express from 'express'
// import { doctorList } from '../controllers/doctorController.js'

// const doctorRouter = express.Router()

// doctorRouter.get('/list',doctorList)

// export default doctorRouter
import express from 'express';
import { doctorList } from '../controllers/doctorController.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList); // Ensure the route is defined correctly

export default doctorRouter;
