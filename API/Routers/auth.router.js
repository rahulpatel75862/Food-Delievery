import express from "express";
import { signUp, signIn, signOut } from '../controller/auth.controller.js'

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.get("/signout", signOut)

export default authRoutes;