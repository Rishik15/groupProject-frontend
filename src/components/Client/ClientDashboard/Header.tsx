import { useState } from "react";
import { Button } from "@heroui/react";
import { ImagePlus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../utils/auth/AuthContext";
import WellnessCheck from "../WellnessCheck/WellnessCheck";
import ActivityLogModal from "@/components/ActivityLog/ActivityLogModal";

interface DashboardHeaderProps {
  onActivityLogged?: () => void;
}

const DashboardHeader = ({ onActivityLogged }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

  const today: Date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const formattedDate: string = today.toLocaleDateString("en-US", options);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <section className="flex justify-between items-center px-38 py-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <div className="text-[16px] font-semibold">
            {getGreeting()}, {user?.first_name}
          </div>

          <div className="text-[13px] text-gray-600">{formattedDate}</div>
        </div>

        <div className="flex gap-4 items-center">
          <Button
            className="h-8 px-3 rounded-xl border border-[#5B5EF4]/20 bg-white text-[#5B5EF4]"
            onPress={() => navigate("/client/progress-photos")}
          >
            <div className="flex items-center gap-2">
              <ImagePlus className="w-4 h-4" />
              <div className="text-[12px]">Add Progress Pictures</div>
            </div>
          </Button>

          <Button
            className="h-8 px-3 rounded-xl bg-[#5B5EF4]"
            onPress={() => setIsActivityLogOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <div className="text-[12px]">Log Activity</div>
            </div>
          </Button>

          <WellnessCheck />
        </div>
      </section>

      <ActivityLogModal
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        initialTab="cardio"
        sessionId={null}
        onLogged={onActivityLogged}
        onFinished={onActivityLogged}
      />
    </>
  );
};

export default DashboardHeader;
