import { useState } from "react";
import ChatMessages from "../../components/chat/ChatMessage";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";

const users = [
  {
    id: 1,
    fullName: "Rishik Yesgari",
    initial: "R",
    lastMessage: "How are you?",
    unreadCount: 2,
  },
  {
    id: 2,
    fullName: "John Doe",
    initial: "J",
    unreadCount: 0,
  },
  {
    id: 3,
    fullName: "Sarah Smith",
    initial: "S",
    lastMessage: "Are you working on the new routine? Are you doing it well?",
    unreadCount: 5,
  },
];

type Message = {
  id: number;
  text: string;
  timestamp: string;
  type: "sent" | "received";
};

const messages: Message[] = [
  {
    id: 1,
    text: "Hey bro",
    timestamp: "10:30 AM",
    type: "received",
  },
  {
    id: 2,
    text: "What's up?",
    timestamp: "10:31 AM",
    type: "received",
  },
  {
    id: 3,
    text: "All good, working out",
    timestamp: "10:32 AM",
    type: "sent",
  },
];

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <main className="mt-16 flex items-center justify-center px-36">
      <div className="flex max-w-5xl w-full">
        <ChatSidebar users={users} onSelectUser={setSelectedUser} />

        <div className="flex-1">
          {!selectedUser ? (
            <ChatMessages />
          ) : (
            <ChatWindow user={selectedUser} messages={messages} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Chat;
