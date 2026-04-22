import { Button } from "@heroui/react";
import { RefreshCw } from "lucide-react";
import type { AdminReportBucket } from "../../../utils/Interfaces/Admin/adminReport";

interface ReportFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  bucket: AdminReportBucket;
  onBucketChange: (bucket: AdminReportBucket) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  visibleCount: number;
  totalCount: number;
}

const ReportFilterBar = ({
  searchValue,
  onSearchChange,
  onRefresh,
  isRefreshing,
  visibleCount,
  totalCount,
}: ReportFilterBarProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-default-900">Reports</h2>
          <p className="mt-1 text-sm text-default-600">
            Review platform conduct reports, search by title or description, and
            move reports out of the open queue after moderation.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, description, or status"
            className="min-w-[280px] rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
          />

          <Button className={"bg-[#5B5EF4]"} onPress={onRefresh} isDisabled={isRefreshing}>
            <span className="inline-flex items-center gap-2">
              <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              Refresh
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-default-600">
          {visibleCount} of {totalCount} report{totalCount === 1 ? "" : "s"} shown
        </p>
      </div>
    </div>
  );
};

export default ReportFilterBar;
