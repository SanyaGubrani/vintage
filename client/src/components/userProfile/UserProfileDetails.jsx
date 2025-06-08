import React, { useEffect, useState } from "react";
import { Users, UserCheck, Loader } from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import FollowButton from "../FollowButton";
import { useFollowStore } from "../../store/useFollowStore";
import FollowListOverlay from "../followList";

const UserProfileDetails = ({ userId }) => {
  const { user } = useUserStore();
  const { getOtherUserProfile } = useUserStore();
  const {
    followers,
    following,
    setViewingUserId,
    getFollowers,
    getFollowing,
    isLoadingFollowers,
    isLoadingFollowing,
    resetFollowState,
  } = useFollowStore();

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    resetFollowState();

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getOtherUserProfile(userId);
        setUserData(data);

        // Set the viewing user ID for follow store
        setViewingUserId(userId);

        // Get followers and following counts
        await Promise.all([getFollowers(userId), getFollowing(userId)]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }

    return () => resetFollowState();
  }, [
    userId,
    getOtherUserProfile,
    setViewingUserId,
    getFollowers,
    getFollowing,
  ]);

  // Handle follow status change
  const handleFollowChange = (isFollowing) => {
    // Update local user data with new follower count if needed
    getFollowers(userId);
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center"><Loader className="size-10 text-primary animate-spin"/></div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div className="mb-8">
      {/* Cover Image */}
      <div className="relative w-full h-[220px] md:h-[240px] bg-secondary/20 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>
        {userData.cover_image ? (
          <div className="h-full">
            <div className="absolute inset-0 border-t-4 border-secondary-foreground/10 opacity-50 pointer-events-none"></div>
            <img
              src={userData.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <div className="flex items-center border-2 border-muted-foreground/40 justify-center h-full text-muted-foreground bg-gradient-to-r from-secondary/30 to-accent/15">
            <p className="font-typewriter text-xs xs:text-sm border-4 border-dashed border-muted-foreground/30 p-2 xs:p-3 rounded">
              No Cover Image
            </p>
          </div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="bg-gradient-to-b from-accent/10 to-secondary/5 rounded-b-lg border-4 border-t-0 border-secondary-foreground/20 shadow-vintage p-3 xs:p-5">
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture */}
          <div className="relative mx-auto md:mx-0 md:mr-6 mt-[-60px] xs:mt-[-80px] flex-shrink-0">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-sm"></div>
            <div className="relative size-20 xs:size-24 md:size-28 rounded-full overflow-hidden border-4 border-background bg-muted shadow-vintage">
              {userData.profile_picture ? (
                <img
                  src={userData.profile_picture}
                  alt={userData.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex font-typewriter items-center justify-center h-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-xl xs:text-2xl md:text-4xl">
                  {userData.username?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow mt-4 md:mt-0">
            <div className="flex flex-row justify-between items-center w-full mx-auto gap-2">
              <div>
                <h3 className="text-xl md:text-2xl font-newspaper text-primary/90 mb-0.5 sm:mt-0 mt-3">
                  {userData.name || userData.username || "Vintage User"}
                </h3>
                <p className="text-muted-foreground text-sm font-typewriter">
                  @{userData.username || "username"}
                </p>
              </div>
              {/* Follow Button */}
              <div className="mt-2 xs:mt-0">
                <FollowButton
                  userId={userId}
                  username={userData.username}
                  onFollowChange={handleFollowChange}
                  className="shadow-md hover:shadow-lg transition-shadow"
                />
              </div>
            </div>

            <div className="mt-3 xs:mt-4">
              <div className="relative">
                <div className="absolute top-0 left-0 w-[4px] xs:w-[6px] h-full bg-gradient-to-b from-primary/40 to-primary/10"></div>
                <p className="font-typewriter text-[0.85rem] xs:text-sm whitespace-pre-wrap pl-3 xs:pl-4 py-2 bg-muted/10 italic">
                  {userData.bio || "No bio available"}
                </p>
              </div>
            </div>

            <div className="flex gap-6 mt-2 pt-4">
              <button
                className="flex items-center gap-1.5 xs:gap-3 cursor-pointer"
                onClick={() => setShowFollowers(true)}
              >
                <div className="p-2.5 rounded-full bg-accent/25">
                  <Users size={23} className="xs:size-[27px] text-primary/95" />
                </div>
                <div>
                  <p className="font-newspaper flex flex-col items-start text-lg xs:text-xl">
                    {isLoadingFollowers ? (
                      <span className="text-muted-foreground">...</span>
                    ) : (
                      followers.count || 0
                    )}
                  </p>
                  <p className="text-xs font-typewriter text-muted-foreground">
                    Followers
                  </p>
                </div>
              </button>

              <button
                className="flex items-center gap-1.5 xs:gap-3 cursor-pointer"
                onClick={() => setShowFollowing(true)}
              >
                <div className="p-2.5 rounded-full bg-accent/25">
                  <UserCheck
                    size={23}
                    className="xs:size-[27px] text-primary/95"
                  />
                </div>
                <div>
                  <p className="font-newspaper flex flex-col items-start text-lg xs:text-xl">
                    {isLoadingFollowing ? (
                      <span className="text-muted-foreground">...</span>
                    ) : (
                      following.count || 0
                    )}
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
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
