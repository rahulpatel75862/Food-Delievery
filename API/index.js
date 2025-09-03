import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
    connectDB()
    console.log(`server started at ${port}`)
})