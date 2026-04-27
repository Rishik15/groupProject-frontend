import { useState } from "react";
import { SearchField } from "@heroui/react";
import type { ChatUser } from "../../utils/Interfaces/chat";

const ChatSidebar = ({
  users,
  onSelectUser,
}: {
  users: ChatUser[];
  onSelectUser: (user: ChatUser) => void;
}) => {
  const [query, setQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className=" flex flex-col gap-4 w-84">
      <h1 className="font-bold text-[20px]">Messages</h1>

      <SearchField name="search">
        <SearchField.Group className="bg-white/70 rounded-[9px]">
          <SearchField.SearchIcon />
          <SearchField.Input
            className="w-full"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <div className="flex flex-col gap-3 mt-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="flex gap-2 items-center min-w-0"
          >
            <div className="relative w-11 h-10">
              <div className="w-full h-full rounded-4xl bg-[#a9aaff] flex items-center justify-center text-[15px] font-semibold text-[#444566]">
                {user.initial}
              </div>

              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  user.status === "online" ? "bg-green-500" : "bg-red-600"
                }`}
              />
            </div>
            <div className="flex items-center justify-between w-full p-2 pr-4 min-w-0 gap-8">
              <div className="min-w-0 flex flex-col py-1">
                <div className="text-[14px] font-semibold">{user.fullName}</div>
                <div className="text-[12px] text-gray-500 truncate">
                  {user.lastMessage || ""}
                </div>
              </div>

              {user.unreadCount! > 0 && (
                <div className="w-5 h-5 mt-1 px-2 bg-[#544de1] text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                  {user.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChatSidebar;
