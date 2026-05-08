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
import type { PaymentMethod } from "../Billing/type";
import { get_PaymentMethods } from "@/services/billing/get_PaymentMethod";

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

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const normalizePaymentMethods = (data: any): PaymentMethod[] => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.payment_methods)) {
      return data.payment_methods;
    }

    if (Array.isArray(data?.paymentMethods)) {
      return data.paymentMethods;
    }

    if (Array.isArray(data?.methods)) {
      return data.methods;
    }

    return [];
  };

  const fetchPaymentMethods = async () => {
    const res = await get_PaymentMethods();
    const methods = normalizePaymentMethods(res.data);

    setPaymentMethods(methods);

    return methods;
  };

  useEffect(() => {
    if (mode !== "app") {
      setIsCheckingStatus(false);
      setContractStatus(null);
      setHasActiveContract(false);
      setActiveCoachId(null);
      setActiveCoachName(null);
      setPaymentMethods([]);
      return;
    }

    const loadData = async () => {
      try {
        setIsCheckingStatus(true);
        setError(null);

        const statusData = await getClientCoachStatus(coachId);

        const normalizedActiveCoachId =
          statusData.active_coach_id === null
            ? null
            : Number(statusData.active_coach_id);

        setContractStatus(statusData.status);
        setHasActiveContract(Boolean(statusData.has_active_contract));
        setActiveCoachId(normalizedActiveCoachId);
        setActiveCoachName(statusData.active_coach_name);

        await fetchPaymentMethods();
      } catch (err) {
        console.error("[ProfileHeader] failed to load data:", err);
        setError("Could not load coach request information.");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (coachId) {
      void loadData();
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

  const canRequest =
    !hasActiveContract &&
    (contractStatus === "none" || contractStatus === "closed");

  const handleSubmitRequest = async (values: {
    coach_id: number;
    is_recurring: boolean;
    training_reason: string;
    goals: string;
    preferred_schedule: string;
    notes: string;
    payment_method_id?: number;
    card_number?: string;
    card_brand?: string;
    expiry_month?: number;
    expiry_year?: number;
  }) => {
    if (isSubmitting || !canRequest) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await requestCoachContract({
        coach_id: selectedCoachId,
        is_recurring: values.is_recurring,
        training_reason: values.training_reason,
        goals: values.goals,
        preferred_schedule: values.preferred_schedule,
        notes: values.notes,
        payment_method_id: values.payment_method_id,
        card_number: values.card_number,
        card_brand: values.card_brand,
        expiry_month: values.expiry_month,
        expiry_year: values.expiry_year,
      });

      if (result?.payment_method_id && !values.payment_method_id) {
        await fetchPaymentMethods();
      }

      setContractStatus("pending");
      setIsRequestModalOpen(false);
    } catch (err: any) {
      console.error("[ProfileHeader] failed to request coaching:", err);
      setError(
        err?.response?.data?.error ||
          "Could not send request. Please try again.",
      );
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
            <p className="text-xs text-default-400">per month</p>
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
        paymentMethods={paymentMethods}
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