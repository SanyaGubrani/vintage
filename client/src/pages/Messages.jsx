import React from "react";
import { useChatStore } from "../store/useChatStore";
import RightSidebar from "../components/RightSidebar";
import ChatInterface from "../components/ChatInterface";
import NoChatSelected from "../components/NoChatSelected";
import LeftSidebar from "../components/LeftSidebar";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

const Messages = () => {
  const { selectedUser } = useChatStore();

  return (
    <Layout>
      <div className="rounded-lg shadow-md w-full max-w-[45rem] h-[calc(100vh-13rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          {!selectedUser ? <NoChatSelected /> : <ChatInterface />}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
