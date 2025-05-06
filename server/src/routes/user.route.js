import { Router } from "express";
import {
  getUserProfile,
  updateCoverImage,
  updateProfilePicture,
  updateUserProfile,
  getOtherUserProfile
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// User routes

router
  .use(isAuthenticated)
  .get("/profile", getUserProfile)
  .post("/updateProfile", updateUserProfile)
  .post(
    "/profilePicture",
    upload.single("profile_picture"),
    updateProfilePicture
  )
  .post("/coverImage", upload.single("cover_image"), updateCoverImage)
  .get("/:userId", getOtherUserProfile)

export default router;