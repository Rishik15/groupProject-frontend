import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  approveCoachApplication,
  getCoachApplications,
  rejectCoachApplication,
} from "../../../services/Admin/adminCoachApplicationService";
import { formatAdminDateTime } from "../../../utils/Admin/adminFormatters";
import type {
  AdminCoachApplication,
  AdminCoachApplicationStatus,
} from "../../../utils/Interfaces/Admin/adminCoachApplication";
import ApplicationActionPanel from "./Applications/ApplicationActionPanel";
import ApplicationCard from "./Applications/ApplicationCard";
import ApplicationsFilterBar from "./Applications/ApplicationsFilterBar";

type ActionMode = "approve" | "reject" | null;

const CoachApplicationsTab = () => {
  const [applications, setApplications] = useState<AdminCoachApplication[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminCoachApplicationStatus>("pending");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedApplication, setSelectedApplication] =
    useState<AdminCoachApplication | null>(null);
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [adminAction, setAdminAction] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const actionIsOpen = Boolean(selectedApplication && actionMode);

  const loadApplications = async (
    nextStatus: AdminCoachApplicationStatus,
    signal?: AbortSignal,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCoachApplications(
        { status: nextStatus },
        signal,
      );
      setApplications(response.applications ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load coach applications.",
      );
      setApplications([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadApplications(statusFilter, controller.signal);

    return () => controller.abort();
  }, [statusFilter]);

  const filteredApplications = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return applications;
    }

    return applications.filter((application) => {
      const values = [
        application.name,
        application.email,
        application.coach_description,
        application.status,
        application.admin_action,
        ...(application.certifications ?? []),
      ];

      return values.some((value) => value?.toLowerCase().includes(query));
    });
  }, [applications, searchValue]);

  const openAction = (
    application: AdminCoachApplication,
    mode: Exclude<ActionMode, null>,
  ) => {
    setSelectedApplication(application);
    setActionMode(mode);
    setAdminAction(application.admin_action ?? "");
    setActionError(null);
  };

  const closeAction = () => {
    setSelectedApplication(null);
    setActionMode(null);
    setAdminAction("");
    setActionError(null);
  };

  const submitAction = async () => {
    if (!selectedApplication || !actionMode) return;

    if (!adminAction.trim()) {
      setActionError("An admin note is required for this decision.");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      if (actionMode === "approve") {
        await approveCoachApplication({
          application_id: selectedApplication.application_id,
          admin_action: adminAction.trim(),
        });
      } else {
        await rejectCoachApplication({
          application_id: selectedApplication.application_id,
          admin_action: adminAction.trim(),
        });
      }

      setApplications((current) =>
        current.filter(
          (application) =>
            application.application_id !== selectedApplication.application_id,
        ),
      );
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
          <ApplicationsFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusChange={(nextStatus) => {
              setStatusFilter(nextStatus);
              closeAction();
            }}
            onRefresh={() => void loadApplications(statusFilter)}
            isRefreshing={loading}
            visibleCount={filteredApplications.length}
            totalCount={applications.length}
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">
                Loading applications
              </p>
              <p className="mt-1 text-sm text-default-600">
                Pulling the latest coach application dataset for the selected
                status bucket.
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
                Unable to load coach applications
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
                    Application roster
                  </p>
                  <p className="mt-1 text-sm text-default-600">
                    {actionIsOpen
                      ? "The application roster is temporarily hidden while you finish the selected moderation action."
                      : "Pending applications show action buttons on the bottom edge; approved and rejected lists remain read-only."}
                  </p>
                </div>

                {actionIsOpen ? (
                  <Button
                    className={"bg-[#5B5EF4]"}
                    onPress={closeAction}
                    isDisabled={submitting}
                  >
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
                      {selectedApplication?.name || selectedApplication?.email}
                    </span>{" "}
                    to return to the application list.
                  </p>
                  <p className="mt-3">
                    Selected application timestamp:{" "}
                    {formatAdminDateTime(
                      selectedApplication?.appliedLabel ?? null,
                    )}
                  </p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No applications matched your current search and status
                  selection.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredApplications.map((application) => (
                    <ApplicationCard
                      key={application.application_id}
                      application={application}
                      onApprove={(targetApplication) =>
                        openAction(targetApplication, "approve")
                      }
                      onReject={(targetApplication) =>
                        openAction(targetApplication, "reject")
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <ApplicationActionPanel
            selectedApplication={selectedApplication}
            actionMode={actionMode}
            adminAction={adminAction}
            submitting={submitting}
            actionError={actionError}
            onAdminActionChange={setAdminAction}
            onSubmit={() => void submitAction()}
            onCancel={closeAction}
          />
        </div>
      )}
    </div>
  );
};

export default CoachApplicationsTab;
