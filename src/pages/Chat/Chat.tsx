import { useState, useEffect } from "react";
import ChatMessages from "../../components/chat/ChatMessage";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { get_users } from "../../services/chat/get_user";
import { socket } from "../../services/sockets/socket";

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
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await get_users();
      console.log("FULL DATA:", data);
      setUsers(data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      console.log(" socket ready in Chat");

      socket.emit("join_chat_presence");
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    return () => {
      socket.emit("leave_chat_presence");
      socket.off("connect", handleConnect);
    };
  }, []);

  useEffect(() => {
    if (users.length === 0) return;

    const sendSubscribe = () => {
      socket.emit("subscribe_presence", {
        userIds: users.map((u) => u.id),
      });
    };

    if (socket.connected) {
      sendSubscribe();
    } else {
      socket.on("connect", sendSubscribe);
    }

    return () => {
      socket.off("connect", sendSubscribe);
    };
  }, [users]);

  useEffect(() => {
    socket.on("presence_change", ({ userId, status }) => {
      console.log(" presence_change RECEIVED:", userId, status);

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;

          return {
            ...u,
            status: status === "chat_online" ? "online" : "offline",
          };
        }),
      );
    });

    return () => {
      socket.off("presence_change");
    };
  }, []);

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
