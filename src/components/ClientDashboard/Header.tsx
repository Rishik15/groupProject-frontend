import { Button } from "@heroui/react";
import { useAuth } from "../../utils/auth/AuthContext";
import { Plus, Search } from "lucide-react";

const DashboardHeader = () => {
  const { user } = useAuth();
  const today: Date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const formattedDate: string = today.toLocaleDateString("en-US", options);

  return (
    <section className="flex justify-between items-center px-38 py-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col">
        <div className="text-[16px] font-semibold">
          Good Morning, {user?.first_name}
        </div>
        <div className="text-[13px] text-gray-600">{formattedDate}</div>
      </div>

      <div className="flex gap-2 items-center">
        <Button className="h-8 px-3 rounded-xl bg-[#5B5EF4]">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <div className="text-[12px]">Log Activity</div>
          </div>
        </Button>
        <Button className="h-8 px-3 rounded-xl bg-gray-100 text-black hover:bg-[#5B5EF4] hover:text-white">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <div className="text-[12px]">Find Coaches</div>
          </div>
        </Button>
      </div>
    </section>
  );
};

export default DashboardHeader;
