import { useState } from "react";
import Dashboard from "./dashboard/ManageDashboard";
import Nutrition from "./nutrition/ManageNutrition";
import Workouts from "./workouts/ManageWorkouts";
import { X, Home, Dumbbell, Refrigerator } from "lucide-react";

type Tab = "dashboard" | "workouts" | "nutrition";

const Icons = {
  dashboard: <Home className="h-5 w-5" />,
  workouts: <Dumbbell className="h-5 w-5" />,
  nutrition: <Refrigerator className="h-5 w-5" />,
};

export default function ManageClientModal({
  contractId,
  onClose,
}: {
  contractId: number;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gap-4 bg-black/40 py-6 backdrop-blur-sm">
      <div className="absolute left-22 top-12 flex flex-col gap-4 pt-6">
        {(["dashboard", "workouts", "nutrition"] as Tab[]).map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ${
              activeTab === tab
                ? "bg-indigo-500 text-white"
                : "bg-white shadow-lg"
            }`}
          >
            {Icons[tab]}
          </div>
        ))}
      </div>

      <div className="absolute right-24 top-12 pt-6">
        <div
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg hover:bg-indigo-500 hover:text-white"
        >
          <X className="h-5 w-5" />
        </div>
      </div>

      <div className="h-[95%] w-[80%] overflow-y-auto rounded-4xl bg-[#f8f8fbe4] p-6 shadow-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {activeTab === "dashboard" && (
          <Dashboard contractId={contractId} onTabChange={setActiveTab} />
        )}

        {activeTab === "workouts" && <Workouts contractId={contractId} />}

        {activeTab === "nutrition" && <Nutrition contract_Id={contractId} />}
      </div>
    </div>
  );
}
