import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Bell,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  Bot,
} from "lucide-react";
import ProfileCard from "./ProfileCard";

const LeftSidebar = ({ currentUser }) => {
  const menuItems = [
    { icon: Home, text: "Home", path: "/" },
    { icon: Bell, text: "Notifications", path: "#" },
    { icon: MessageSquare, text: "Messages", path: "#" },
    { icon: Bot, text: "Vinty AI", path: "#" },
    { icon: Bookmark, text: "Bookmarks", path: "/bookmarks" },
    { icon: UserIcon, text: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex flex-col items-start justify-center gap-10">
      <div
        className="space-y-6 bg-[#8C7A64] w-[380px] mx-auto border-2 py-4 px-5 relative"
        style={{ boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)" }}
      >
        {/* Navigation Menu */}
        <div className="">
          <h2 className="text-xl font-display font-bold mb-4 text-secondary-foreground/90 text-center border-b-2  pb-2">
            Bulletin Board
          </h2>
          <nav className="flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex bg-muted  pl-2 pr-3 py-1.5 gap-3 items-center justify-between group"
              >
                <div className="bg-muted-foreground/30 p-1 rounded">
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="flex-1 font-typewriter">{item.text}</span>
                {/* Thumbtack icon */}
                <div className="w-2 h-2 rounded-full bg-primary/50 ring-1"></div>
              </Link>
            ))}
          </nav>
        </div>
        <ProfileCard />
      </div>
    </div>
  );
};

export default LeftSidebar;
