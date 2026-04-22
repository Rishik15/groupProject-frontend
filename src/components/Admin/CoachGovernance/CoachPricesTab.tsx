import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  approveCoachPriceRequest,
  getPendingCoachPriceRequests,
  rejectCoachPriceRequest,
} from "../../../services/Admin/adminCoachPriceService";
import { formatAdminDateTime } from "../../../utils/Admin/adminFormatters";
import type { AdminCoachPriceRequest } from "../../../utils/Interfaces/Admin/adminCoachPrice";
import PriceActionPanel from "./Prices/PriceActionPanel";
import PriceRequestCard from "./Prices/PriceRequestCard";

type PriceActionMode = "approve" | "reject" | null;

const CoachPricesTab = () => {
  const [requests, setRequests] = useState<AdminCoachPriceRequest[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] =
    useState<AdminCoachPriceRequest | null>(null);
  const [actionMode, setActionMode] = useState<PriceActionMode>(null);
  const [adminAction, setAdminAction] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const actionIsOpen = Boolean(selectedRequest && actionMode);

  const loadRequests = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPendingCoachPriceRequests(signal);
      setRequests(response.requests ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(
        err instanceof Error ? err.message : "Failed to load coach price requests.",
      );
      setRequests([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadRequests(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return requests;

    return requests.filter((request) => {
      const values = [
        request.coach_name,
        String(request.coach_id),
        String(request.current_price),
        String(request.proposed_price),
        request.status,
      ];

      return values.some((value) => value.toLowerCase().includes(query));
    });
  }, [requests, searchValue]);

  const openAction = (
    request: AdminCoachPriceRequest,
    mode: Exclude<PriceActionMode, null>,
  ) => {
    setSelectedRequest(request);
    setActionMode(mode);
    setAdminAction("");
    setActionError(null);
  };

  const closeAction = () => {
    setSelectedRequest(null);
    setActionMode(null);
    setAdminAction("");
    setActionError(null);
  };

  const submitAction = async () => {
    if (!selectedRequest || !actionMode) return;

    if (!adminAction.trim()) {
      setActionError("An admin note is required for this decision.");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      if (actionMode === "approve") {
        await approveCoachPriceRequest({
          request_id: selectedRequest.request_id,
          admin_action: adminAction.trim(),
        });
      } else {
        await rejectCoachPriceRequest({
          request_id: selectedRequest.request_id,
          admin_action: adminAction.trim(),
        });
      }

      setRequests((current) =>
        current.filter((request) => request.request_id !== selectedRequest.request_id),
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
        <div className="flex flex-col gap-4 p-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-default-900">Coach price requests</h2>
            <p className="mt-1 text-sm text-default-600">
              Review pending price changes, search by coach identity or amount, and use the side panel to approve or reject.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[340px]">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by coach name, id, or price"
              className="rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
            />

            <div className="flex flex-wrap gap-2">
              <Button onPress={() => void loadRequests()} isDisabled={loading}>
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                  Refresh
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">
                Loading price requests
              </p>
              <p className="mt-1 text-sm text-default-600">
                Pulling the current pending coach price moderation queue.
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
                Unable to load coach price requests
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
                    Pending request roster
                  </p>
                  <p className="mt-1 text-sm text-default-600">
                    {actionIsOpen
                      ? "The request roster is temporarily hidden while you finish the selected price moderation action."
                      : `${filteredRequests.length} of ${requests.length} pending request${requests.length === 1 ? "" : "s"} shown.`}
                  </p>
                </div>

                {actionIsOpen ? (
                  <Button onPress={closeAction} isDisabled={submitting}>
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
                      {selectedRequest?.coach_name}
                    </span>{" "}
                    to return to the pending request list.
                  </p>
                  <p className="mt-3">
                    Selected request timestamp:{" "}
                    {formatAdminDateTime(selectedRequest?.created_at ?? null)}
                  </p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No price requests matched your current search.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredRequests.map((request) => (
                    <PriceRequestCard
                      key={request.request_id}
                      request={request}
                      onApprove={(targetRequest) => openAction(targetRequest, "approve")}
                      onReject={(targetRequest) => openAction(targetRequest, "reject")}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <PriceActionPanel
            selectedRequest={selectedRequest}
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

export default CoachPricesTab;
