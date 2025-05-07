import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  followUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
} from "../controllers/follow.controller.js";

const router = Router();

router
  .use(isAuthenticated)
  .post("/:followingUserId", isAuthenticated, followUser)
  .get("/:userId/followers", getFollowers)
  .get("/:userId/following", getFollowing)
  .get("/status/:userId", checkFollowStatus);

export default router;
