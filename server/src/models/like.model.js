import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

// Enforce one target only (Like on comment OR post)
likeSchema.pre("save", function (next) {
  if ((this.post && this.comment) || (!this.post && !this.comment)) {
    return next(
      new Error(
        "A like must reference either a post OR a comment, not both or neither"
      )
    );
  }
  next();
});

// Prevent duplicate likes
likeSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

export const Like = mongoose.model("Like", likeSchema);
