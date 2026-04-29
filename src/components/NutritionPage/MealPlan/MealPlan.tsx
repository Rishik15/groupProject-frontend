import { useState } from "react";
import { Button } from "@heroui/react";
import MealPlanLibrary from "./MealPlanLibrary";
import AssignedPlans from "./AssignedPlans";
import CreateMealPlan from "./CreateMealPlan";

type ActiveTab = "library" | "assigned" | "create";

const MealPlan = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("library");

  const tabClass = (tab: ActiveTab) =>
    activeTab === tab
      ? "h-8 rounded-full bg-[#EDEBFF] px-4 text-[13px] font-semibold text-[#5E5EF4]"
      : "h-8 rounded-full bg-transparent px-4 text-[13px] font-semibold text-[#666678] hover:bg-[#EFEFF6]";

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-fit items-center gap-3">
        <Button
          variant="tertiary"
          className={tabClass("library")}
          onPress={() => setActiveTab("library")}
        >
          Library
        </Button>

        <Button
          variant="tertiary"
          className={tabClass("assigned")}
          onPress={() => setActiveTab("assigned")}
        >
          My Plans
        </Button>

        <Button
          variant="tertiary"
          className={tabClass("create")}
          onPress={() => setActiveTab("create")}
        >
          Create Plan
        </Button>
      </div>

      {activeTab === "library" && <MealPlanLibrary />}
      {activeTab === "assigned" && <AssignedPlans />}
      {activeTab === "create" && <CreateMealPlan />}
    </div>
  );
};

export default MealPlan;
