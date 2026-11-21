import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
import userRoutes from "./routes/userRoutes.js";
import { error } from "node:console";

//dns
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//middleware
app.use(express.json());

//verifying server is running
app.get("/",(req,res)=>{
    res.send("Welcome to the Innovate Inc. Authentication API!");
});

//Mount user routes
app.use("/api/users",userRoutes);

//Connect to MongoDB & listen
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDB database");
        app.listen(PORT, ()=>{
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error)=>{
        console.error("Failed to connect to MongoDB:", error.message);
    });