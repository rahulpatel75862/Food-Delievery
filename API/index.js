import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./Routers/auth.router.js";
import cors from "cors"

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes)

app.listen(port, () => {
    connectDB()
    console.log(`server started at ${port}`)
})