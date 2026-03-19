import { Link } from "react-router-dom";
import type { ReactNode } from "react";

const NavLink = ({
  label,
  active,
  route,
  icon,
}: {
  label: string;
  active?: boolean;
  route: string;
  icon?: ReactNode;
}) => {
  return (
    <Link
      to={route}
      className={`flex items-center gap-1.5 transition px-3 py-1 rounded-xl font-medium font-primary ${
        active
          ? "text-[#5659ed] bg-[#d5d5f5]"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
      }`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </Link>
  );
};

export default NavLink;
