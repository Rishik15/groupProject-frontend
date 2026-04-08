import ChatMessages from "../../components/chat/ChatMessage";
import ChatSidebar from "../../components/chat/ChatSidebar";

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

const Chat = () => {
  return (
    <main className="w-full">
      <div className="flex max-w-7xl mx-auto px-6">
        <ChatSidebar users={users} />
      </div>
    </main>
  );
};

export default Chat;
