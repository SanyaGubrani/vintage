import React, { useEffect, useState } from "react";
import { Users, UserCheck } from "lucide-react";
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
      <div className="h-60 flex items-center justify-center">Loading...</div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div className="mb-8">
      {/* Cover Image */}
      <div className="relative w-full h-[240px] bg-secondary/20 rounded-t-lg overflow-hidden">
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
            <p className="font-typewriter text-sm border-4 border-dashed border-muted-foreground/30 p-3 rounded">
              No Cover Image
            </p>
          </div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="bg-gradient-to-b from-accent/10 to-secondary/5 rounded-b-lg border-4 border-t-0 border-secondary-foreground/20 shadow-vintage p-5">
        <div className="flex">
          {/* Profile Picture */}
          <div className="relative mr-6 mt-[-80px] flex-shrink-0">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-sm"></div>
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-background bg-muted shadow-vintage">
              {userData.profile_picture ? (
                <img
                  src={userData.profile_picture}
                  alt={userData.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex font-typewriter items-center justify-center h-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-4xl">
                  {userData.username?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            <div className="flex justify-between items-start w-full mx-auto">
              <div>
                <h3 className="text-2xl font-newspaper text-primary/90 mb-0.5">
                  {userData.name || userData.username || "Vintage User"}
                </h3>
                <p className="text-muted-foreground text-sm font-typewriter">
                  @{userData.username || "username"}
                </p>
              </div>
              {/* Follow Button */}
              <div className="">
                <FollowButton
                  userId={userId}
                  username={userData.username}
                  onFollowChange={handleFollowChange}
                  className="shadow-md hover:shadow-lg transition-shadow"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-primary/40 to-primary/10"></div>
                <p className="font-typewriter text-sm whitespace-pre-wrap pl-4 py-2 bg-muted/10 italic">
                  {userData.bio || "No bio available"}
                </p>
              </div>
            </div>

            <div className="flex gap-12 mt-6 pt-4 border-t border-primary/20">
              <button
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowFollowers(true)}
              >
                <div className="p-2 rounded-full bg-accent/25">
                  <Users size={27} className="text-primary/95" />
                </div>
                <div>
                  <p className="font-newspaper flex flex-col items-start text-xl">
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
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowFollowing(true)}
              >
                <div className="p-2 rounded-full bg-accent/25">
                  <UserCheck size={27} className="text-primary/95" />
                </div>
                <div>
                  <p className="font-newspaper flex flex-col items-start text-xl">
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
