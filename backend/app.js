import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import userRouter from "./routes/user.route.js";
import activityRouter from "./routes/activityLog.route.js";
import adminRouter from "./routes/admin.route.js";
import designRouter from "./routes/design.route.js"; 
// import imageRouter from "./routes/image.route.js";
import templateRouter from "./routes/template.route.js";
import favoriteRouter from "./routes/favorite.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import aiRouter from "./routes/ai.route.js";

const app = express();

config({ path: "./.env" });

// *===================================
// *Neccessary-Middlewares
app.use(express.json({ limit: "16mb" })); // Increased limit for JSON data
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN.split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/designs", designRouter); 
// app.use("/api/v1/images", imageRouter);
app.use("/api/v1/templates", templateRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/ai", aiRouter);

app.use(errorMiddleware);
// *End-Of-Neccessary-Middlewares
// *===================================

export { app };