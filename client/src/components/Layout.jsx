import React, { useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Navbar from "./Navbar";
import { useUserStore } from "../store/useUserStore";

const Layout = ({ children }) => {
  const { user, getUserProfile } = useUserStore();

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto xl:max-w-7xl">
        {/* Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:p-4">
          <div className="lg:col-span-3 z-50 sticky top-4 self-start">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 px-5 flex flex-col w-full gap-5">
            <Navbar />
            {children}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 z-50 sticky top-4 self-start">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
