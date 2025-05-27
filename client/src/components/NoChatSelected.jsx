import { MessageSquare } from "lucide-react";
import { RiMessage3Fill } from "react-icons/ri";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-start p-16 bg-background-100/50">
      <div className="max-w-md text-center space-y-4">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <RiMessage3Fill className="size-10 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold md:whitespace-nowrap font-typewriter-bold text-secondary-foreground/90">Welcome to Vintage Chats</h2>
        <p className="text-muted-foreground md:font-typewriter">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
