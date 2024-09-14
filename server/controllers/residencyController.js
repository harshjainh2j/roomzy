import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

export const createResidency = asyncHandler(async (req, res) => {
    const { title, description, price, address, country, city, facilities, image, userEmail } = req.body.data;

    console.log(req.body.data);

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return res.status(400).send({ message: "User with this email does not exist" });
        }

        // Create Residency if the user exists
        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                city,
                country,
                image,
                facilities,
                owner: { connect: { email: userEmail } }, // Connect to the existing user
            },
        });

        res.status(201).send({ message: "Residency created successfully", residency });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).send({ message: "A residency with this address already exists" });
        }
        res.status(500).send({ message: error.message });
    }
});

export const getAllResidencies = asyncHandler(async (req, res) => {
    try{
    const residencies=await prisma.residency.findMany(
       {
        orderBy:{
            createdAt:"desc"
        }
       }
    );

    res.send(residencies)
    }
    catch{
    if (error.code === 'P2002') {
        return res.status(400).send({ message: "A residency with this address already exists" });
    }
    res.status(500).send({ message: error.message });
    }
})

export const getResidency=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const residency = await prisma.residency.findUnique({
            where: { id },
        });
        res.send(residency)
    }
    catch(error){
        throw new  Error(error.message);
    }
})
