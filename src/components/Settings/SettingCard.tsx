import { Card, Avatar } from "@heroui/react";
import { useAuth } from "../../utils/auth/AuthContext";

const SettingCard = ({ role }: { role: string }) => {
  const { user } = useAuth();

  return (
    <Card className="rounded-2xl border shadow-sm bg-white w-165">
      <Card.Header className="p-0">
        <div className="flex items-center gap-3 px-5 py-3">
          <Avatar className="w-14 h-14 shrink-0">
            <Avatar.Image
              alt="Blue"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
            />
            <Avatar.Fallback>B</Avatar.Fallback>
          </Avatar>

          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold leading-none">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-gray-500 leading-tight mt-1">
              {user?.email}
            </p>
            <p className="text-indigo-500 text-xs mt-1">
              {role === "client"
                ? "Client"
                : role === "admin"
                  ? "Admin"
                  : role === "coach"
                    ? "Coach"
                    : ""}
            </p>
            <p></p>
          </div>
        </div>
      </Card.Header>
    </Card>
  );
};

export default SettingCard;
