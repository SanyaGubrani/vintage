import React, { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { Loader2 } from "lucide-react";

const ProfileCard = () => {
  //fetch user details
  const { user, fetchingUserData, getUserProfile } = useUserStore();

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
    <div className="max-w-[250px] lg:max-w-[280px] bg-accent/15 mx-auto py-3 border-2 border-primary rounded-lg shadow-vintage">
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
        {user.name || "No name set"}
      </h3>
      {/* username */}
      <p className="text-center text-sm  font-medium text-muted-foreground font-newspaper">
        @{user.username}
      </p>
      {/* bio */}
      <div className="mt-2 text-center">
        <p className="font-typewriter text-xs">
          {user.bio || "No bio added yet."}
        </p>
      </div>
      {/* edit profile */}
      <div className="mt-3 flex justify-center">
        <button className="button-vintage !lowercase !py-1 lg:!py-1.5 !px-2 !text-xs">
          Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
