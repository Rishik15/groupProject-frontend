import { Button } from "@heroui/react";
import { CheckCircle2, TrendingUp, XCircle } from "lucide-react";
import {
  formatAdminCurrency,
  formatAdminDateTime,
  formatCoachPriceStatusLabel,
} from "../../../../utils/Admin/adminFormatters";
import type { AdminCoachPriceRequest } from "../../../../utils/Interfaces/Admin/adminCoachPrice";

interface PriceRequestCardProps {
  request: AdminCoachPriceRequest;
  onApprove: (request: AdminCoachPriceRequest) => void;
  onReject: (request: AdminCoachPriceRequest) => void;
}

const PriceRequestCard = ({
  request,
  onApprove,
  onReject,
}: PriceRequestCardProps) => {
  const delta =
    request.current_price !== null && request.current_price !== undefined
      ? request.proposed_price - request.current_price
      : null;

  return (
    <div className="rounded-[20px] border border-default-200 bg-default-50 p-5">
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-default-900">
              {request.coach_name}
            </h3>
            <p className="text-sm text-default-600">
              Coach ID: {request.coach_id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-default-600">
            <span className="rounded-full border border-default-200 bg-white px-3 py-1">
              Current: {formatAdminCurrency(request.current_price)}
            </span>
            <span className="rounded-full border border-default-200 bg-white px-3 py-1">
              Proposed: {formatAdminCurrency(request.proposed_price)}
            </span>
            <span className="rounded-full border border-default-200 bg-white px-3 py-1">
              Status: {formatCoachPriceStatusLabel(request.status)}
            </span>
          </div>

          <div className="space-y-1 text-sm text-default-600">
            <p>
              <span className="font-medium text-default-800">Submitted:</span>{" "}
              {formatAdminDateTime(request.created_at)}
            </p>
            <p>
              <span className="font-medium text-default-800">Change:</span>{" "}
              {delta === null ? "—" : formatAdminCurrency(delta)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-default-200 pt-4">
          <Button onPress={() => onApprove(request)}>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </span>
          </Button>
          <Button onPress={() => onReject(request)}>
            <span className="inline-flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Reject
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceRequestCard;
