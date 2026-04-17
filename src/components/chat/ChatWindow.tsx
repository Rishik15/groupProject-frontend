import { Send } from "lucide-react";
import type { Message } from "../../utils/Interfaces/chat";
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../../services/chat/send_message";

const ChatWindow = ({
  user,
  messages,
  setMessages,
}: {
  user: any;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const isOnline = user.status === "online";
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const groupedMessages = messages.reduce(
    (groups: Record<string, Message[]>, msg) => {
      const date = new Date(msg.timestamp);

      const dateLabel = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }

      groups[dateLabel].push(msg);
      return groups;
    },
    {},
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input;

    const tempMessage: Message = {
      id: Date.now(),
      text: messageText,
      timestamp: new Date().toISOString(),
      type: "sent",
    };

    setMessages((prev) => [...prev, tempMessage]);

    setInput("");

    try {
      await sendMessage(messageText, user.conversationId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {}, []);

  return (
    <section className="flex flex-col bg-white rounded-3xl w-140 h-165 mx-auto">
      <div className="border-b py-3 px-6 flex flex-col">
        <div className="font-semibold text-[14px]">{user.fullName}</div>

        <div className="text-[12px] flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-gray-500">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel} className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <span className="text-[11px] text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {dateLabel}
              </span>
            </div>

            {msgs.map((msg) => {
              const isSent = msg.type === "sent";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isSent ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-1.5 text-[13px] shadow-3xl shadow-default-foreground ${
                      isSent
                        ? "bg-indigo-600 text-white rounded-br-2xl rounded-full"
                        : "bg-gray-100 border border-gray-300 text-black rounded-full rounded-bl-2xl"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span className="text-[11px] text-gray-600 mt-0.5 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4 bottom-0 flex items-center justify-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="w-full bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
        />

        <div
          onClick={() => {
            if (!input.trim()) return;
            handleSend();
          }}
          className={`p-2 rounded-lg flex items-center justify-center transition-all ${
            input.trim()
              ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              : "bg-indigo-300 cursor-not-allowed opacity-70"
          }`}
        >
          <Send className="w-4 h-4 text-white" />
        </div>
      </div>
    </section>
  );
};

export default ChatWindow;
