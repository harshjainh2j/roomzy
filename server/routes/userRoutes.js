import express from 'express'
import { cancelBooking, createUser, getAllBookings } from '../controllers/userControllers.js';
import { bookVisit } from '../controllers/userControllers.js';
const router= express.Router();

router.post("/register",createUser);
router.post("/bookVisit/:id",bookVisit);
router.post("/allBookings",getAllBookings);
router.post("/cancelBooking/:id",cancelBooking)
export {router as userRoute}