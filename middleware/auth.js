import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isUserLoggedIn = async (req, res, next) => {
  try {
    let token = req.body.token || req.headers.authorization?.split(" ")[1]; //token from client browser
    if (!token || token === "undefined" || token === null || token === ""){
      return res.status(404).json({ message: "Unauthorized User" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    // console.log("hi")

    // Finding the user by ID from the decoded token
    const decodedUser = await User.findById(decoded.uId).exec();

    if (!decodedUser){
      return res.status(404).json({ message: "Unauthorized User" });
    }

    req.user = decodedUser; // Pass the user to the next middleware
    next();
  } catch (error) {
    return res.status(500).json({ message: "Unauthorized User from catch" });
  }
};
