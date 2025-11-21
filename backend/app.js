import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import Razorpay from "razorpay";

import userRouter from "./routes/user.route.js";
import activityRouter from "./routes/activityLog.route.js";
import adminRouter from "./routes/admin.route.js";
import designRouter from "./routes/design.route.js"; 
 // import imageRouter from "./routes/image.route.js";
import templateRouter from "./routes/template.route.js";
import favoriteRouter from "./routes/favorite.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import aiRouter from "./routes/ai.route.js";
import paymentRouter from "./routes/payment.route.js";
import authRouter from "./routes/auth.route.js";
import apiKeyRouter from "./routes/apiKey.route.js";
import teamRouter from "./routes/team.route.js";
import MongoStore from 'connect-mongo';

const app = express();

config({ path: "./.env" });

// Razorpay instance
export const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

// Import passport after dotenv config
import passport from "./utils/passport.utils.js";

// *===================================
// *Neccessary-Middlewares
app.use(express.json({ limit: "16mb" })); // Increased limit for JSON data
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Session middleware for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTIONSTRING + '/' + process.env.DBNAME,
    ttl: 24 * 60 * 60 // 24 hours in seconds
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// const allowedOrigins = process.env.CORS_ORIGIN.split(",");
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/designs", designRouter); 
// app.use("/api/v1/images", imageRouter);
app.use("/api/v1/templates", templateRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/api-keys", apiKeyRouter);
app.use("/api/v1/teams", teamRouter);

app.use(errorMiddleware);
// *End-Of-Neccessary-Middlewares
// *===================================

export { app };
