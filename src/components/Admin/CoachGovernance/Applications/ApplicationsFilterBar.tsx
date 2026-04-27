import { Button } from "@heroui/react";
import { RefreshCw } from "lucide-react";
import type { AdminCoachApplicationStatus } from "../../../../utils/Interfaces/Admin/adminCoachApplication";

interface ApplicationsFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: AdminCoachApplicationStatus;
  onStatusChange: (value: AdminCoachApplicationStatus) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  visibleCount: number;
  totalCount: number;
}

const statusOptions: AdminCoachApplicationStatus[] = [
  "pending",
  "approved",
  "rejected",
];

const formatStatusButtonLabel = (status: AdminCoachApplicationStatus) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

const ApplicationsFilterBar = ({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onRefresh,
  isRefreshing,
  visibleCount,
  totalCount,
}: ApplicationsFilterBarProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-default-900">
            Coach applications
          </h2>
          <p className="mt-1 text-sm text-default-600">
            Review applicants by status, search their profile details, and use
            the side panel to approve or reject a selected application.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[340px]">
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, email, certification, or description"
            className="rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
          />

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status}
                onPress={() => onStatusChange(status)}
                className={
                  statusFilter === status
                    ? "border border-default-300 bg-[#5B5EF4] text-white"
                    : "bg-[#5B5EF4] text-white"
                }
              >
                {formatStatusButtonLabel(status)}
              </Button>
            ))}

            <Button
              className={"bg-[#5B5EF4]"}
              onPress={onRefresh}
              isDisabled={isRefreshing}
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw
                  className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                />
                Refresh
              </span>
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-default-500">
        {visibleCount} of {totalCount} application{totalCount === 1 ? "" : "s"}{" "}
        shown.
      </p>
    </div>
  );
};

export default ApplicationsFilterBar;
