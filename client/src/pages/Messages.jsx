import React from "react";
import { useChatStore } from "../store/useChatStore";
import RightSidebar from "../components/RightSidebar";
import ChatInterface from "../components/ChatInterface";
import NoChatSelected from "../components/NoChatSelected";
import LeftSidebar from "../components/LeftSidebar";
import Navbar from "../components/Navbar";

const Messages = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto w-full xl:max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full md:grid-cols-12 gap-4 md:p-4">
          {/* Left Sidebar*/}
          <div className="col-span-0 xl:col-span-3 z-50 sticky top-4 self-start">
            <LeftSidebar />
          </div>

          {/* Main Chat Area */}
          <div className="col-span-6 xl:col-span-6 z-40 px-5 flex flex-col w-full items-center justify-center gap-4">
            <Navbar />
            <div className="rounded-lg shadow-md w-full max-w-6xl h-[calc(100vh-10.2rem)]">
              <div className="flex h-full rounded-lg overflow-hidden">
                {!selectedUser ? <NoChatSelected /> : <ChatInterface />}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-4 xl:col-span-3 sticky z-50 top-4 self-start">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;