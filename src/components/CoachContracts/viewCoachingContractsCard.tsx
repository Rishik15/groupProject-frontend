import { Card, Button, Chip } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight, CircleAlert } from "lucide-react";

interface ViewCoachingContractsCardProps {
  pendingCount?: number;
}

const ViewCoachingContractsCard = ({
  pendingCount = 0,
}: ViewCoachingContractsCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="rounded-3xl border border-[#DCDCF4] shadow-none">
      <div className="px-4 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                <FileText size={28} color="#5E5EF4" />
              </div>

              <div className="space-y-1">
                <h2
                  className="font-semibold leading-none"
                  style={{ fontSize: "18.75px", color: "#0F0F14" }}
                >
                  Coaching Contracts
                </h2>

                <p
                  className="leading-normal"
                  style={{ fontSize: "13.125px", color: "#72728A" }}
                >
                  Manage client relationships and contract requests
                </p>
              </div>
            </div>

            <Chip
              variant="soft"
              className="border border-[#F2C86B] bg-[#FFF8E8] text-[#C98A00]"
              style={{ fontSize: "13.125px" }}
            >
              {pendingCount} Pending
            </Chip>
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-[#DCDCF4] bg-[#F7F7FF] px-4 py-3">
              <CircleAlert size={18} color="#5E5EF4" />
              <p
                className="leading-normal"
                style={{ fontSize: "13.125px", color: "#72728A" }}
              >
                You have {pendingCount} pending contract request
                {pendingCount === 1 ? "" : "s"} awaiting review.
              </p>
            </div>
          )}

          <Button
            className="w-full rounded-xl bg-[#5E5EF4] text-white font-medium"
            style={{ fontSize: "13.125px" }}
            onPress={() => navigate("/coach/contracts")}
          >
            <span className="flex items-center gap-2">
              View Coaching Contracts
              <ArrowRight size={18} />
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ViewCoachingContractsCard;
