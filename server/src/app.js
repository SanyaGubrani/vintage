import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import authRouter from "./routes/auth.route.js";
import "./config/passport.js";
import { isAuthenticated } from "./middlewares/auth.middleware.js";
import userRouter from "./routes/user.route.js";

// Configurations
const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("common"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //24h
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);

export { app };
