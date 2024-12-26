import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, password, contact, gender } = req.body;
        // Check if email already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ message: "Email Already Exists" });
        }
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            username, email, password: hashedPassword, contact, gender
        });

        // Respond with success
        res
            .status(201)
            .json({ message: "User Created Successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password, isRememberMe } = req.body;

        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        bcrypt.compare(password, user.password, function (error, result) {
            if (error) return res.status(500).json({ message: error.message });
            if (result == true) {
                const token = jwt.sign({ uId: user._id, plan: user.subscriptionPlan }, process.env.SECRET);
                // console.log(token);
                // Set the token as a cookie
                // res.cookie("token", token, {
                //     httpOnly: true,
                //     maxAge: isRememberMe ? 604800 * 1000 : 3600 * 1000, // Cookie expires in 7 days (604800 seconds) if remember me is true, otherwise 1 hour (3600 seconds)
                //     // secure: process.env.NODE_ENV === 'production',
                //     secure: false,
                //     sameSite: 'strict',
                //     path: '/',
                // });
                // res.cookie("token", token, {
                //     httpOnly: true,
                //     maxAge: isRememberMe ? 604800 * 1000 : 3600 * 1000, // Cookie expires in 7 days (604800 seconds) if remember me is true, otherwise 1 hour (3600 seconds)
                //     // secure: process.env.NODE_ENV === 'production',
                //     secure: false,
                //     sameSite: 'strict',
                //     path: '/',
                // });

                // Respond with success
                const { name, email, contact, gender } = user;
                const responseUser = {
                    name, email, contact, gender
                }
                res.status(200).json({ message: "User LoggedIn Successfully", user: responseUser, token: token });
            }
            else if (result == false) {
                return res.status(404).json({ message: "User not Found" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const savePalette = async (req, res) => {
    try {
        const user = req.user;
        const colors = req.body.colors
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not sent from middleware" });
        }

        const userWithPalette = await User.findOne({
            _id: user._id,
            savedPalettes: {
                $elemMatch: { $eq: colors } // Check if colors exists in savedPalettes
            }
        });

        if (userWithPalette) {
            return res.status(200).json({ message: "Palette already saved", exists: true });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $push: { savedPalettes: colors } },
            { new: true }
        );

        return res.status(201).json({ message: "Palette Saved", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllPalettes = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not sent from middleware" });
        }

        const userWithPalette = await User.findOne({ _id: user._id });
        const allSavedPalettes = userWithPalette.savedPalettes;
        // console.log(allSavedPalettes);
        return res.status(201).json(allSavedPalettes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const DeletePalette = async (req, res) => {
    try {
        const { index } = req.body
        const user = req.user;
        const userId = user._id;
        const indexToDelete = index;

        await User.updateOne(
            { _id: userId }, // Find the parent document
            { $unset: { [`savedPalettes.${indexToDelete}`]: 1 } } // Set the element at the specified index to null
        ).then(() => {
            return User.updateOne(
                { _id: userId },
                { $pull: { savedPalettes: null } } // Remove all null values from the array
            );
        }).then(() => {
            console.log("Element deleted successfully");
        }).catch((error) => {
            console.error("Error deleting element:", error);
        });

        res.status(200).json({ message: "Palette deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkPlan = async (req, res) => {
    try {
        // console.log("sdssdf");
        const user = req.user;
        let plan = "";
        if (user.subscriptionPlan == "free") {
            plan = "free";
            res.status(200).json({ message: "free person", plan: plan });
        }
        else {
            plan = "premium";
            res.status(200).json({ message: "premium person", plan: plan });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}