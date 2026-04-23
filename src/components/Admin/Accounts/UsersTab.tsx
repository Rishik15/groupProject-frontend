import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  deactivateUser,
  getUsers,
  suspendUser,
  updateUserStatus,
} from "../../../services/Admin/adminAccountModerationService";
import { formatAdminDateTime } from "../../../utils/Admin/adminFormatters";
import type {
  AccountStatus,
  AdminManagedUser,
} from "../../../utils/Interfaces/Admin/adminAccountModeration";
import UserAccountCard from "./Users/UserAccountCard";
import UsersFilterBar from "./Users/UsersFilterBar";
import SelectedUserActionPanel from "./Users/SelectedUserActionPanel";

type MutationMode = "suspend" | "deactivate" | "restore" | null;
type AccountTypeFilter = "all" | "client" | "coach" | "admin";
type AccountStatusFilter = "all" | AccountStatus;

const UsersTab = () => {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] =
    useState<AccountTypeFilter>("all");
  const [accountStatusFilter, setAccountStatusFilter] =
    useState<AccountStatusFilter>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<AdminManagedUser | null>(null);
  const [mutationMode, setMutationMode] = useState<MutationMode>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const actionIsOpen = Boolean(selectedUser && mutationMode);

  const loadUsers = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUsers(signal);
      setUsers(response.users ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load users.");
      setUsers([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadUsers(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.name,
          user.email,
          user.first_name,
          user.last_name,
          user.phone_number,
          user.account_status,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesType =
        accountTypeFilter === "all"
          ? true
          : accountTypeFilter === "coach"
            ? user.is_coach
            : accountTypeFilter === "admin"
              ? user.is_admin
              : !user.is_coach && !user.is_admin;

      const matchesStatus =
        accountStatusFilter === "all"
          ? true
          : user.account_status === accountStatusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, searchValue, accountTypeFilter, accountStatusFilter]);

  const openAction = (
    user: AdminManagedUser,
    mode: Exclude<MutationMode, null>,
  ) => {
    setSelectedUser(user);
    setMutationMode(mode);
    setActionError(null);
    setReason(mode === "restore" ? "" : user.suspension_reason ?? "");
  };

  const closeAction = () => {
    setSelectedUser(null);
    setMutationMode(null);
    setReason("");
    setActionError(null);
  };

  const applyUserUpdate = (updatedUser: {
    user_id: number;
    account_status: AccountStatus;
    suspension_reason: string | null;
  }) => {
    setUsers((current) =>
      current.map((user) =>
        user.user_id === updatedUser.user_id
          ? {
            ...user,
            account_status: updatedUser.account_status,
            suspension_reason: updatedUser.suspension_reason,
            updated_at: new Date().toISOString(),
          }
          : user,
      ),
    );
  };

  const submitAction = async () => {
    if (!selectedUser || !mutationMode) return;

    if (
      (mutationMode === "suspend" || mutationMode === "deactivate") &&
      !reason.trim()
    ) {
      setActionError("A reason is required for this action.");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      if (mutationMode === "suspend") {
        const response = await suspendUser({
          user_id: selectedUser.user_id,
          suspension_reason: reason.trim(),
        });
        applyUserUpdate(response.user);
      }

      if (mutationMode === "deactivate") {
        const response = await deactivateUser({
          user_id: selectedUser.user_id,
          suspension_reason: reason.trim(),
        });
        applyUserUpdate(response.user);
      }

      if (mutationMode === "restore") {
        const response = await updateUserStatus({
          user_id: selectedUser.user_id,
          account_status: "active",
          suspension_reason: null,
        });
        applyUserUpdate(response.user);
      }

      closeAction();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
        <div className="p-6">
          <UsersFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            accountTypeFilter={accountTypeFilter}
            onAccountTypeChange={setAccountTypeFilter}
            accountStatusFilter={accountStatusFilter}
            onAccountStatusChange={setAccountStatusFilter}
            onRefresh={() => void loadUsers()}
            isRefreshing={loading}
            visibleCount={filteredUsers.length}
            totalCount={users.length}
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">Loading users</p>
              <p className="mt-1 text-sm text-default-600">
                Pulling the latest account roster and status data.
              </p>
            </div>
            <RefreshCw className="h-5 w-5 animate-spin text-default-500" />
          </div>
        </Card>
      ) : error ? (
        <Card className="rounded-[24px] border border-danger/20 bg-white shadow-sm">
          <div className="flex items-start gap-3 p-6">
            <div className="rounded-full bg-danger/10 p-2 text-danger">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-default-900">
                Unable to load users
              </p>
              <p className="mt-1 text-sm text-default-600">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                    User roster
                  </p>
                  <p className="mt-1 text-sm text-default-600">
                    {actionIsOpen
                      ? "The roster is temporarily hidden while you finish the selected enforcement action."
                      : "Account cards stay compact here while actions live on the bottom edge."}
                  </p>
                </div>

                {actionIsOpen ? (
                  <Button className={"bg-[#5B5EF4]"} onPress={closeAction} isDisabled={submitting}>
                    Back to roster
                  </Button>
                ) : null}
              </div>

              {actionIsOpen ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  <p className="font-medium text-default-800">
                    Roster paused for active moderation
                  </p>
                  <p className="mt-2">
                    Finish or cancel the current action on{" "}
                    <span className="font-medium text-default-800">
                      {selectedUser?.name || selectedUser?.email}
                    </span>{" "}
                    to return to the full roster.
                  </p>
                  <p className="mt-3">
                    Selected on: {formatAdminDateTime(selectedUser?.updated_at ?? null)}
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No users matched your current search and filter combination.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredUsers.map((user) => (
                    <UserAccountCard
                      key={user.user_id}
                      user={user}
                      onSuspend={(targetUser) => openAction(targetUser, "suspend")}
                      onDeactivate={(targetUser) =>
                        openAction(targetUser, "deactivate")
                      }
                      onRestore={(targetUser) => openAction(targetUser, "restore")}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <SelectedUserActionPanel
            selectedUser={selectedUser}
            mutationMode={mutationMode}
            reason={reason}
            submitting={submitting}
            actionError={actionError}
            onReasonChange={setReason}
            onSubmit={() => void submitAction()}
            onCancel={closeAction}
          />
        </div>
      )}
    </div>
  );
};

export default UsersTab;