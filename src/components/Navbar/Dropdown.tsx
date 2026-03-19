import { Link } from "react-router-dom";

const DropdownItem = ({
  label,
  route = "/",
  danger,
}: {
  label: string;
  route?: string;
  danger?: boolean;
}) => {
  return (
    <Link
      to={route}
      className={`w-full text-left px-3 py-2 rounded-md transition ${
        danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-[#d5d5f5]"
      }`}
    >
      {label}
    </Link>
  );
};

export default DropdownItem;
