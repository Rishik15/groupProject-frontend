import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import {
  getMyCoachPriceUpdates,
  type CoachPriceUpdate,
} from "../../../services/Setting/coachPriceUpdates";

const formatDate = (value: string | null) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusInfo = (status: string) => {
  if (status === "approved") {
    return {
      label: "Approved",
      className: "bg-green-50 text-green-700",
      icon: <CheckCircle className="h-4 w-4" />,
    };
  }

  if (status === "rejected") {
    return {
      label: "Rejected",
      className: "bg-red-50 text-red-700",
      icon: <XCircle className="h-4 w-4" />,
    };
  }

  return {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700",
    icon: <Clock className="h-4 w-4" />,
  };
};

export default function ProfileUpdatesTab() {
  const [updates, setUpdates] = useState<CoachPriceUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        setLoading(true);
        const data = await getMyCoachPriceUpdates();
        setUpdates(data);
      } catch (err) {
        console.error("Failed to load coach profile updates", err);
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    loadUpdates();
  }, []);

  return (
    <Card className="w-165 rounded-xl border border-[#E8E8EF] bg-white">
      <Card.Header className="border-b border-[#E8E8EF] px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-[#0F0F14]">
            Profile Updates
          </h2>
          <p className="mt-1 text-sm text-[#72728A]">
            Track your coach price change requests and admin decisions.
          </p>
        </div>
      </Card.Header>

      <Card.Content className="flex flex-col gap-4 px-6 py-6">
        {loading ? (
          <p className="text-sm text-[#72728A]">Loading profile updates...</p>
        ) : updates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D9DBE3] bg-[#FAFAFC] px-4 py-8 text-center">
            <p className="text-sm font-medium text-[#0F0F14]">
              No profile updates yet
            </p>
            <p className="mt-1 text-xs text-[#72728A]">
              Price change requests will show up here after you submit them.
            </p>
          </div>
        ) : (
          updates.map((update) => {
            const statusInfo = getStatusInfo(update.status);

            return (
              <div
                key={update.request_id}
                className="rounded-xl border border-[#E8E8EF] bg-[#FAFAFC] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F0F14]">
                      Price Change Request
                    </p>

                    <p className="mt-1 text-xs text-[#72728A]">
                      Submitted {formatDate(update.created_at)}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-[#72728A]">Current Price</p>
                    <p className="mt-1 text-lg font-semibold text-[#0F0F14]">
                      ${update.current_price?.toFixed(2) ?? "0.00"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-[#72728A]">Requested Price</p>
                    <p className="mt-1 text-lg font-semibold text-[#0F0F14]">
                      ${update.proposed_price?.toFixed(2) ?? "0.00"}
                    </p>
                  </div>
                </div>

                {update.admin_action && (
                  <div className="mt-4 rounded-xl border border-[#E8E8EF] bg-white p-3">
                    <p className="text-xs font-medium text-[#72728A]">
                      Admin Response
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-[#0F0F14]">
                      {update.admin_action}
                    </p>
                  </div>
                )}

                {update.reviewed_at && (
                  <p className="mt-3 text-xs text-[#72728A]">
                    Reviewed {formatDate(update.reviewed_at)}
                  </p>
                )}
              </div>
            );
          })
        )}
      </Card.Content>
    </Card>
  );
}
