import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

const NavLink = ({
  label,
  route,
  icon,
}: {
  label: string;
  route: string;
  icon?: ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === route;

  return (
    <Link
      data-testid={label}
      to={route}
      className={`flex items-center gap-1.5 transition px-3 py-1 rounded-xl font-medium font-primary ${isActive
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
