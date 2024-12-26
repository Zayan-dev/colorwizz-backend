import express from "express";
import { signUp, signIn, savePalette, getAllPalettes, DeletePalette, checkPlan } from "../controllers/userController.js";
import { isUserLoggedIn } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/savePalette", isUserLoggedIn, savePalette);
router.get("/getAllPalettes", isUserLoggedIn, getAllPalettes);
router.delete("/savedPaletteDelete", isUserLoggedIn, DeletePalette);
router.get("/checkPlan", isUserLoggedIn, checkPlan);

export default router;