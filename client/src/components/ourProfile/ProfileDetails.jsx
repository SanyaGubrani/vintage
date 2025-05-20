import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useFollowStore } from "../../store/useFollowStore";
import { useForm } from "react-hook-form";
import {
  Camera,
  Loader2,
  X,
  Check,
  Pencil,
  Users,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import FollowListOverlay from "../followList";

const ProfileDetails = () => {
  const {
    user,
    getUserProfile,
    updatingProfile,
    updatingProfilePicture,
    updatingCoverImage,
    updateProfile,
    setProfilePicture,
    setCoverImage,
  } = useUserStore();

  const {
    followers,
    following,
    getFollowers,
    getFollowing,
    isLoadingFollowers,
    isLoadingFollowing,
  } = useFollowStore();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  const [imagesChanged, setImagesChanged] = useState(false);

  // File states
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Refs for file inputs
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // Get user data and followers/following counts
  useEffect(() => {
    if (!user) {
      getUserProfile();
    }

    if (user && user.id) {
      getFollowers(user.id);
      getFollowing(user.id);
    }
  }, [user, getUserProfile, getFollowers, getFollowing]);

  // Setup form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  // Reset everything when edit mode changes
  useEffect(() => {
    if (!isEditing) {
      setProfileFile(null);
      setCoverFile(null);
      setImagesChanged(false);
    }
  }, [isEditing]);

  // Handle profile file change
  const handleProfileFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Profile picture must be less than 4MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile_picture", file);
      await setProfilePicture(formData);

      setImagesChanged(true);

      // Clear the file input
      if (profileInputRef.current) {
        profileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Handle cover file change
  const handleCoverFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover image must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      // Immediately upload the cover image
      const formData = new FormData();
      formData.append("cover_image", file);
      await setCoverImage(formData);

      setImagesChanged(true);

      // Clear the file input
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading cover image:", error);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      setImagesChanged(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setImagesChanged(false);
    reset({
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    });
  };

  return (
    <div className="mb-8">
      {/* Cover Image */}
      <div className="relative w-full h-[220px] md:h-[240px] bg-secondary/20 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>
        {user?.cover_image ? (
          <div className="h-full">
            <div className="absolute inset-0 border-t-4 border-secondary-foreground/10 opacity-50 pointer-events-none"></div>
            <img
              src={user.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <div className="flex items-center border-2 border-muted-foreground/40 justify-center h-full text-muted-foreground bg-gradient-to-r from-secondary/30 to-accent/15">
            <p className="font-typewriter text-xs xs:text-sm border-4 border-dashed border-muted-foreground/30 p-2 xs:p-3 rounded">
              Add cover image
            </p>
          </div>
        )}
        {/* Cover image edit option  */}
        {isEditing && (
          <div className="absolute bottom-2 right-2 xs:bottom-4 xs:right-4">
            <label className="p-2 xs:p-3 bg-primary text-white hover:bg-primary/90 rounded-full cursor-pointer flex items-center justify-center shadow-vintage">
              <Camera size={18} className="xs:size-5" />
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Edit button - only visible when not editing */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 xs:top-4 xs:right-4 bg-primary/85 hover:bg-primary text-[0.8rem] xs:text-sm font-typewriter text-white transition-transform duration-200 ease-in flex justify-center items-center gap-1 xs:gap-2 py-1.5 xs:py-2 px-2 xs:px-3 cursor-pointer rounded-lg shadow-vintage"
          >
            <Pencil size={16} className="xs:size-5" />
            <span className="font-medium text-center">Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Info Section*/}
      <div className="bg-gradient-to-b from-accent/10 to-secondary/5 rounded-b-lg border-4 border-t-0 border-secondary-foreground/20 shadow-vintage p-3 xs:p-5">
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture*/}
          <div className="relative mx-auto md:mx-0 md:mr-6 mt-[-60px] xs:mt-[-80px] flex-shrink-0">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-sm"></div>
            <div className="relative size-20 md:size-28 rounded-full overflow-hidden border-4 border-background bg-muted shadow-vintage">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover sepia-[0.1]"
                />
              ) : (
                <div className="flex items-center font-typewriter justify-center h-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-xl xs:text-2xl md:text-4xl">
                  {user?.username?.charAt(0).toUpperCase() || "V"}
                </div>
              )}

              {/* Profile picture edit option */}
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer rounded-full group">
                  <div className="bg-primary/80 p-2 xs:p-2.5 rounded-full transform transition-transform group-hover:scale-110">
                    <Camera size={18} className="xs:size-6 text-white" />
                  </div>
                  <input
                    type="file"
                    ref={profileInputRef}
                    onChange={handleProfileFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow mt-4 md:mt-0">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-newspaper text-primary/90">
                    Edit Your Profile
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs xs:text-sm font-typewriter mb-1 text-muted-foreground">
                      Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="w-full p-2 xs:p-2.5 border-2 border-primary/30 rounded bg-muted/35 font-typewriter focus:outline-none focus:border-primary/60 shadow-sm"
                      placeholder="Your Name"
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                        <X size={12} />
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs xs:text-sm font-typewriter mb-1 text-muted-foreground">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        @
                      </span>
                      <input
                        {...register("username", {
                          required: "Username is required",
                        })}
                        className="w-full p-2 xs:p-2.5 pl-7 border-2 border-primary/30 rounded bg-muted/20 font-typewriter focus:outline-none focus:border-primary/60 shadow-sm"
                        placeholder="username"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                        <X size={12} />
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs xs:text-sm font-typewriter text-muted-foreground">
                        Bio
                      </label>
                      <span className="text-xs font-typewriter text-muted-foreground">
                        (max 100 characters)
                      </span>
                    </div>
                    <textarea
                      {...register("bio", {
                        maxLength: {
                          value: 100,
                          message: "Bio cannot exceed 100 characters",
                        },
                      })}
                      className="w-full p-2 xs:p-3 border-2 border-primary/30 rounded bg-muted/20 font-typewriter focus:outline-none focus:border-primary/60 min-h-[120px] resize-none shadow-sm"
                      placeholder="Tell us about yourself..."
                      maxLength={100}
                    />
                    {errors.bio && (
                      <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                        <X size={12} />
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 xs:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="py-1.5 xs:py-2 px-3 xs:px-5 border-2 cursor-pointer border-primary/30 rounded font-typewriter hover:bg-muted/90 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingProfile || (!isDirty && !imagesChanged)}
                    className={`bg-primary text-white py-1.5 xs:py-2 px-3 xs:px-4 font-typewriter rounded flex items-center gap-1.5 shadow-vintage ${
                      (!isDirty && !imagesChanged) || updatingProfile
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-primary/90"
                    }`}
                  >
                    {updatingProfile ? (
                      <>
                        <Loader2 size={20} className="xs:size-[25px] animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Check size={20} className="xs:size-[25px]" strokeWidth={3} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div>
                  <h3 className="text-xl md:text-2xl font-newspaper text-primary/90 mb-0.5">
                    {user?.name || user?.username || "Vintage User"}
                  </h3>
                  <p className="text-muted-foreground text-sm font-typewriter">
                    @{user?.username || "username"}
                  </p>
                </div>
                <div className="mt-3 xs:mt-4">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-[4px] xs:w-[6px] h-full bg-gradient-to-b from-primary/20 via-primary/50 to-primary-foreground/50"></div>
                    <p className="font-typewriter text-[0.8rem] whitespace-pre-wrap pl-3 xs:pl-4 py-2 bg-muted/10 italic">
                      {user?.bio || "No bio available"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-6 mt-1 pt-4">
                  <button
                    className="flex items-center gap-2 xs:gap-3 cursor-pointer"
                    onClick={() => setShowFollowers(true)}
                  >
                    <div className="p-2.5 rounded-full bg-accent/25">
                      <Users size={23} className="xs:size-[27px] text-primary/95" />
                    </div>
                    <div>
                      <p className="font-newspaper flex flex-col items-start text-lg xs:text-xl">
                        {isLoadingFollowers ? "..." : followers.count}
                      </p>
                      <p className="text-xs font-typewriter text-muted-foreground">
                        Followers
                      </p>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-2 xs:gap-3 cursor-pointer"
                    onClick={() => setShowFollowing(true)}
                  >
                    <div className="p-2.5 rounded-full bg-accent/25">
                      <UserCheck size={23} className="xs:size-[27px] text-primary/95" />
                    </div>
                    <div>
                      <p className="font-newspaper flex flex-col items-start text-lg xs:text-xl">
                        {isLoadingFollowing ? "..." : following.count}
                      </p>
                      <p className="text-xs font-typewriter text-muted-foreground">
                        Following
                      </p>
                    </div>
                  </button>
                </div>
                {/* Followers Overlay */}
                <FollowListOverlay
                  isOpen={showFollowers}
                  onClose={() => setShowFollowers(false)}
                  title="Followers"
                  users={followers.list}
                  isLoading={isLoadingFollowers}
                  currentUserId={user?.id}
                />
                {/* Following Overlay */}
                <FollowListOverlay
                  isOpen={showFollowing}
                  onClose={() => setShowFollowing(false)}
                  title="Following"
                  users={following.list}
                  isLoading={isLoadingFollowing}
                  currentUserId={user?.id}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Loading indicators if any image is being uploaded */}
      {(updatingProfilePicture || updatingCoverImage) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg flex flex-col items-center shadow-vintage border-2 border-primary/20">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="mt-3 font-typewriter">
              {updatingProfilePicture
                ? "Uploading profile picture..."
                : "Uploading cover image..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
