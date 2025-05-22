import React from "react";
import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  return (
    <div className="p-4 border-b border-primary/30 bg-background/80 shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-4">
          {/* Profile picture */}
          <div className="relative">
            {selectedUser.profile_picture ? (
              <img
                src={selectedUser.profile_picture}
                alt={selectedUser.name || "Profile"}
                className="object-cover size-12 rounded-full border-2 border-primary/40 shadow"
              />
            ) : (
              <div className="rounded-full size-12 flex font-typewriter items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-2xl border-2 border-primary/40 shadow">
                {selectedUser.username?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-newspaper text-primary/90">
              {selectedUser.name || selectedUser.username || "Vintage User"}
            </span>
            <span className="text-xs text-muted-foreground font-typewriter">
              @{selectedUser.username}
            </span>
          </div>
        </div>
        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-primary/10 transition-colors border border-primary/20 ml-2"
          aria-label="Close chat"
        >
          <X className="text-primary size-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;