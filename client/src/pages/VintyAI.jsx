import React, { useState, useEffect, useRef } from "react";
import { vintyInstructions, vintyWelcomeMessage } from "../lib/ai-instructions";
import Layout from "../components/Layout";
import { Smile } from "lucide-react";
import { useVintyStore } from "../store/useVintyStore";

function VintyAI() {
  const { messages, setMessages, addMessage, clearMessages } = useVintyStore();
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const chatEndRef = useRef(null);

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

  // Emoji picker (simple, emoji-only)
  const emojis = [
    "😊",
    "😂",
    "🥰",
    "😎",
    "🤔",
    "🙌",
    "🎉",
    "🌸",
    "💖",
    "👍",
    "😇",
    "🤗",
    "✨",
    "🥳",
    "😺",
    "🍀",
    "🌈",
    "💡",
  ];

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center ">
        {/* Chat Header */}
        <div className="flex items-center gap-4 bg-white/80 rounded-2xl shadow-md px-5 py-3 mb-4">
          <img
            src="/images/vinty.png"
            alt="Vinty"
            className="size-20 opacity-90 rounded-full shadow"
          />
          <div>
            <div className="font-bold text-xl text-primary font-newspaper">
              Vinty
            </div>
            <div className="text-sm text-muted-foreground font-typewriter">
              Your vintage AI chat companion
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-full max-w-lg bg-white/80 rounded-2xl shadow-lg flex
         flex-col p-4 h-[25rem] overflow-y-auto mb-4 border border-primary/10
           [&::-webkit-scrollbar]:w-2 scroll-smooth
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-muted
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#ceb399]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] font-typewriter text-base whitespace-pre-line ${
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
                <span>Vinty is typing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="w-full max-w-lg flex items-center gap-2 bg-white/90 rounded-xl shadow px-3 py-2 border border-primary/10">
          <button
            className="text-primary hover:bg-primary/10 rounded-full p-2 transition"
            onClick={() => setShowEmoji((v) => !v)}
            tabIndex={-1}
            type="button"
          >
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 bg-transparent outline-none font-typewriter text-base px-2"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg p-3 flex flex-wrap gap-2 max-w-xs border border-primary/10">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                className="text-2xl hover:scale-125 transition"
                onClick={() => {
                  setUserInput((prev) => prev + emoji);
                  setShowEmoji(false);
                }}
                tabIndex={-1}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default VintyAI;
