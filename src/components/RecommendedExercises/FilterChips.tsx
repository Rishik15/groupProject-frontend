import { Card } from "@heroui/react";
import {
  goalItems,
  experienceItems,
  dayItems,
  sessionLengthItems,
} from "../../services/RecommendationExercises/filters";
import type { Filters } from "../../services/RecommendationExercises/types";

type Props = {
  filters: {
    category: string;
    level: string;
    days_per_week: string;
    duration: string;
  };
};

const getLabel = (items: any[], key: string) => {
  return items.find((item) => item.key === key)?.label || "";
};
const isFiltersEmpty = (filters: Filters) => {
  return (
    !filters.category &&
    !filters.level &&
    !filters.days_per_week &&
    !filters.duration
  );
};
const FilterChips = ({ filters }: Props) => {
  return (
    <Card className="mt-10 rounded-3xl">
      <div className="flex flex-row gap-4 p-3">
        <div className="w-fit rounded-3xl border border-[#D4D1FF] bg-[#EFEEFF] p-3 font-bold text-indigo-500">
          Best Match
        </div>

        {!isFiltersEmpty(filters) && (
          <>
            <div className="w-fit rounded-3xl border border-gray-300 bg-white p-3 px-4 font-bold">
              {getLabel(goalItems, filters.category)}
            </div>

            <div className="w-fit rounded-3xl border border-gray-300 bg-white p-3 px-4 font-bold">
              {getLabel(dayItems, filters.days_per_week)}
            </div>

            <div className="w-fit rounded-3xl border border-gray-300 bg-white p-3 px-4 font-bold">
              {getLabel(experienceItems, filters.level)}
            </div>

            <div className="w-fit rounded-3xl border border-gray-300 bg-white p-3 px-4 font-bold">
              {getLabel(sessionLengthItems, filters.duration)}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
export default FilterChips;