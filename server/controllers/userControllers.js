import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

// create user

export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");
  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const User = await prisma.user.create({ data: req.body });
    res.send({
      message: "User created successfully",
      User: User,
    });
  } else res.status(201).send({ message: "User already Registered" });
});

// book visit

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    })
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res.status(400).json({ message: "Visit already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: {push: { id, date }}
        }
      })
    }
    res.send("Visit booked successfully");
  } catch (error) {
    throw new Error(error.message);
  }
});

// get all bookings

export const getAllBookings=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    try{
    const bookings= await prisma.user.findUnique({
        where:{email},
        select:{bookedVisits:true}
    })
    res.status(200).send(bookings)
    }catch(error){
        throw new  Error(error.message);
    }
})

// cancel booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });

    // If the user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the visit by comparing ObjectId to String
    const index = user.bookedVisits.findIndex(
      (visit) => String(visit.id) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({ message: "Visit not found" }); // Added return to prevent further execution
    }

    // Remove the visit from the array
    user.bookedVisits.splice(index, 1);

    await prisma.user.update({
      where: { email: email },
      data: {
        bookedVisits: user.bookedVisits,
      },
    });

    return res.send("Booking cancelled successfully"); // Added return here as well

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;
  
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Check if the residence ID is already in the user's favorites
    if (user.favResidenciesId.includes(rid)) {
      // Remove the residence ID if it exists
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesId: {
            set: user.favResidenciesId.filter((id) => id !== rid), // Correct way to filter and update
          }
        }
      });
      res.send({ message: "removed from fav", user: updateUser });
    } else {
      // Add the residence ID if it doesn't exist
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesId: {
            push: rid, // Use `set` with the updated array
          }
        }
      });
      res.send({ message: "added to favourites", user: updateUser });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getAllFav=asyncHandler(async(req,res)=>{
const {email}=req.body;
try {
  const favResendencies=await prisma.user.findUnique({
    where:{email},
    select:{favResidenciesId:true}
  })
} catch (error) {
  throw new Error(error.message);
}
})