import { useState } from "react";
import Dashboard from "./dashboard/ManageDashboard";
import Nutrition from "./nutrition/ManageNutrition";
import Workouts from "./workouts/ManageWorkouts";
import { X } from "lucide-react";

type Tab = "dashboard" | "workouts" | "nutrition";

export default function ManageClientModal({
  contractId,
  onClose,
}: {
  contractId: number;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="absolute left-6 flex flex-col gap-4">
        {["dashboard", "workouts", "nutrition"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer 
            ${activeTab === tab ? "bg-indigo-600 text-white" : "bg-white shadow"}`}
          >
            {tab[0].toUpperCase()}
          </div>
        ))}
      </div>

      <div className="absolute right-6">
        <div
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer shadow"
        >
          <X className="w-5 h-5" />
        </div>
      </div>

      <div className="w-[90%] h-[90%] bg-white rounded-2xl shadow-xl overflow-hidden p-6">
        {activeTab === "dashboard" && <Dashboard contractId={contractId} />}

        {activeTab === "workouts" && <Workouts contractId={contractId} />}

        {activeTab === "nutrition" && <Nutrition contractId={contractId} />}
      </div>
    </div>
  );
}
