import React, { useState, useRef, useEffect } from "react";
// import { GoogleGenAI } from "@google/genai";
import { Bot, Send, User, X, Loader2, Sparkles } from "lucide-react";
import gsap from "gsap";

const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: "Hello! I am your Nomad Labs virtual concierge. Looking for a hidden gem in Bali or a ski retreat in the Alps?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      gsap.fromTo(
        widgetRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    } else {
      setIsOpen(false);
    }
  };

  //   const handleSend = async () => {
  //     if (!input.trim() || isTyping) return;

  //     const userMsg = input;
  //     setInput("");
  //     setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
  //     setIsTyping(true);

  //     try {
  //       // Fixed: Initializing GoogleGenAI following strictly the naming and parameter guidelines
  //       const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  //       const response = await ai.models.generateContent({
  //         model: "gemini-3-flash-preview",
  //         contents: `You are the Nomad Labs Concierge, an expert in high-end luxury hotels and homestays. Be sophisticated, helpful, and concise. User asks: ${userMsg}`,
  //         config: {
  //           systemInstruction:
  //             "You are an elite travel concierge. Tone: Elegant, minimalist, helpful.",
  //         },
  //       });

  //       // Fixed: Extracting text directly from the property .text
  //       const botText =
  //         response.text ||
  //         "I apologize, I'm having trouble connecting to my travel database.";
  //       setMessages((prev) => [...prev, { role: "bot", text: botText }]);
  //     } catch (error) {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           role: "bot",
  //           text: "Service temporarily unavailable. Our agents will be with you shortly.",
  //         },
  //       ]);
  //     } finally {
  //       setIsTyping(false);
  //     }
  //   };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div className="w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <Sparkles className="text-zinc-900 dark:text-white" size={24} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Nomad Concierge
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Our elite AI travel assistant is arriving soon to curate your next
            luxury journey.
          </p>
        </div>
        <div className="px-3 py-1 bg-zinc-900 dark:bg-white rounded-full">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white dark:text-zinc-900">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;
