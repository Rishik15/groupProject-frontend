import type { ReactNode } from "react";

type RoleCardProps = {
  title: string;
  desc: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

const RoleCard = ({ title, desc, icon, active, onClick }: RoleCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`
      flex flex-col p-3
      w-44 h-28
      border-2 rounded-xl text-left
      transition
      ${
        active
          ? "border-[#5B5EF4] ring-2 ring-[#5B5EF4]/20 bg-[#edeefb]"
          : "border-gray-200 hover:border-[#a6a9e8]"
      } 
      `}
    >
      <div
        className={`w-8 h-7 p-2 mb-2 flex items-center justify-center rounded-lg  ${
          active ? "bg-[#E1E2FA] text-[#5B5EF4]" : "bg-gray-200 text-gray-500"
        } `}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-[13px] font-semibold">{title}</h3>
        <p className="text-[12px] text-gray-500 leading-snug">{desc}</p>
      </div>
    </button>
  );
};

export default RoleCard;
