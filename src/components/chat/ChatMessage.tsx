import { MessageCircle } from "lucide-react";

const ChatMessages = () => {
  return (

    <section className="flex items-center justify-center mx-auto mt-52">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-gray-200 p-2 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-gray-500" />
        </div>
        <p className="text-[14px] font-semibold">
          Select a conversation to start chatting!
        </p>
      </div>
    </section>
  );
};

export default ChatMessages;
