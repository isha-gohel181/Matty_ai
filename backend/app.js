import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();


config({ path: "./.env" })


// *===================================
// *Neccessary-Middlewares
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN.split(",");
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));





app.use(errorMiddleware)
// *End-Of-Neccessary-Middlewares
// *===================================


export { app };