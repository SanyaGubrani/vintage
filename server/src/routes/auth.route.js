import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import passport from "passport";
import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

const router = Router();

// Local Auth Routes
router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/logout", isAuthenticated, logoutUser);

// Google OAuth Routes
router.get(
  "/google",
  (req, res, next) => {
    // console.log("Starting Google OAuth flow");
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    // console.log("Received callback from Google");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: `${process.env.CORS_ORIGIN}/auth`,
    // successRedirect: `${process.env.CORS_ORIGIN}/`,
  }),
  (req, res) => {
    // console.log("Google authentication successful, redirecting to home");
    res.redirect(`${process.env.CORS_ORIGIN}/`);
  }

  // Testing:
  // (req, res) => {
  //   res.send({
  //     id: req.user?._id,
  //     username: req.user?.username,
  //     email: req.user?.email,
  //     googleId: req.user?.googleId,
  //     authenticated: req.isAuthenticated(),
  //   });
  // }
);

router.get("/me", isAuthenticated, (req, res) => {
  res.send({
    id: req.user?._id,
    username: req.user?.username,
    email: req.user?.email,
    googleId: req.user?.googleId,
    authenticated: true,
  });
});

export default router;
