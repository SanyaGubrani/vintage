import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Bell,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  Bot,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import ProfileCard from "./ProfileCard";
import { IoMenu } from "react-icons/io5";

const LeftSidebar = ({ currentUser }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menuItems = [
    { icon: Home, text: "Home", path: "/" },
    { icon: Bot, text: "Vinty AI", path: "/vinty" },
    { icon: MessageSquare, text: "Messages", path: "/messages" },
    { icon: Bookmark, text: "Bookmarks", path: "/bookmarks" },
    { icon: Bell, text: "Notifications", path: "/notifications" },
    { icon: UserIcon, text: "Profile", path: "/profile" },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-50 bg-muted-foreground/80 cursor-pointer hover:bg-[#7d6d58] p-2 rounded-lg shadow-lg xl:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <IoMenu size={30} className="text-white" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 pt-4 pb-2 overflow-y-auto z-50 opacity-100 
          w-full h-full md:w-[80vw] max-w-xs bg-[#8C7A64]
           border-r-2 border-primary/30 shadow-xl
          transform transition-transform duration-300 ease-in-out
         [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-none
          [&::-webkit-scrollbar-track]:bg-[#776653]
          [&::-webkit-scrollbar-thumb]:rounded-none
          [&::-webkit-scrollbar-thumb]:bg-[#d1c1ac] 
          ${open ? "translate-x-0" : "-translate-x-full"}
          xl:static xl:translate-x-0 xl:w-[320px] 2xl:w-[370px] xl:max-w-none xl:shadow-none xl:border-0
        `}
        style={{ boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)" }}
      >
        {/* Close button for mobile */}
        <div className="flex xl:hidden justify-start p-3 ">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="p-1 rounded-full cursor-pointer hover:bg-accent/30 transition z-40"
          >
            <CloseIcon size={32} className="text-white" />
          </button>
        </div>
        <div className="space-y-6 md:space-y-12 px-5 pb-4 md:py-4 z-50">
          {/* Navigation Menu */}
          <div className="bg-[#8C7A64] z-50">
            <h2 className="text-3xl font-display font-bold mb-6 text-secondary-foreground/90 text-center border-b-2 pb-2">
              Bulletin Board
            </h2>
            <nav className="flex flex-col gap-3 md:gap-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex bg-muted pl-2 pr-3 py-2 gap-3 items-center justify-between group rounded"
                  onClick={() => setOpen(false)}
                >
                  <div className="bg-muted-foreground/30 p-1 rounded">
                    <item.icon className="size-6 group-hover:scale-110 group-hover:text-primary transition-transform" />
                  </div>
                  <span className="flex-1 text-[1.1rem] md:text-[1.19rem] font-typewriter">
                    {item.text}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-primary/50 ring-1"></div>
                </Link>
              ))}
            </nav>
          </div>
          <ProfileCard />
        </div>
      </aside>
      {/* Spacer for desktop layout */}
      <div className="hidden xl:block w-[380px] shrink-0" />
    </>
  );
};

export default LeftSidebar;
