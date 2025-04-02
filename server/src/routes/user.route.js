import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// User routes
router.get("/profile", isAuthenticated, getUserProfile);

export default router;