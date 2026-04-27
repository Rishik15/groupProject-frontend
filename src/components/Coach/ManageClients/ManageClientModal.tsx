import { useState } from "react";
import Dashboard from "./dashboard/ManageDashboard";
import Nutrition from "./nutrition/ManageNutrition";
import Workouts from "./workouts/ManageWorkouts";
import { X } from "lucide-react";
import { Home, Dumbbell, Refrigerator } from "lucide-react";

type Tab = "dashboard" | "workouts" | "nutrition";

const Icons = {
  dashboard: <Home className="w-5 h-5" />,
  workouts: <Dumbbell className="w-5 h-5" />,
  nutrition: <Refrigerator className="w-5 h-5" />,
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center py-6 gap-4 backdrop-blur-sm">
      <div className="absolute left-13 top-12 flex flex-col gap-4 pt-6">
        {(["dashboard", "workouts", "nutrition"] as Tab[]).map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer 
            ${activeTab === tab ? "bg-indigo-500 text-white" : "bg-white shadow-lg"}`}
          >
            {Icons[tab]}
          </div>
        ))}
      </div>

      <div className="absolute right-15 top-12 pt-6">
        <div
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </div>
      </div>

      <div className="w-[85%] h-[95%] bg-[#f8f8fbe4] rounded-4xl shadow-xl overflow-hidden p-6">
        {activeTab === "dashboard" && (
          <Dashboard contractId={contractId} onTabChange={setActiveTab} />
        )}

        {activeTab === "workouts" && <Workouts contractId={contractId} />}

        {activeTab === "nutrition" && <Nutrition contract_Id={contractId} />}
      </div>
    </div>
  );
}
