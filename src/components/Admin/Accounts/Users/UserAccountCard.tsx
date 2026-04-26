import { Button } from "@heroui/react";
import { ShieldAlert, UserCheck, UserX } from "lucide-react";
import { formatAccountStatusLabel, formatBooleanLabel } from "../../../../utils/Admin/adminFormatters";
import type { AdminManagedUser } from "../../../../utils/Interfaces/Admin/adminAccountModeration";

interface UserAccountCardProps {
  user: AdminManagedUser;
  onSuspend: (user: AdminManagedUser) => void;
  onDeactivate: (user: AdminManagedUser) => void;
  onRestore: (user: AdminManagedUser) => void;
}

const UserAccountCard = ({
  user,
  onSuspend,
  onDeactivate,
  onRestore,
}: UserAccountCardProps) => {
  const showRestore = user.account_status === "suspended" || user.account_status === "deactivated";

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-default-200 bg-default-50 p-3">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-semibold text-default-900">
              {user.name || `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Unknown user"}
            </h3>
            <p className="truncate text-[13.125px] text-default-600">{user.email}</p>
          </div>

          <span className="shrink-0 rounded-full border border-default-200 bg-white px-3 py-1 text-xs font-medium text-default-700">
            {formatAccountStatusLabel(user.account_status)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-[13.125px] text-default-600">
          <span className="rounded-full border border-default-200 bg-white px-2.5 py-1">
            Coach: {formatBooleanLabel(user.is_coach)}
          </span>
          <span className="rounded-full border border-default-200 bg-white px-2.5 py-1">
            Admin: {formatBooleanLabel(user.is_admin)}
          </span>
          {user.phone_number ? (
            <span className="rounded-full border border-default-200 bg-white px-2.5 py-1">
              {user.phone_number}
            </span>
          ) : null}
        </div>

        {user.suspension_reason ? (
          <p className="line-clamp-2 text-sm leading-6 text-default-600">
            <span className="font-medium text-default-800">Reason:</span> {user.suspension_reason}
          </p>
        ) : (
          <p className="text-sm text-default-500">No policy reason recorded.</p>
        )}
      </div>

      <div className="mt-auto border-t border-default-200 pt-4">
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <Button className={"bg-[#5B5EF4]"} onPress={() => onSuspend(user)}>
            <span className="inline-flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Suspend
            </span>
          </Button>

          <Button className={"bg-[#5B5EF4]"} onPress={() => onDeactivate(user)}>
            <span className="inline-flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Deactivate
            </span>
          </Button>

          {showRestore ? (
            <Button className={"bg-[#5B5EF4]"} onPress={() => onRestore(user)}>
              <span className="inline-flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Restore Active
              </span>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserAccountCard;
