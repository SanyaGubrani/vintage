import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const router = Router();

router
  .use(isAuthenticated)
  .post("/post/:postId", addComment)
  .get("/post/:postId", getPostComments)

  .delete("/:commentId", deleteComment);

export default router;
