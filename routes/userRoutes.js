import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
//  USER REGISTRATION ROUTE
// Endpoint: POST /api/users/register
router.post("/register",async(req,res)=>{
    try{
        //Extract user credentials from the incoming request body
        const{username, email, password} = req.body;

        // to ensure all fields were provided
        if(!username || !email || !password){
            return res
            .status(400)
            .json({message: "Please provide username, email, and password."})
        }

        //if a user with this email already exists in the database
        const existingUser= await User.findOne({email: email.toLowerCase() });
        if(existingUser) {
            return res 
                .status(400)
                .json({ message: "A user with this email already exists."});
        }
        //creating new user
        const newUser = await User.create({
            username,
            email,
            password,
        });
        res.status(201).json(newUser);
    }catch(err){
        //handling mongoose errors
        if(err.name === "ValidationError" || err.code === 11000){
            return res.status(400).json({message:err.message});
        }
        res.status(500).json({message: "Server error during registration."});
    }
});
