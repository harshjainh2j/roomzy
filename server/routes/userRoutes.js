import express from 'express'
import { cancelBooking, createUser, getAllBookings, getAllFav, toFav } from '../controllers/userControllers.js';
import { bookVisit } from '../controllers/userControllers.js';
const router= express.Router();

router.post("/register",createUser);
router.post("/bookVisit/:id",bookVisit);
router.post("/allBookings",getAllBookings);
router.post("/cancelBooking/:id",cancelBooking)
router.post("/toFav/:rid",toFav)
router.post("/allFav/",getAllFav)
export {router as userRoute}