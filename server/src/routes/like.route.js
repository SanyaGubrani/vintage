import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/like.controller.js";

const router = Router();

router.use(isAuthenticated).post("/:postId", toggleLike);

export default router;
