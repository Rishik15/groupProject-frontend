import { Send } from "lucide-react";

const ChatWindow = ({
  user,
  messages,
}: {
  user: any;
  messages: {
    id: number;
    text: string;
    timestamp: string;
    type: "sent" | "received";
  }[];
}) => {
  return (
    <section className="flex flex-col bg-white rounded-3xl w-140 h-165 mx-auto">
      <div className="border-b py-3 px-6 flex flex-col">
        <div className="font-semibold text-[14px]">{user.fullName}</div>
        <div className="text-[12px] flex items-center gap-1 text-gray-500">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          Offline
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {messages.map((msg) => {
          const isSent = msg.type === "sent";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isSent ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`
                  max-w-[70%] px-3 py-1.5 text-[13px] shadow-3xl shadow-default-foreground
                  ${
                    isSent
                      ? "bg-indigo-600 text-white rounded-br-2xl rounded-full"
                      : "bg-gray-100 border border-gray-300 text-black rounded-full rounded-bl-2xl"
                  }
                `}
              >
                {msg.text}
              </div>

              <span className="text-[11px] text-gray-600 mt-0.5 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t p-4 bottom-0 flex items-center justify-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
        />
        <div className="p-2 bg-[#a9aaff] rounded-lg flex items-center justify-center">
          <Send className="w-4 h-4 text-white" />
        </div>
      </div>
    </section>
  );
};

export default ChatWindow;
