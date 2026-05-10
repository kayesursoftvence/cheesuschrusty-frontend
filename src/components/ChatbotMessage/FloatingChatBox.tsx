// components/FloatingChatBox.tsx
import { createPortal } from "react-dom";
import { useState, useRef, useEffect, JSX, KeyboardEvent } from "react";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaMinus,
  FaCircle,
} from "react-icons/fa";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type FloatingChatBoxProps = {
  botName?: string;
  botAvatar?: string;
  welcomeMessage?: string;
  onSendMessage?: (message: string) => Promise<string>;
};

export default function FloatingChatBox(props: FloatingChatBoxProps): JSX.Element | null {
  const {
    botName = "ChatBot",
    welcomeMessage = "Hi there! 👋 How can I help you today?",
    onSendMessage,
  } = props;

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRoot = document.getElementById("message-root");

  // scroll to bottom on new message
  useEffect(function () {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing]);

  // focus input when opened
  useEffect(function () {
    if (open && !minimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, minimized]);

  function toggleOpen(): void {
    if (!open) {
      setOpen(true);
      setMinimized(false);
      setUnread(0);
    } else {
      setOpen(false);
    }
  }

  function toggleMinimize(): void {
    setMinimized(!minimized);
  }

  function formatTime(date: Date): string {
    const h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    const min = String(m).padStart(2, "0");
    return hour + ":" + min + " " + ampm;
  }

  async function handleSend(): Promise<void> {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(function (prev) { return [...prev, userMsg]; });
    setInput("");
    setTyping(true);

    try {
      let botResponse: string;

      if (onSendMessage) {
        botResponse = await onSendMessage(text);
      } else {
        // default mock response
        await new Promise(function (resolve) { setTimeout(resolve, 1500); });
        botResponse = "Thanks for your message! This is a demo response. Connect the `onSendMessage` prop to your API.";
      }

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(function (prev) { return [...prev, botMsg]; });

      if (!open || minimized) {
        setUnread(function (prev) { return prev + 1; });
      }
    } catch {
      const errorMsg: Message = {
        id: "error-" + Date.now(),
        text: "Sorry, something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(function (prev) { return [...prev, errorMsg]; });
    } finally {
      setTyping(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!portalRoot) return null;

  const chatBox = (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">

      {/* Chat Window */}
      <div
        className={
          "origin-bottom-right transition-all duration-300 ease-out " +
          (open
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none")
        }
      >
        <div
          className={
            "w-[380px] max-w-[calc(100vw-3rem)] bg-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden flex flex-col transition-all duration-300 " +
            (minimized ? "h-[56px]" : "h-[520px]")
          }
        >
{/* from-violet-600 to-purple-600 */}
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700  px-4 py-3 flex items-center gap-3 flex-shrink-0 cursor-pointer select-none">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot size={20} className="text-white" />
              </div>
              <FaCircle
                size={10}
                className="text-emerald-400 absolute -bottom-0.5 -right-0.5 border-2 border-violet-600 rounded-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{botName}</p>
              <p className="text-violet-200 text-xs">
                {typing ? "Typing..." : "Online"}
              </p>
            </div>

            <button
              onClick={toggleMinimize}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Minimize"
            >
              <FaMinus size={12} />
            </button>

            <button
              onClick={toggleOpen}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Messages Area */}
          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950/50">
                {messages.map(function (msg) {
                  const isBot = msg.sender === "bot";

                  return (
                    <div
                      key={msg.id}
                      className={
                        "flex items-end gap-2 " +
                        (isBot ? "justify-start" : "justify-end")
                      }
                    >
                      {/* Bot avatar */}
                      {isBot && (
                        <div className="w-7 h-7 rounded-full bg-green-400/30 flex items-center justify-center flex-shrink-0">
                          <FaRobot size={12} className="text-green-400" />
                        </div>
                      )}

                      <div
                        className={
                          "max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed " +
                          (isBot
                            ? "bg-gray-800 text-gray-200 rounded-bl-md"
                            : "bg-violet-600 text-white rounded-br-md")
                        }
                      >
                        <p className="break-words">{msg.text}</p>
                        <p
                          className={
                            "text-[10px] mt-1 " +
                            (isBot ? "text-gray-500" : "text-violet-200")
                          }
                        >
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex items-end gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0">
                      <FaRobot size={12} className="text-violet-400" />
                    </div>
                    <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-800 bg-gray-900 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={function (e) { setInput(e.target.value); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-full border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500 transition-colors"
                    disabled={typing}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || typing}
                    className={
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer" +
                      (input.trim() && !typing
                        ? "bg-emerald-800 hover:bg-green-500 text-white shadow-lg shadow-violet-600/30"
                        : "bg-gray-800 text-gray-600 cursor-not-allowed")
                    }
                    aria-label="Send message"
                  >
                    <FaPaperPlane size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Bubble */}
      <button
        onClick={toggleOpen}
        className={
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-violet-600/40 transition-all duration-300 cursor-pointer " +
          (open
            ? "bg-gray-700 hover:bg-gray-600 rotate-0"
            // from-violet-600 to-purple-600
            : "bg-gradient-to-br  from-emerald-600 to-green-700  hover:from-emerald-500 hover:to-green-500 hover:scale-110")
        }
        aria-label="Toggle chat"
      >
        {open ? (
          <FaTimes size={20} className="text-white" />
        ) : (
          <div className="relative">
            <FaRobot size={24} className="text-white" />

            {/* Unread badge */}
            {unread > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  );

  return createPortal(chatBox, portalRoot);
}