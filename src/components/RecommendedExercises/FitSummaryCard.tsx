import { Card, Button } from "@heroui/react";
import {
  goalItems,
  experienceItems,
  dayItems,
  sessionLengthItems,
} from "../../services/RecommendationExercises/filters";

type Props = {
  filters: {
    category: string;
    level: string;
    days_per_week: string;
    duration: string;
  };
  openModal: () => void;
};

const getLabel = (items: any[], key: string) => {
  return items.find((item) => item.key === key)?.label || "";
};

const FitSummaryCard = ({ filters, openModal }: Props) => {
  return (
    <Card className="w-full">
      <div className="m-2">
        <h1 className="text-xl font-bold">Your current fit</h1>

        <div className="mt-5 grid grid-cols-2 gap-6">
          <Card className="flex h-20 flex-col justify-between border border-gray-300 bg-[#F9FAFF] p-3 text-[#687083]">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Category</p>
              <p className="text-[16px] font-bold leading-none text-black">
                {getLabel(goalItems, filters.category)}
              </p>
            </div>
          </Card>

          <Card className="flex h-20 flex-col justify-between border border-gray-300 bg-[#F9FAFF] p-3 text-[#687083]">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Level</p>
              <p className="text-[16px] font-bold leading-none text-black">
                {getLabel(experienceItems, filters.level)}
              </p>
            </div>
          </Card>

          <Card className="flex h-20 flex-col justify-between border border-gray-300 bg-[#F9FAFF] p-3 text-[#687083]">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Days / Week</p>
              <p className="text-[16px] font-bold leading-none text-black">
                {getLabel(dayItems, filters.days_per_week)}
              </p>
            </div>
          </Card>

          <Card className="flex h-20 flex-col justify-between border border-gray-300 bg-[#F9FAFF] p-3 text-[#687083]">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Session Length</p>
              <p className="text-[16px] font-bold leading-none text-black">
                {getLabel(sessionLengthItems, filters.duration)}
              </p>
            </div>
          </Card>
        </div>

        <Button
          onPress={openModal}
          className="mt-5 h-12 w-full rounded-xl border border-gray-300 bg-white text-[16px] font-bold text-black"
        >
          Edit Filters
        </Button>
      </div>
    </Card>
  );
};

export default FitSummaryCard;