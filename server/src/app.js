import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import authRouter from "./routes/auth.route.js";
import "./config/passport.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import likeRouter from "./routes/like.route.js";
import commentRouter from "./routes/comment.route.js";
import savePostRouter from "./routes/savePost.route.js";
import followRouter from "./routes/follow.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./utils/soket.js";
import likePostRouter from "./routes/like.route.js";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";

const envPath = path.resolve(process.cwd(), envFile);
dotenv.config({ path: envPath });

// Configurations
// const app = express();

app.use(express.json({ limit: "30mb" }));
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
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/save", savePostRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/like", likePostRouter);

export { app };
