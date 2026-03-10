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
      w-46 h-30
      border rounded-xl text-left
      transition
      ${
        active
          ? "border-[#5B5EF4] ring-2 ring-[#5B5EF4]/20"
          : "border-gray-200 hover:border-gray-300"
      }
      `}
    >
      <div className="w-8 h-8 p-2 mb-2 flex items-center justify-center rounded-lg bg-gray-300 text-[#5B5EF4]">
        {icon}
      </div>

      <div>
        <h3 className="text-[14px] font-semibold">{title}</h3>
        <p className="text-[14px] text-gray-500 leading-snug">{desc}</p>
      </div>
    </button>
  );
};

export default RoleCard;