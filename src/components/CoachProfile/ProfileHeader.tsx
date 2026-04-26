import { useEffect, useState } from "react";
import { StarRating } from "../LandingPage/CoachCard";
import {
  getClientCoachStatus,
  getContractStatus,
  requestCoachContract,
  type CoachProfile,
  type ContractStatus,
} from "../../services/contract/requestcontracts";
import RequestContractModal from "./RequestContractModal";

interface ProfileHeaderProps {
  coach: CoachProfile;
  coachId: number;
  mode?: "app" | "landing";
}
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({
  coach,
  mode = "app",
  coachId,
}: ProfileHeaderProps) {
  const [contractStatus, setContractStatus] = useState<ContractStatus | null>(
    null,
  );
  const [hasActiveCoach, setHasActiveCoach] = useState(false);
  const [activeCoachId, setActiveCoachId] = useState<number | null>(null);

  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "app") {
      setIsCheckingStatus(false);
      setContractStatus(null);
      setHasActiveCoach(false);
      setActiveCoachId(null);
      return;
    }

    const loadStatuses = async () => {
      try {
        setIsCheckingStatus(true);
        setError(null);

        const [selectedCoachStatus, clientCoachStatus] = await Promise.all([
          getContractStatus(coachId),
          getClientCoachStatus(),
        ]);

        setContractStatus(selectedCoachStatus);
        setHasActiveCoach(clientCoachStatus.has_active_contract);
        setActiveCoachId(clientCoachStatus.active_coach_id);
      } catch (err) {
        console.error("Failed to load contract status:", err);
        setError("Could not load contract status.");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (coachId) {
      void loadStatuses();
    }
  }, [coachId, mode]);

  const isActiveWithThisCoach = activeCoachId === coachId;

  const hasSomeOtherCoach = hasActiveCoach && activeCoachId !== coachId;

  const isPendingWithThisCoach = contractStatus === "pending";

  const canRequest = !hasActiveCoach && contractStatus === "none";

  const handleSubmitRequest = async (values: {
    training_reason: string;
    goals: string;
    preferred_schedule: string;
    notes: string;
  }) => {
    if (isSubmitting || !canRequest) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await requestCoachContract({
        coach_id: coachId,
        ...values,
      });

      setContractStatus("pending");
      setIsRequestModalOpen(false);
    } catch (err) {
      console.error("Failed to request coaching:", err);
      setError("Could not send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#5B5EF4]/10">
              <span className="text-sm font-semibold text-[#5B5EF4]">
                {coach.first_name?.[0]}
                {coach.last_name?.[0]}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-foreground">
                {coach.first_name} {coach.last_name}
              </h1>

              <p className="text-sm text-default-400">
                {coach.coach_description}
              </p>

              <div className="mt-1 flex items-center gap-3">
                <StarRating
                  rating={coach.avg_rating}
                  reviewCount={coach.reviews.length}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xl font-bold text-[#5B5EF4]">${coach.price}</p>
            <p className="text-xs text-default-400">per session</p>
          </div>
        </div>

        {mode === "app" &&
          (isCheckingStatus ? (
            <div className="h-10.5 rounded-xl bg-default-100 animate-pulse" />
          ) : (
            <div className="flex flex-col gap-3">
              {isActiveWithThisCoach ? (
                <>
                  <div className="flex w-full items-center justify-center rounded-xl bg-green-200 px-5 py-3 text-sm font-medium text-green-700">
                    Active Contract
                  </div>

                  <button
                    onClick={() => navigate("/client/chat")}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500"
                  >
                    Message Coach
                  </button>
                </>
              ) : hasSomeOtherCoach ? (
                <div></div>
              ) : isPendingWithThisCoach ? (
                <div className="flex w-full items-center justify-center rounded-xl bg-yellow-50 px-5 py-3 text-sm font-medium text-yellow-700">
                  Request pending
                </div>
              ) : canRequest ? (
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex w-full items-center justify-center rounded-xl bg-[#5B5EF4] px-5 py-3 text-sm font-medium text-white hover:bg-[#4B4EE4]"
                >
                  Request Coaching
                </button>
              ) : null}
            </div>
          ))}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <RequestContractModal
        isOpen={isRequestModalOpen}
        coach={coach}
        isSubmitting={isSubmitting}
        error={error}
        onClose={() => {
          if (!isSubmitting) setIsRequestModalOpen(false);
        }}
        onSubmit={handleSubmitRequest}
      />
    </>
  );
}
