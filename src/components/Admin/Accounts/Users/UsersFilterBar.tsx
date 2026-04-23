import { Button } from "@heroui/react";
import { Filter, RefreshCw, Search, Shield, UserRound, Users } from "lucide-react";

type AccountTypeFilter = "all" | "client" | "coach" | "admin";
type AccountStatusFilter = "all" | "active" | "suspended" | "deactivated";

interface UsersFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  accountTypeFilter: AccountTypeFilter;
  onAccountTypeChange: (value: AccountTypeFilter) => void;
  accountStatusFilter: AccountStatusFilter;
  onAccountStatusChange: (value: AccountStatusFilter) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  visibleCount: number;
  totalCount: number;
}

const accountTypeOptions: Array<{
  value: AccountTypeFilter;
  label: string;
  icon: React.ReactNode;
}> = [
    { value: "all", label: "All types", icon: <Users className="h-3.5 w-3.5" /> },
    { value: "client", label: "Clients", icon: <UserRound className="h-3.5 w-3.5" /> },
    { value: "coach", label: "Coaches", icon: <Users className="h-3.5 w-3.5" /> },
    { value: "admin", label: "Admins", icon: <Shield className="h-3.5 w-3.5" /> },
  ];

const accountStatusOptions: Array<{
  value: AccountStatusFilter;
  label: string;
}> = [
    { value: "all", label: "All standings" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "deactivated", label: "Deactivated" },
  ];

const pillBaseClassName =
  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition";

const getPillClassName = (selected: boolean) =>
  selected
    ? `${pillBaseClassName} border-default-900 bg-[#5B5EF4] text-white`
    : `${pillBaseClassName} border-default-200 bg-white text-default-700 hover:border-default-300 hover:bg-default-50`;

const UsersFilterBar = ({
  searchValue,
  onSearchChange,
  accountTypeFilter,
  onAccountTypeChange,
  accountStatusFilter,
  onAccountStatusChange,
  onRefresh,
  isRefreshing = false,
  visibleCount,
  totalCount,
}: UsersFilterBarProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-default-900">Users</h2>
          <p className="mt-1 text-sm text-default-600">
            Search and filter the full platform roster, then apply account actions
            from the moderation panel.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, email, phone, or reason"
              className="w-full rounded-[16px] border border-default-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-default-400"
            />
          </div>

          <Button onPress={onRefresh} className={"bg-[#5B5EF4]"}>
            <span className="inline-flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[20px] border border-default-200 bg-default-50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-default-700">
          <Filter className="h-4 w-4" />
          Filters
          <span className="ml-2 text-default-500">
            {visibleCount} of {totalCount} accounts shown
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-default-500">
              Account type
            </p>
            <div className="flex flex-wrap gap-2">
              {accountTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onAccountTypeChange(option.value)}
                  className={getPillClassName(accountTypeFilter === option.value)}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-default-500">
              Account standing
            </p>
            <div className="flex flex-wrap gap-2">
              {accountStatusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onAccountStatusChange(option.value)}
                  className={getPillClassName(accountStatusFilter === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { AccountTypeFilter, AccountStatusFilter };
export default UsersFilterBar;
