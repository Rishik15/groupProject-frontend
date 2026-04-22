import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth/logout";
import { useAuth } from "../../utils/auth/AuthContext";
import { socket } from "../../services/sockets/socket";

const Dropdownaction = ({
  label,
  route,
  danger,
  type = "link",
  onClick,
}: {
  label: string;
  route?: string;
  danger?: boolean;
  type?: "logout" | "link" | "action";
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const handleClick = () => {
  onClick?.();

  setTimeout(async () => {
    if (type === "logout") {
      await logout();
      clearAuth(true);

      if (socket.connected) {
        socket.disconnect();
      }

      navigate("/");
      return;
    }

    if (type === "link" && route) {
      navigate(route);
      return;
    }
  }, 0);
};

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-3 py-2 rounded-md transition ${
        danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-[#d5d5f5]"
      }`}
    >
      {label}
    </button>
  );
};

export default Dropdownaction;
