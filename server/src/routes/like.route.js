import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { likeComment, likePost } from "../controllers/like.controller.js";

const router = Router();

router
  .use(isAuthenticated)
  .post("/post/:postId", likePost)
  .post("/comment/:commentId", likeComment);

export default router;
