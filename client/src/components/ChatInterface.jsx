import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";

const ChatInterface = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) return <Loader />;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMe = message.sender._id === authUser._id;
          const user = isMe ? authUser : selectedUser;
          return (
            <div
              key={message._id}
              className={`flex items-start gap-3 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {!isMe && (
                <div>
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="profile"
                      className="w-10 h-10 rounded-full border-2 border-primary/30 shadow object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-xl border-2 border-primary/30 shadow font-typewriter">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[70%] flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 shadow-vintage ${
                    isMe
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-muted/70 text-primary rounded-bl-none"
                  }`}
                >
                  {message.media && (
                    <img
                      src={message.media}
                      alt="attachment"
                      className="max-w-[180px] rounded mb-2 border border-primary/20"
                    />
                  )}
                  {message.message && (
                    <p className="font-typewriter break-words">
                      {message.message}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Avatar */}
              {isMe && (
                <div className="">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="profile"
                      className="w-10 h-10 rounded-full border-2 border-primary/30 shadow object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-xl border-2 border-primary/30 shadow font-typewriter">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatInterface;
