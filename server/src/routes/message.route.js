import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessages,
} from "../controllers/message.controller.js";

const router = Router();

router
  .use(isAuthenticated)
  .get("/users", getUsersForSidebar)
  .get("/:receiverId", getMessages)
  .post("/send/:receiverId", sendMessages);

export default router;
