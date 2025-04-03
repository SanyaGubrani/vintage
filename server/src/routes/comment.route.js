import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  deleteReply,
  getCommentReplies,
  getPostComments,
  replyToComment,
} from "../controllers/comment.controller.js";

const router = Router();

router
  .use(isAuthenticated)
  .post("/post/:postId", addComment)
  .get("/post/:postId", getPostComments)
  .post("/reply/:commentId", replyToComment)
  .get("/reply/:commentId", getCommentReplies)
  .delete("/:commentId", deleteComment)
  .delete("/reply/:replyId", deleteReply);

export default router;
