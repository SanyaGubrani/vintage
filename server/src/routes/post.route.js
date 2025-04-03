import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  deletePost,
  editCaption,
  getAllPosts,
  getMyPosts,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:userId", getUserPosts);

router
  .use(isAuthenticated)
  .post("/", upload.single("media"), createPost)
  .post("/:postId/caption", editCaption)
  .delete("/:postId", deletePost)
  .get("/me/posts", getMyPosts);

export default router;
