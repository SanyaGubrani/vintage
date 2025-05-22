import React from "react";
import { useChatStore } from "../store/useChatStore";
import RightSidebar from "../components/RightSidebar";
import ChatInterface from "../components/ChatInterface";
import NoChatSelected from "../components/NoChatSelected";
import LeftSidebar from "../components/LeftSidebar";
import Layout from "../components/Layout";

const Messages = () => {
  const { selectedUser } = useChatStore();
  return (
    <Layout>
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="rounded-lg shadow-md w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatInterface />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
