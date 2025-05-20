import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessages,
} from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .use(isAuthenticated)
  .get("/users", getUsersForSidebar)
  .get("/:receiverId", getMessages)
  .post("/send/:receiverId", upload.single("media"), sendMessages);

export default router;
