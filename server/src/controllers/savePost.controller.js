import { Post } from "../models/post.model.js";
import { SavePost } from "../models/savePost.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToSavedPosts = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { postId } = req.params;
  const userId = req.user?._id;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  // check if the post exists
  const post = await Post.exists({ _id: postId });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Toggle save/unsave action
  const alreadySaved = await SavePost.findOneAndDelete({
    post: postId,
    user: userId,
  });

  let action = "unsaved";
  let savedPost = null;

  // save action
  if (!alreadySaved) {
    const newSavedPost = await SavePost.create({ post: postId, user: userId });

    // populate it with the details of user who posted
    savedPost = await SavePost.findById(newSavedPost._id).populate({
      path: "post",
      populate: {
        path: "user",
        select: "username profile_picture",
      },
    });

    action = "saved";
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        saved: action === "saved",
        savedPost: savedPost,
        postId,
      },
      `Post ${action} successfully`
    )
  );
});

const getSavedPosts = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const userId = req.user?._id;

  // get all saved posts and count
  const [savedPosts, countSavedPosts] = await Promise.all([
    SavePost.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "post",
        populate: [
          {
            path: "user",
            select: "username profile_picture",
          },
        ],
      }),

    SavePost.countDocuments({ user: userId }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { savedPosts, countSavedPosts },
        "Saved Posts retrieved successfully"
      )
    );
});

export { addToSavedPosts, getSavedPosts };
