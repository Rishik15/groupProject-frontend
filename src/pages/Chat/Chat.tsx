import { useState, useEffect, useRef } from "react";
import ChatMessages from "../../components/chat/ChatMessage";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { get_users } from "../../services/chat/get_user";
import { socket } from "../../services/sockets/socket";
import { getMessages } from "../../services/chat/get_messages";
import type { Message } from "../../utils/Interfaces/chat";
import { useAuth } from "../../utils/auth/AuthContext";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const selectedUserRef = useRef<any>(null);
  const hasJoinedRef = useRef(false);

  const { activeMode, socketReady, safeEmit } = useAuth();

  const mode = activeMode === "coach" ? "coach" : "client";
  const targetMode = mode === "coach" ? "client" : "coach";

  const currentUser = users.find((u) => u.id === selectedUser?.id);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await get_users(mode);
      setUsers(data);
    };

    fetchUsers();
  }, [mode]);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!socketReady) return;
    if (hasJoinedRef.current) return;

    safeEmit("join_chat_presence");
    hasJoinedRef.current = true;
  }, [socketReady, safeEmit]);

  useEffect(() => {
    return () => {
      if (hasJoinedRef.current) {
        safeEmit("leave_chat_presence");
        hasJoinedRef.current = false;
      }
    };
  }, [safeEmit]);

  useEffect(() => {
    if (!socketReady) return;
    if (users.length === 0) return;

    safeEmit("subscribe_presence", {
      identities: users.map((u) => `${u.id}:${targetMode}`),
    });
  }, [socketReady, users, targetMode, safeEmit]);

  useEffect(() => {
    const handler = ({ identity, status }: any) => {
      const [userId] = identity.split(":");

      setUsers((prev) =>
        prev.map((u) => {
          if (String(u.id) !== userId) return u;

          return {
            ...u,
            status: status === "chat_online" ? "online" : "offline",
          };
        }),
      );
    };

    socket.on("presence_change", handler);

    return () => {
      socket.off("presence_change", handler);
    };
  }, []);

  useEffect(() => {
    if (!selectedUser?.conversationId) return;

    const convId = selectedUser.conversationId;

    safeEmit("chat_selected", { convId });

    const fetchMessages = async () => {
      const data = await getMessages(convId);

      setMessages(data);

      setUsers((prev) =>
        prev.map((u) =>
          u.conversationId === convId ? { ...u, unreadCount: 0 } : u,
        ),
      );
    };

    fetchMessages();

    return () => {
      safeEmit("chat_deselected", { convId });
    };
  }, [selectedUser, safeEmit]);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      const currentUser = selectedUserRef.current;

      const isActive = currentUser?.conversationId === message.conversation_id;

      if (isActive) {
        setMessages((prev) => [
          ...prev,
          {
            id: message.message_id,
            text: message.content,
            timestamp: message.sent_at,
            type: "received",
          },
        ]);
      }

      setUsers((prev) =>
        prev.map((u) => {
          if (u.conversationId !== message.conversation_id) return u;

          return {
            ...u,
            lastMessage: message.content,
            unreadCount: isActive ? 0 : (u.unreadCount || 0) + 1,
          };
        }),
      );
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    const handleConversationUpdate = (data: any) => {
      const currentUser = selectedUserRef.current;
      const { conversationId, message } = data;

      setUsers((prev) =>
        prev.map((u) => {
          if (u.conversationId !== conversationId) return u;

          const isActive = currentUser?.conversationId === conversationId;

          return {
            ...u,
            lastMessage: message.content,
            unreadCount: isActive ? 0 : (u.unreadCount || 0) + 1,
          };
        }),
      );
    };

    socket.on("conversation_update", handleConversationUpdate);

    return () => {
      socket.off("conversation_update", handleConversationUpdate);
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
            <ChatWindow
              user={currentUser}
              messages={messages}
              setMessages={setMessages}
              setUsers={setUsers}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Chat;
