import { Card, Button, Chip } from "@heroui/react";
import { CalendarDays, DollarSign, UserRoundX, X, Check } from "lucide-react";
import type {
  CoachContract,
  CoachContractTabKey,
} from "../../utils/Interfaces/Contracts/coachContracts";
import {
  formatCurrency,
  formatDisplayDate,
  getClientFullName,
  getContractDurationLabel,
  getInitials,
} from "../../utils/coachContracts/coachContractHelpers";

interface CoachContractCardProps {
  contract: CoachContract;
  view: CoachContractTabKey;
  isLoading?: boolean;
  onAccept?: (contractId: number) => void;
  onDecline?: (contractId: number) => void;
  onTerminate?: (contractId: number) => void;
}

const CoachContractCard = ({
  contract,
  view,
  isLoading = false,
  onAccept,
  onDecline,
  onTerminate,
}: CoachContractCardProps) => {
  const clientName = getClientFullName(contract);
  const initials = getInitials(contract);
  const price = formatCurrency(contract.agreed_price);
  const durationLabel = getContractDurationLabel(
    contract.start_date,
    contract.end_date,
  );

  return (
    <Card className="rounded-3xl border border-[#E7E7EE] shadow-none">
      <div className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F1F1FF]">
              <span
                className="font-medium"
                style={{ fontSize: "16px", color: "#5E5EF4" }}
              >
                {initials}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className="font-semibold leading-tight"
                  style={{ fontSize: "17px", color: "#0F0F14" }}
                >
                  {clientName}
                </h2>

                {view === "pending" && (
                  <Chip
                    variant="soft"
                    className="border border-[#F2C86B] bg-[#FFF8E8] px-2 py-0 text-[#C98A00]"
                    style={{ fontSize: "12px" }}
                  >
                    Pending
                  </Chip>
                )}

                {view === "active" && (
                  <Chip
                    variant="soft"
                    className="border border-[#81D9A3] bg-[#EBFFF1] px-2 py-0 text-[#18A34A]"
                    style={{ fontSize: "12px" }}
                  >
                    Active
                  </Chip>
                )}

                {view === "history" && (
                  <Chip
                    variant="soft"
                    className="border border-[#E7E7EE] bg-[#F8F8FB] px-2 py-0 text-[#72728A]"
                    style={{ fontSize: "12px" }}
                  >
                    Closed
                  </Chip>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <DollarSign size={16} color="#72728A" />
                  <span style={{ fontSize: "12px", color: "#72728A" }}>
                    {price}/session
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <CalendarDays size={16} color="#72728A" />
                  <span style={{ fontSize: "12px", color: "#72728A" }}>
                    {durationLabel}
                  </span>
                </div>
              </div>

              {contract.contract_text && (
                <p
                  className="max-w-3xl line-clamp-2 leading-snug"
                  style={{ fontSize: "12px", color: "#0F0F14" }}
                >
                  {contract.contract_text}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <span style={{ fontSize: "11px", color: "#72728A" }}>
                  Requested: {formatDisplayDate(contract.created_at)}
                </span>

                {view === "active" && (
                  <span style={{ fontSize: "11px", color: "#72728A" }}>
                    Accepted: {formatDisplayDate(contract.start_date)}
                  </span>
                )}

                {view === "history" && (
                  <span style={{ fontSize: "11px", color: "#72728A" }}>
                    Ended: {formatDisplayDate(contract.end_date)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {view === "pending" && (
            <div className="flex shrink-0 flex-col gap-2 lg:min-w-37.5">
              <Button
                className="min-h-0 bg-[#5E5EF4] px-4 py-2 text-white"
                style={{ fontSize: "12px" }}
                isDisabled={isLoading}
                onPress={() => onAccept?.(contract.contract_id)}
              >
                <span className="flex items-center gap-1.5">
                  <Check size={16} />
                  Accept
                </span>
              </Button>

              <Button
                variant="outline"
                className="min-h-0 border-[#F0B6B6] px-4 py-2 text-[#E03B3B]"
                style={{ fontSize: "12px" }}
                isDisabled={isLoading}
                onPress={() => onDecline?.(contract.contract_id)}
              >
                <span className="flex items-center gap-1.5">
                  <X size={16} />
                  Decline
                </span>
              </Button>
            </div>
          )}

          {view === "active" && (
            <div className="flex shrink-0 lg:min-w-42.5">
              <Button
                variant="outline"
                className="min-h-0 border-[#F0B6B6] px-4 py-2 text-[#E03B3B]"
                style={{ fontSize: "12px" }}
                isDisabled={isLoading}
                onPress={() => onTerminate?.(contract.contract_id)}
              >
                <span className="flex items-center gap-1.5">
                  <UserRoundX size={16} />
                  Terminate
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CoachContractCard;
