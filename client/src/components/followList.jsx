import React from "react";
import { X } from "lucide-react";
import FollowButton from "./FollowButton";

const FollowListOverlay = ({
  isOpen,
  onClose,
  title,
  users,
  isLoading,
  currentUserId,
}) => {
    
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-typewriter text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent/30 rounded-full transition-colors"
          >
            <X size={25} />
          </button>
        </div>

        {/* User List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center font-typewriter text-muted-foreground">
              Loading...
            </div>
          ) : users?.length > 0 ? (
            <div className="p-2">
              {users.map((userData) => {
                   const user = title === "Followers" 
                   ? userData.follower 
                   : userData.following;
                if (!user) return null;

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 hover:bg-accent/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {/* Profile Picture */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                        {user.profile_picture ? (
                          <img
                            src={user.profile_picture}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-accent/20 flex items-center justify-center text-primary font-newspaper">
                            {user.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div>
                        <p className="font-typewriter font-bold text-sm">
                          {user.name || user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    {/* Follow Button - Don't show for current user */}
                    {user._id !== currentUserId && (
                      <FollowButton
                        userId={user._id}
                        username={user.username}
                        className="scale-90"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center font-typewriter text-muted-foreground">
              No users to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListOverlay;
