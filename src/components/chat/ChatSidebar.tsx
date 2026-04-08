import { SearchField } from "@heroui/react";
import type { ChatUser } from "../../utils/Interfaces/chat";

const ChatSidebar = ({ users }: { users: ChatUser[] }) => {
  return (
    <section className="py-8 flex flex-col gap-4 w-84">
      <h1 className="font-bold text-[20px]">Messages</h1>
      <SearchField name="search">
        <SearchField.Group className="bg-white/70 rounded-[9px]">
          <SearchField.SearchIcon />
          <SearchField.Input className="w-full" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <div className="flex flex-col gap-5 mt-4">
        {users.map((user) => (
          <div className="flex gap-2 items-center min-w-0">
            <div className="w-11 h-10 rounded-4xl bg-[#8b8cef] flex items-center justify-center text-[14px] font-semibold p-2">
              {user.initial}
            </div>
            <div className="flex items-center justify-between w-full p-2 pr-4 min-w-0 gap-8">
              <div className="min-w-0 flex flex-col py-1">
                <div className="text-[14px] font-semibold">{user.fullName}</div>
                <div className="text-[12px] text-gray-500 truncate">
                  {user.lastMessage || ""}
                </div>
              </div>

              {user.unreadCount! > 0 && (
                <div className="w-5 h-5 px-2 bg-[#4f46e5] text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
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
