import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

const ChatInterface = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { user } = useUserStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) return <Loader />;

  return (
    <div className="flex-1 mt-4 bg-background/50 border-4 rounded-sm border-[#8c7a64bd] shadow-lg shadow-vintage flex flex-col overflow-auto">
      <ChatHeader />
      <div
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-none
          [&::-webkit-scrollbar-track]:bg-primary/15
          [&::-webkit-scrollbar-thumb]:rounded-none
          [&::-webkit-scrollbar-thumb]:bg-primary/75 p-2 md:p-4 space-y-4"
      >
        {messages.map((message) => {
          const isMe = String(message.sender) === String(user.id);
          const messageUser = isMe ? user : selectedUser;
          return (
            <div
              key={message._id}
              className={`flex items-start gap-2 md:gap-3 ${
                isMe ? "justify-end" : "justify-start"
              }`}
              ref={messageEndRef}
            >
              {/* Avatar */}
              {!isMe && (
                <div>
                  {messageUser.profile_picture ? (
                    <img
                      src={messageUser.profile_picture}
                      alt="profile"
                      className="size-10 md:size-11 rounded-full border-2 border-primary/30 shadow object-cover"
                    />
                  ) : (
                    <div className="size-10 md:size-11 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-xl border-2 border-primary/30 shadow font-typewriter">
                      {messageUser.username?.charAt(0).toUpperCase() || "?"}
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
                  className={`rounded-2xl px-2 md:px-4 py-1.5 shadow-vintage ${
                    isMe
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-muted/70 text-primary rounded-bl-none"
                  }`}
                >
                  {message.media && (
                    <img
                      src={message.media}
                      alt="attachment"
                      className="max-w-[250px] rounded my-1 border border-primary/20"
                    />
                  )}
                  {message.message && (
                    <p className="font-typewriter md:text-lg text-sm break-words">
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

              {/* Avatar for self */}
              {isMe && (
                <div>
                  {messageUser.profile_picture ? (
                    <img
                      src={messageUser.profile_picture}
                      alt="profile"
                      className="size-10 md:size-11 rounded-full border-2 border-primary/30 shadow object-cover"
                    />
                  ) : (
                    <div className="size-10 md:size-11 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-xl border-2 border-primary/30 shadow font-typewriter">
                      {messageUser.username?.charAt(0).toUpperCase() || "?"}
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
