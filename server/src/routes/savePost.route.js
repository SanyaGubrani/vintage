import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  addToSavedPosts,
  getSavedPosts,
} from "../controllers/savePost.controller.js";

const router = Router();

router
  .use(isAuthenticated)
  .post("/:postId", addToSavedPosts)
  .get("/", getSavedPosts);

export default router;
