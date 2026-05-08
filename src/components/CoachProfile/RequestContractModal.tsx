import { useState } from "react";
import {
  Button,
  Description,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import type { CoachProfile } from "../../services/contract/requestcontracts";
import type { PaymentMethod } from "../Billing/type";
import PaymentRequiredModal from "./PaymentRequiredModal";

interface RequestContractModalProps {
  isOpen: boolean;
  coach: CoachProfile;
  paymentMethods: PaymentMethod[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: {
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
  }) => void;
}

export default function RequestContractModal({
  isOpen,
  coach,
  paymentMethods,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: RequestContractModalProps) {
  const [trainingReason, setTrainingReason] = useState("");
  const [goals, setGoals] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isOpen) return null;

  const getPaymentMethodId = (method: PaymentMethod) => {
    const rawMethod = method as any;

    const id = rawMethod.payment_method_id ?? rawMethod.id;

    if (id === null || id === undefined || id === "") {
      return null;
    }

    const numberId = Number(id);

    return Number.isNaN(numberId) ? null : numberId;
  };

  const getDefaultPaymentMethod = () => {
    const usableMethods = paymentMethods.filter(
      (method) => getPaymentMethodId(method) !== null,
    );

    if (usableMethods.length === 0) {
      return null;
    }

    const defaultMethod = usableMethods.find((method) => {
      const rawMethod = method as any;

      return (
        rawMethod.is_default === 1 ||
        rawMethod.is_default === true ||
        rawMethod.is_default === "1" ||
        rawMethod.is_default === "true"
      );
    });

    return defaultMethod || usableMethods[0];
  };

  const buildRequestValues = () => {
    return {
      coach_id: coach.coach_id,
      is_recurring: isRecurring,
      training_reason: trainingReason.trim(),
      goals: goals.trim(),
      preferred_schedule: preferredSchedule.trim(),
      notes: notes.trim(),
    };
  };

  const handleSubmit = () => {
    const values = buildRequestValues();
    const paymentMethod = getDefaultPaymentMethod();

    if (!paymentMethod) {
      setIsPaymentModalOpen(true);
      return;
    }

    const paymentMethodId = getPaymentMethodId(paymentMethod);

    if (!paymentMethodId) {
      setIsPaymentModalOpen(true);
      return;
    }

    onSubmit({
      ...values,
      payment_method_id: paymentMethodId,
    });
  };

  const handlePaymentSubmit = (values: {
    card_number: string;
    card_brand: string;
    expiry_month: number;
    expiry_year: number;
  }) => {
    onSubmit({
      ...buildRequestValues(),
      ...values,
    });
  };

  const handleClose = () => {
    setIsPaymentModalOpen(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-foreground">
              Request coaching
            </h2>
            <p className="mt-1 text-sm text-default-400">
              Tell {coach.first_name} why you want training and what you need
              help with.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <TextField
              isRequired
              fullWidth
              name="training_reason"
              value={trainingReason}
              onChange={setTrainingReason}
            >
              <Label>Why do you want coaching?</Label>
              <TextArea
                rows={3}
                placeholder="Example: I want help losing weight and staying consistent."
              />
              <Description>
                This helps the coach understand your reason.
              </Description>
            </TextField>

            <TextField
              isRequired
              fullWidth
              name="goals"
              value={goals}
              onChange={setGoals}
            >
              <Label>Main goals</Label>
              <TextArea
                rows={3}
                placeholder="Example: Lose 15 pounds, build strength, improve endurance."
              />
              <Description>
                Add the main things you want to improve.
              </Description>
            </TextField>

            <TextField
              fullWidth
              name="preferred_schedule"
              value={preferredSchedule}
              onChange={setPreferredSchedule}
            >
              <Label>Preferred schedule</Label>
              <Input placeholder="Example: Weekdays after 6 PM or weekends" />
            </TextField>

            <TextField fullWidth name="notes" value={notes} onChange={setNotes}>
              <Label>Extra notes</Label>
              <TextArea
                rows={3}
                placeholder="Any injuries, preferences, experience level, or questions."
              />
            </TextField>

            <div className="rounded-xl border border-default-200 p-4">
              <p className="text-sm font-medium text-foreground">
                Payment type
              </p>

              <div className="mt-3 flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className={
                    isRecurring
                      ? "rounded-lg border border-[#5B5EF4] bg-[#5B5EF4]/10 text-[#5B5EF4]"
                      : "rounded-lg border bg-white text-default-500"
                  }
                  onPress={() => setIsRecurring(true)}
                >
                  Recurring
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className={
                    !isRecurring
                      ? "rounded-lg border border-[#5B5EF4] bg-[#5B5EF4]/10 text-[#5B5EF4]"
                      : "rounded-lg border bg-white text-default-500"
                  }
                  onPress={() => setIsRecurring(false)}
                >
                  One time
                </Button>
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="ghost"
              onPress={handleClose}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              className="bg-[#5B5EF4] text-white"
              onPress={handleSubmit}
              isDisabled={
                isSubmitting || !trainingReason.trim() || !goals.trim()
              }
            >
              {isSubmitting ? "Sending..." : "Send request"}
            </Button>
          </div>
        </div>
      </div>

      <PaymentRequiredModal
        isOpen={isPaymentModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
      />
    </>
  );
}
