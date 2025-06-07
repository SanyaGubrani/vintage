import React from "react";
import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const navigate = useNavigate();

  const handleUserProfileClick = () => {
    if (!selectedUser?._id) return;
    navigate(`/user/${selectedUser._id}`);
  };

  return (
    <div className="p-2.5 md:p-4 border border-muted-foreground/60 bg-[#7c6b57] shadow-vintage sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Profile picture */}
          <div className="relative">
            {selectedUser.profile_picture ? (
              <img
                src={selectedUser.profile_picture}
                alt={selectedUser.name || "Profile"}
                className="object-cover cursor-pointer border-3 border-muted hover:border-4 hover:border-muted transition-all duration-200 ease-out size-15 rounded-full shadow"
                onClick={handleUserProfileClick}
              />
            ) : (
              <div className="rounded-full size-15 border-3 border-muted flex hover:border-4 hover:border-muted transition-all duration-200 ease-out font-typewriter items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-2xl shadow">
                {selectedUser.username?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span
              className="text-xl md:text-[1.78rem] font-newspaper text-background hover:opacity-90 cursor-pointer"
              onClick={handleUserProfileClick}
            >
              {selectedUser.name || selectedUser.username || "Vintage User"}
            </span>
            <span className="text-xs text-muted mt-[1px] font-typewriter">
              @{selectedUser.username}
            </span>
          </div>
        </div>
        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full cursor-pointer hover:bg-muted-foreground/50 transition-colors border border-primary/40 ml-2"
          aria-label="Close chat"
        >
          <X className="text-muted size-8" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
