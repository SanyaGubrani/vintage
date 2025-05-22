import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RightSidebar = () => {
  const navigate = useNavigate();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-muted border-l-2 border-primary/20">
        <Loader className="size-12 animate-spin text-primary" />
      </div>
    );

  return (
    <aside className="flex flex-col transition-all duration-200 max-w-md w-full mx-auto border-l-2 border-primary/20 bg-muted/40 shadow-vintage h-screen">
      {/* Header */}
      <div className="border-b border-primary/30 w-full p-5 bg-background/80 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-primary" />
          <span className="font-medium font-newspaper text-primary/90 text-lg tracking-wide">
            Contacts
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3 flex-1">
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground font-typewriter">
            No contacts found.
          </div>
        ) : (
          users.map((user, idx) => (
            <React.Fragment key={user._id}>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  navigate("/messages");
                }}
                className={`w-full px-4 py-3 flex items-center gap-4 rounded-lg transition-all
                  ${
                    selectedUser?._id === user?._id
                      ? "bg-primary/20 ring-2 ring-primary/60 shadow"
                      : "hover:bg-primary/10"
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary/40
                `}
              >
                <div className="relative">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name || "Profile"}
                      className="object-cover size-10 rounded-full border-2 border-primary/30 shadow"
                    />
                  ) : (
                    <div className="rounded-full size-10 flex font-typewriter items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-xl border-2 border-primary/30 shadow">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-newspaper text-primary/90">
                    {user.name || user.username || "Vintage User"}
                  </span>
                  <span className="text-xs text-muted-foreground font-typewriter">
                    @{user.username}
                  </span>
                </div>
              </button>
              {idx !== users.length - 1 && (
                <div className="border-b border-primary/15 mx-6" />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
