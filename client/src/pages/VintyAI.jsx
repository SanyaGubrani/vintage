import React, { useState, useEffect, useRef, useMemo } from "react";
import { vintyInstructions, vintyWelcomeMessage } from "../lib/ai-instructions";
import Layout from "../components/Layout";
import { Smile } from "lucide-react";
import { useVintyStore, createVintyStore } from "../store/useVintyStore";
import { IoMdSend } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";
import EmojiPicker from "emoji-picker-react";
import { GoDependabot } from "react-icons/go";
import { useUserStore } from "../store/useUserStore";

function VintyAI() {
  const { user } = useUserStore();
  const userId = user?.id || user?._id || "guest";
  const useVintyStore = React.useMemo(() => createVintyStore(userId), [userId]);
  const { messages, setMessages, addMessage, clearMessages } = useVintyStore();
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const chatEndRef = useRef(null);
  const emojiPickerRef = useRef(null);


  // On mount, set welcome message if no messages
  useEffect(() => {
    if (!messages || messages.length === 0) {
      setMessages([
        {
          role: "bot",
          text: vintyWelcomeMessage,
        },
      ]);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const fetchAIResponse = async (prompt) => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: vintyInstructions }],
      },
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      addMessage({ role: "bot", text: aiText });
    } catch (error) {
      addMessage({ role: "bot", text: "Error fetching response." });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (userInput.trim()) {
      addMessage({ role: "user", text: userInput });
      fetchAIResponse(userInput);
      setUserInput("");
      setShowEmoji(false);
    }
  };

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        e.target.getAttribute("aria-label") !== "emoji-btn"
      ) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showEmoji]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Chat Header */}
        <div className="flex items-center gap-3 md:gap-4 bg-white/80 rounded-xl shadow-md shadow-muted px-4 md:px-5 py-2 md:py-3 my-4">
          <img
            src="/images/vinty.png"
            alt="Vinty"
            className="size-16 sm:size-18 cursor-pointer hover:scale-105 transition-transform duration-150  md:size-20 opacity-90 rounded-full shadow"
          />
          <div>
            <div className="font-bold text-lg md:text-xl tracking-widest text-primary font-newspaper">
              Vinty
            </div>
            <div className="text-xs md:text-sm text-muted-foreground font-typewriter">
              Your vintage AI chatbot
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div
          className="w-full max-w-2xl bg-white/80 rounded-xl shadow-lg flex
         flex-col p-4 h-[30rem] xl:h-[34rem] overflow-y-auto mb-4 border-3 border-primary/40
           [&::-webkit-scrollbar]:w-2 scroll-smooth
          [&::-webkit-scrollbar-track]:rounded-xl
          [&::-webkit-scrollbar-track]:bg-muted
          [&::-webkit-scrollbar-thumb]:rounded-xl
          [&::-webkit-scrollbar-thumb]:bg-[#ceb399]
          "
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] font-typewriter text-sm md:text-[1.0.7rem] whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-[#f7e7d7] text-primary rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-2">
              <div className="px-4 py-2 rounded-2xl bg-[#f7e7d7] text-primary font-typewriter rounded-bl-none animate-pulse">
                <span className="text-sm md:text-base">Vinty is typing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="w-full max-w-2xl flex items-center gap-1 md:gap-2 bg-white/90 rounded-xl shadow px-1.5 md:px-3 py-2 border-3 border-primary/50">
          <button
            className="text-primary bg-accent/25 hover:bg-accent/40 rounded-xl p-1.5 transition"
            onClick={() => setShowEmoji((v) => !v)}
            tabIndex={-1}
            type="button"
          >
            <GoDependabot
              className="md:size-6 size-[1.1rem]"
              strokeWidth={0.5}
            />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 bg-transparent outline-none font-typewriter text-sm md:text-base px-1 md:px-2 placeholder:text-sm md:placeholder:text-base"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            className="bg-primary hover:bg-primary/90 text-white font-semibold p-1.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? (
              <LuLoaderCircle className="animate-spin size-4 md:size-6" />
            ) : (
              <IoMdSend className="size-4 md:size-6" />
            )}
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-28 left-[43%] md:left-[33%] -translate-x-1/2 z-50"
          >
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                const emoji = emojiObject.emoji;
                setUserInput((prev) => prev + emoji);
                setShowEmoji(false);
              }}
              theme="light"
              emojiStyle="native"
              width={320}
              height={400}
              skinTonesDisabled
              searchDisabled
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default VintyAI;
