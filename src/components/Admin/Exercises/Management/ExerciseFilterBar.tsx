import { Button } from "@heroui/react";
import { Plus, RefreshCw } from "lucide-react";

interface ExerciseFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  isRefreshing: boolean;
  visibleCount: number;
  totalCount: number;
}

const ExerciseFilterBar = ({
  searchValue,
  onSearchChange,
  onRefresh,
  onCreate,
  isRefreshing,
  visibleCount,
  totalCount,
}: ExerciseFilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-default-900">Exercise management</h2>
        <p className="mt-1 text-sm text-default-600">
          Search the exercise database, create new exercises, or select a row to edit or delete.
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-default-500">
          {visibleCount} of {totalCount} exercise{totalCount === 1 ? "" : "s"} shown
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:min-w-[360px]">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by exercise name, equipment, status, or creator"
          className="rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
        />

        <div className="flex flex-wrap gap-2">
          <Button onPress={onRefresh} isDisabled={isRefreshing}>
            <span className="inline-flex items-center gap-2">
              <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              Refresh
            </span>
          </Button>

          <Button onPress={onCreate}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Exercise
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseFilterBar;
