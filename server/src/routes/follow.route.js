import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { followUser, getFollowers, getFollowing } from "../controllers/follow.controller.js";

const router = Router();

router.post("/:followingUserId", isAuthenticated, followUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

export default router;