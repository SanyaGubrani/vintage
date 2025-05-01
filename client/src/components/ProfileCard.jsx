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

  return (
    <div
      className=" bg-muted mx-auto py-3 border-3 border-primary-foreground/50 rounded-lg shadow-vintage"
      style={{ boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex flex-col items-center">
        {/* avatar */}
        <div className="size-12 lg:size-16 rounded-full overflow-hidden border-3 border-primary mb-2">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={`${user.username}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-primary font-newspaper">
              {user.username?.charAt(0).toUpperCase() || "Vintage"}
            </div>
          )}
        </div>
      </div>
      {/* name */}
      <h3 className="text-center text-base lg:text-lg font-typewriter-bold">
        {user.name || "What's your name?"}
      </h3>
      {/* username */}
      <p className="text-center text-sm  font-medium text-muted-foreground font-newspaper">
        @{user.username}
      </p>
      {/* bio */}
      <div className="mt-2 text-center border rounded border-muted-foreground/40 p-1 m-2">
        <p className="font-typewriter break-words text-xs text-muted-foreground">
          {user.bio || "Say something bout yourself, eh?"}
        </p>
      </div>
      {/* edit profile */}
      <div className="mt-3 flex justify-center px-4">
        <Link className="button-vintage text-center !w-full !py-1 lg:!py-1.5 !px-2 !text-xs"
        to="/profile"
        >
          Profile
        </Link>
      </div>
      {/* Logout User */}
      <div className="mt-3 flex px-4">
        <button
          onClick={logoutUser}
          className="button-vintage w-full !bg-[#403c28]/75 !border-[#4f463b] !py-1 lg:!py-1.5 !px-2 !text-xs font-typewriter-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
