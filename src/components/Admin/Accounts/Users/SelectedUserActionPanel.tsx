import { Button, Card } from "@heroui/react";
import { ShieldAlert, UserCheck, UserX } from "lucide-react";
import { formatAccountStatusLabel, formatAdminDateTime } from "../../../../utils/Admin/adminFormatters";
import type {
    AccountStatus,
    AdminManagedUser,
} from "../../../../utils/Interfaces/Admin/adminAccountModeration";

type MutationMode = "suspend" | "deactivate" | "restore" | null;

interface SelectedUserActionPanelProps {
    selectedUser: AdminManagedUser | null;
    mutationMode: MutationMode;
    reason: string;
    submitting: boolean;
    actionError: string | null;
    onReasonChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

const SelectedUserActionPanel = ({
    selectedUser,
    mutationMode,
    reason,
    submitting,
    actionError,
    onReasonChange,
    onSubmit,
    onCancel,
}: SelectedUserActionPanelProps) => {
    const getActionIcon = () => {
        if (mutationMode === "suspend") {
            return <ShieldAlert className="h-4 w-4" />;
        }

        if (mutationMode === "deactivate") {
            return <UserX className="h-4 w-4" />;
        }

        return <UserCheck className="h-4 w-4" />;
    };

    const getActionTitle = () => {
        if (mutationMode === "suspend") return "Suspend account";
        if (mutationMode === "deactivate") return "Deactivate account";
        return "Restore account to active";
    };

    const getActionCopy = () => {
        if (mutationMode === "restore") {
            return "This will reactivate the account and clear the current policy reason.";
        }

        return "Provide the policy reason that should be stored with this account state change.";
    };

    return (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="space-y-4 p-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                        Action panel
                    </p>
                    <p className="mt-1 text-sm text-default-600">
                        Select an action from a user card to load the moderation form here.
                    </p>
                </div>

                {selectedUser && mutationMode ? (
                    <>
                        <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
                            <p className="text-sm font-semibold text-default-900">
                                {selectedUser.name || selectedUser.email}
                            </p>
                            <p className="mt-1 text-sm text-default-600">{selectedUser.email}</p>
                            <p className="mt-3 text-sm text-default-600">
                                Last updated: {formatAdminDateTime(selectedUser.updated_at)}
                            </p>
                            <p className="mt-1 text-sm text-default-600">
                                Current status:{" "}
                                <span className="font-medium text-default-800">
                                    {formatAccountStatusLabel(selectedUser.account_status as AccountStatus)}
                                </span>
                            </p>
                        </div>

                        <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-default-800">
                                {getActionIcon()}
                                {getActionTitle()}
                            </div>

                            <p className="mt-2 text-sm text-default-600">{getActionCopy()}</p>
                        </div>

                        {mutationMode !== "restore" ? (
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium text-default-700"
                                    htmlFor="accounts-reason"
                                >
                                    Reason
                                </label>
                                <textarea
                                    id="accounts-reason"
                                    value={reason}
                                    onChange={(event) => onReasonChange(event.target.value)}
                                    rows={5}
                                    className="w-full rounded-[18px] border border-default-200 px-4 py-3 text-sm outline-none transition focus:border-default-400"
                                    placeholder="Document the policy reason for this action"
                                />
                            </div>
                        ) : null}

                        {actionError ? (
                            <div className="rounded-[18px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                                {actionError}
                            </div>
                        ) : null}

                        <div className="flex flex-wrap gap-2">
                            <Button className={"bg-[#5B5EF4]"} onPress={onSubmit} isDisabled={submitting}>
                                {submitting ? "Saving..." : "Confirm action"}
                            </Button>
                            <Button className={"bg-[#5B5EF4]"} onPress={onCancel} isDisabled={submitting}>
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                        Select Suspend, Deactivate, or Restore Active on a card to open the enforcement form.
                    </div>
                )}
            </div>
        </Card>
    );
};

export default SelectedUserActionPanel;