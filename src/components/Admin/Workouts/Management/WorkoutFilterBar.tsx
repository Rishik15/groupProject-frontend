import { Button } from "@heroui/react";
import { RefreshCw } from "lucide-react";

export type WorkoutVisibilityFilter = "all" | "public" | "private";

interface WorkoutFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  visibilityFilter: WorkoutVisibilityFilter;
  onVisibilityFilterChange: (value: WorkoutVisibilityFilter) => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  visibleCount: number;
  totalCount: number;
}

const WorkoutFilterBar = ({
  searchValue,
  onSearchChange,
  visibilityFilter,
  onVisibilityFilterChange,
  onOpenCreate,
  onRefresh,
  isRefreshing,
  visibleCount,
  totalCount,
}: WorkoutFilterBarProps) => {
  const filters: WorkoutVisibilityFilter[] = ["all", "public", "private"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-default-900">
            Workout management
          </h2>
          <p className="mt-1 text-sm text-default-600">
            Manage public and private workout plans, update metadata, and edit
            first-day exercises using the current backend support.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button className={"bg-[#5B5EF4]"} onPress={onOpenCreate}>Create workout</Button>
          <Button className={"bg-[#5B5EF4]"} onPress={onRefresh}>
            <span className="inline-flex items-center gap-2">
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by workout name, description, or author id"
          className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400 xl:max-w-lg"
        />

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = visibilityFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => onVisibilityFilterChange(filter)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${isActive
                    ? "border-default-900 bg-[#5B5EF4] text-white"
                    : "border-default-200 bg-white text-default-700 hover:border-default-300"
                    }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-default-500">
            {visibleCount} of {totalCount} workout
            {totalCount === 1 ? "" : "s"} shown
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutFilterBar;
