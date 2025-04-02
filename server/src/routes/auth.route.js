import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// Local Auth Routes
router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/logout", isAuthenticated, logoutUser);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", {
    failureRedirect: `${process.env.CORS_ORIGIN}/`,
  }),
  // successRedirect: `${process.env.CORS_ORIGIN}/dashboard`,

  // Testing:
  (req, res) => {
    res.send({
      id: req.user?._id,
      username: req.user?.username,
      email: req.user?.email,
      googleId: req.user?.googleId,
      authenticated: req.isAuthenticated(),
    });
    
  }
);

router.get("/me", isAuthenticated, (req, res) => {
  res.send({
    id: req.user?._id,
    username: req.user?.username,
    email: req.user?.email,
    googleId: req.user?.googleId,
    authenticated: req.isAuthenticated(),
  });
});

export default router;
