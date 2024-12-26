import express from 'express'
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express()

const whiteList = ["http://localhost:5173", "https://colorwizz.net"];
const corsOptions = {
    credentials: true,
    origin: whiteList,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

//user Routes
app.use("/api", userRoutes);
app.get("/check-me", (req,res)=>{
    res.json({message:"Aagya bhai"});
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));