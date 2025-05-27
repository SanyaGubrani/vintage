import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiMessage3Fill } from "react-icons/ri";
import { X, MessageSquare } from "lucide-react";

const RightSidebar = () => {
  const navigate = useNavigate();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  // State for mobile overlay
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Mobile menu icon 
  const MobileMenuButton = () => (
    <button
      className="fixed top-4 right-6 z-50 cursor-pointer hover:bg-muted-foreground bg-muted-foreground/80 text-white rounded-full p-2.5 shadow-lg lg:hidden"
      onClick={() => setOpen(true)}
      aria-label="Open chat list"
    >
      <RiMessage3Fill className="size-[1.64rem]" />
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col transition-all h-full md:h-[calc(100vh-2.3rem)] duration-200 max-w-md w-full mx-auto border-l-2 border-primary/20 bg-background/80 shadow-vintage ">
      {/* Header */}
      <div className="border-b border-primary/30 w-full py-4 px-[1.2rem] bg-[#8c7a64d5] shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RiMessage3Fill className="size-7 text-muted" />
          <span className="font-medium font-newspaper text-muted text-[1.49rem] tracking-wide">
            Chat
          </span>
        </div>
        {/* Close button for overlay */}
        <button
          className="lg:hidden cursor-pointer hover:text-white text-muted "
          onClick={() => setOpen(false)}
          aria-label="Close chat list"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* User List */}
      <div
        className="overflow-y-auto  
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-sm
          [&::-webkit-scrollbar-track]:bg-muted
          [&::-webkit-scrollbar-thumb]:rounded-sm
          [&::-webkit-scrollbar-thumb]:bg-[#8c7a64d5] w-full py-1 flex-1"
      >
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
                  setOpen(false); 
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
    </div>
  );

  if (isUsersLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-muted border-l-2 border-primary/20">
        <Loader className="size-12 animate-spin text-primary" />
      </div>
    );

  return (
    <>
      {/* Mobile menu button */}
      <MobileMenuButton />

      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div className="w-64 max-w-[80vw] h-full bg-background shadow-lg animate-slideInRight relative">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden z-50 lg:flex flex-col transition-all h-[calc(100vh-2.3rem)] duration-200 max-w-md w-full mx-auto border-l-2 border-primary/20 bg-background/80 shadow-vintage ">
        <SidebarContent />
      </aside>
    </>
  );
};

export default RightSidebar;
