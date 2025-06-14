import React, { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  //fetch user details
  const { user, fetchingUserData, getUserProfile } = useUserStore();
  const { logoutUser } = useAuthStore();

  //fetch user details on every getProfile change
  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  //skeleton while loading
  if (fetchingUserData) {
    return (
      <div className="max-w-[280px] mx-auto p-4 flex items-center justify-center border-3 border-primary">
        <Loader2 className="animate-spin size-10 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-[280px] mx-auto p-4">No profile data available</div>
    );
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className=" bg-muted mx-auto py-3 border-3 border-primary-foreground/50 rounded-lg shadow-vintage"
      style={{ boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex flex-col items-center">
        {/* avatar */}
        <div className="size-12 lg:size-18 rounded-full overflow-hidden border-3 border-primary mb-2">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={`${user.username}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full text-2xl bg-muted flex items-center justify-center text-primary font-newspaper">
              {user.username?.charAt(0).toUpperCase() || "Vintage"}
            </div>
          )}
        </div>
      </div>

      {/* name */}
      <h2 className="text-center text-xl font-typewriter-bold">
        {user.name || user.username || "What's your name?"}
      </h2>
      {/* username */}
      <p className="text-center text-sm  font-medium text-muted-foreground font-newspaper">
        @{user.username}
      </p>
      {/* bio */}
      <div className="my-2 text-center border rounded border-muted-foreground/40 mx-2 p-1 ">
        <p className="font-newspaper tracking-wide break-words !text-sm text-muted-foreground">
          {user.bio || "Welcome to Vintage! Add a little about yourself — or try editing your profile!"}
        </p>
      </div>
      {/* edit profile */}
      <div className="mt-3 flex justify-center px-2">
        <Link
          className="button-vintage text-center !w-full !py-1 lg:!py-1.5 !px-2 !text-base "
          to="/profile"
        >
          Profile
        </Link>
      </div>
      {/* Logout User */}
      <div className="mt-3 flex px-2">
        <button
          onClick={handleLogout}
          className="button-vintage w-full !bg-[#403c28]/75 !border-[#4f463b] !py-1 lg:!py-1.5 !px-2 !text-base font-typewriter-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
