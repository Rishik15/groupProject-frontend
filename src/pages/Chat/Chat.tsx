import { useState, useEffect } from "react";
import ChatMessages from "../../components/chat/ChatMessage";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { get_users } from "../../services/chat/get_user";
import { socket } from "../../services/sockets/socket";
import { getMessages } from "../../services/chat/get_messages";
import type { Message } from "../../utils/Interfaces/chat";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

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

  useEffect(() => {
    if (!selectedUser?.conversationId) return;

    const convId = selectedUser.conversationId;

    socket.emit("chat_selected", { convId });

    const fetchMessages = async () => {
      const data = await getMessages(convId);
      setMessages(data);
    };

    fetchMessages();

    return () => {
      socket.emit("chat_deselected", { convId });
    };
  }, [selectedUser]);

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
