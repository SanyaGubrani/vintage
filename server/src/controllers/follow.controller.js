import { Follow } from "../models/follow.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const followUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const followerUserId = req.user?._id; // the person Following (current user)
  const { followingUserId } = req.params; // the person to BE followed

  if (!followingUserId) {
    throw new ApiError(400, "Following user ID is required");
  }

  // check if user exists
  const userExists = await User.exists({ _id: followingUserId });
  if (!userExists) {
    throw new ApiError(404, "User to follow not found");
  }

  // no self-follow
  if (followerUserId.toString() === followingUserId) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  // follow / unfollow toggle
  const alreadyFollowed = await Follow.findOneAndDelete({
    follower: followerUserId,
    following: followingUserId,
  });

  let action = "unfollowed";
  let followData = null;

  // follow action
  if (!alreadyFollowed) {
    const newFollow = await Follow.create({
      follower: followerUserId,
      following: followingUserId,
    });

    // get follower and following user details
    followData = await Follow.findById(newFollow._id)
      .populate("follower", "username profile_picture")
      .populate("following", "username profile_picture");

    action = "followed";

    // get update followers/following count
    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: followingUserId }), // num of users following this user
      Follow.countDocuments({ follower: followerUserId }), // num of users this user follows
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isFollowing: action === "followed",
          followData,
          targetUser: {
            _id: followingUserId,
            followersCount,
            followingCount,
          },
        },
        `User ${action} successfully`
      )
    );
  }
});

const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const [user, followers, followersCount] = await Promise.all([
    User.findById(userId).select("username name profile_picture"),
    Follow.find({ following: userId })
      .sort({ createdAt: -1 })
      .populate("follower", "username profile_picture name"),
    Follow.countDocuments({ following: userId }),
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        followers,
        followersCount,
      },
      `Followers of ${user.username} retrieved successfully`
    )
  );
});

const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const [user, following, followingCount] = await Promise.all([
    User.findById(userId).select("username name profile_picture"),
    Follow.find({ follower: userId })
      .sort({ createdAt: -1 })
      .populate("following", "username profile_picture name"),
    Follow.countDocuments({ follower: userId }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        following,
        followingCount,
      },
      `Following of ${user.username} retrieved successfully`
    )
  );
});

export { followUser, getFollowers, getFollowing };
