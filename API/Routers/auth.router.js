import express from "express";
import { signUp, signIn, signOut, sendOtp, verifyOtp, resetOtp } from '../controller/auth.controller.js'

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.get("/signout", signOut)
authRoutes.post("/send/otp", sendOtp);
authRoutes.post("/verify/otp", verifyOtp);
authRoutes.post("/reset/otp", resetOtp)

export default authRoutes;