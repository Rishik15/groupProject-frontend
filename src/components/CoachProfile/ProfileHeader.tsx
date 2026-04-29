import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarRating } from "../LandingPage/CoachCard";
import {
  getClientCoachStatus,
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

export default function ProfileHeader({
  coach,
  mode = "app",
  coachId,
}: ProfileHeaderProps) {
  const [contractStatus, setContractStatus] = useState<ContractStatus | null>(
    null,
  );
  const [hasActiveContract, setHasActiveContract] = useState(false);
  const [activeCoachId, setActiveCoachId] = useState<number | null>(null);
  const [activeCoachName, setActiveCoachName] = useState<string | null>(null);

  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("[ProfileHeader] mounted/changed");
    console.log("[ProfileHeader] mode:", mode);
    console.log("[ProfileHeader] coachId:", coachId);
    console.log("[ProfileHeader] coach:", coach);

    if (mode !== "app") {
      console.log(
        "[ProfileHeader] landing mode, skipping contract status check",
      );

      setIsCheckingStatus(false);
      setContractStatus(null);
      setHasActiveContract(false);
      setActiveCoachId(null);
      setActiveCoachName(null);
      return;
    }

    const loadStatus = async () => {
      try {
        setIsCheckingStatus(true);
        setError(null);

        console.log(
          "[ProfileHeader] loading client coach status for coachId:",
          coachId,
        );

        const data = await getClientCoachStatus(coachId);

        console.log("[ProfileHeader] client coach status data:", data);

        const normalizedActiveCoachId =
          data.active_coach_id === null ? null : Number(data.active_coach_id);

        console.log(
          "[ProfileHeader] normalized active coach id:",
          normalizedActiveCoachId,
        );
        console.log("[ProfileHeader] selected coach id:", Number(coachId));
        console.log(
          "[ProfileHeader] active id equals selected id:",
          normalizedActiveCoachId === Number(coachId),
        );

        setContractStatus(data.status);
        setHasActiveContract(Boolean(data.has_active_contract));
        setActiveCoachId(normalizedActiveCoachId);
        setActiveCoachName(data.active_coach_name);
      } catch (err) {
        console.error("[ProfileHeader] failed to load contract status:", err);
        setError("Could not load contract status.");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (coachId) {
      void loadStatus();
    }
  }, [coachId, mode]);

  const selectedCoachId = Number(coachId);

  const isActiveWithThisCoach =
    hasActiveContract &&
    activeCoachId !== null &&
    Number(activeCoachId) === selectedCoachId;

  const hasSomeOtherCoach =
    hasActiveContract &&
    activeCoachId !== null &&
    Number(activeCoachId) !== selectedCoachId;

  const isPendingWithThisCoach = contractStatus === "pending";

  const canRequest = !hasActiveContract && contractStatus === "none";

  console.log("[ProfileHeader render] contractStatus:", contractStatus);
  console.log("[ProfileHeader render] hasActiveContract:", hasActiveContract);
  console.log("[ProfileHeader render] activeCoachId:", activeCoachId);
  console.log("[ProfileHeader render] activeCoachName:", activeCoachName);
  console.log("[ProfileHeader render] selectedCoachId:", selectedCoachId);
  console.log(
    "[ProfileHeader render] isActiveWithThisCoach:",
    isActiveWithThisCoach,
  );
  console.log("[ProfileHeader render] hasSomeOtherCoach:", hasSomeOtherCoach);
  console.log(
    "[ProfileHeader render] isPendingWithThisCoach:",
    isPendingWithThisCoach,
  );
  console.log("[ProfileHeader render] canRequest:", canRequest);

  const handleSubmitRequest = async (values: {
    training_reason: string;
    goals: string;
    preferred_schedule: string;
    notes: string;
  }) => {
    console.log("[ProfileHeader] submit request clicked");
    console.log("[ProfileHeader] isSubmitting:", isSubmitting);
    console.log("[ProfileHeader] canRequest:", canRequest);
    console.log("[ProfileHeader] form values:", values);

    if (isSubmitting || !canRequest) {
      console.log("[ProfileHeader] request blocked");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await requestCoachContract({
        coach_id: selectedCoachId,
        ...values,
      });

      console.log("[ProfileHeader] request successful, setting status pending");

      setContractStatus("pending");
      setIsRequestModalOpen(false);
    } catch (err) {
      console.error("[ProfileHeader] failed to request coaching:", err);
      setError("Could not send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="h-10.5 animate-pulse rounded-xl bg-default-100" />
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
                <div className="flex w-full items-center justify-center rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-500">
                  You already have an active coach
                  {activeCoachName ? `: ${activeCoachName}` : ""}
                </div>
              ) : isPendingWithThisCoach ? (
                <div className="flex w-full items-center justify-center rounded-xl bg-yellow-50 px-5 py-3 text-sm font-medium text-yellow-700">
                  Request pending
                </div>
              ) : canRequest ? (
                <button
                  onClick={() => {
                    console.log("[ProfileHeader] opening request modal");
                    setIsRequestModalOpen(true);
                  }}
                  className="flex w-full items-center justify-center rounded-xl bg-[#5B5EF4] px-5 py-3 text-sm font-medium text-white hover:bg-[#4B4EE4]"
                >
                  Request Coaching
                </button>
              ) : (
                <div className="flex w-full items-center justify-center rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-500">
                  Unavailable
                </div>
              )}
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
          console.log("[ProfileHeader] closing request modal");
          if (!isSubmitting) setIsRequestModalOpen(false);
        }}
        onSubmit={handleSubmitRequest}
      />
    </>
  );
}
