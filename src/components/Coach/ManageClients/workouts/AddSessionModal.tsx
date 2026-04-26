import { Button, Modal } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import type {
  CreateManageWorkoutEventInput,
  ManageWorkoutEvent,
  ManageWorkoutPlan,
  ManageWorkoutPlanDay,
  UpdateManageWorkoutEventInput,
} from "@/services/ManageClients/workout/getClients";

import {
  getManageClientWorkoutPlanDays,
  getManageClientWorkoutPlans,
} from "@/services/ManageClients/workout/getClients";

import AddSessionForm from "./AddSessionForm";

interface AddSessionModalProps {
  contractId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: string;
  defaultStartTime: string;
  editingEvent?: ManageWorkoutEvent | null;
  onCreate: (
    input: Omit<CreateManageWorkoutEventInput, "contract_id">,
  ) => void | Promise<unknown>;
  onUpdate: (
    eventId: number,
    input: Omit<UpdateManageWorkoutEventInput, "contract_id" | "event_id">,
  ) => void | Promise<unknown>;
  onDelete: (eventId: number) => void | Promise<unknown>;
}

interface AddSessionFormState {
  description: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  workoutPlanId: string;
  workoutDayId: string;
}

function normalizeTime(value: string | null | undefined) {
  if (!value) {
    return "06:00";
  }

  const parts = value.split(":");
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return "06:00";
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function addOneHour(value: string) {
  const normalized = normalizeTime(value);
  const [hour, minute] = normalized.split(":").map(Number);

  return `${String((hour + 1) % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function AddSessionModal({
  contractId,
  isOpen,
  onOpenChange,
  defaultDate,
  defaultStartTime,
  editingEvent,
  onCreate,
  onUpdate,
  onDelete,
}: AddSessionModalProps) {
  const [plans, setPlans] = useState<ManageWorkoutPlan[]>([]);
  const [days, setDays] = useState<ManageWorkoutPlanDay[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingDays, setIsLoadingDays] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialState = useMemo<AddSessionFormState>(
    () => ({
      description: editingEvent?.description || editingEvent?.title || "",
      notes: editingEvent?.notes || "",
      date: editingEvent?.date || defaultDate,
      startTime: normalizeTime(editingEvent?.startTime || defaultStartTime),
      endTime: normalizeTime(
        editingEvent?.endTime || addOneHour(defaultStartTime),
      ),
      workoutPlanId: editingEvent?.workoutPlanId
        ? String(editingEvent.workoutPlanId)
        : "",
      workoutDayId: editingEvent?.workoutDayId
        ? String(editingEvent.workoutDayId)
        : "",
    }),
    [defaultDate, defaultStartTime, editingEvent],
  );

  const [form, setForm] = useState<AddSessionFormState>(initialState);

  const isEditing = Boolean(editingEvent);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(initialState);
    setDays([]);
    setIsSubmitting(false);

    async function loadPlans() {
      try {
        setIsLoadingPlans(true);

        const data = await getManageClientWorkoutPlans(contractId);
        setPlans(data);
      } catch (error) {
        console.error("Failed to load client workout plans", error);
        setPlans([]);
      } finally {
        setIsLoadingPlans(false);
      }
    }

    loadPlans();
  }, [contractId, isOpen, initialState]);

  useEffect(() => {
    if (!isOpen || !form.workoutPlanId) {
      setDays([]);
      return;
    }

    async function loadDays() {
      try {
        setIsLoadingDays(true);

        const data = await getManageClientWorkoutPlanDays(
          contractId,
          Number(form.workoutPlanId),
        );

        setDays(data);

        if (!form.workoutDayId && data.length === 1) {
          setForm((previous) => ({
            ...previous,
            workoutDayId: String(data[0].day_id),
          }));
        }
      } catch (error) {
        console.error("Failed to load workout days", error);
        setDays([]);
      } finally {
        setIsLoadingDays(false);
      }
    }

    loadDays();
  }, [contractId, isOpen, form.workoutPlanId, form.workoutDayId]);

  function updateField(field: keyof AddSessionFormState, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (
      isSubmitting ||
      !form.description.trim() ||
      !form.workoutPlanId ||
      !form.workoutDayId
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        event_date: form.date,
        start_time: normalizeTime(form.startTime),
        end_time: normalizeTime(form.endTime),
        description: form.description.trim(),
        notes: form.notes.trim(),
        workout_plan_id: Number(form.workoutPlanId),
        workout_day_id: Number(form.workoutDayId),
      };

      if (isEditing && editingEvent) {
        await onUpdate(editingEvent.eventId, payload);
      } else {
        await onCreate(payload);
      }

      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editingEvent || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onDelete(editingEvent.eventId);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant="blur"
        className="bg-black/30"
      >
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog
            aria-label={
              isEditing
                ? "Edit client workout session"
                : "Add client workout session"
            }
            className="w-full rounded-4xl border border-[#E5E7EB] bg-white shadow-xl"
          >
            <Modal.Header className="border-b border-[#E5E7EB] bg-white py-3">
              <div>
                <p className="font-primary text-[12px] font-medium text-indigo-500">
                  Client Workout Schedule
                </p>

                <Modal.Heading className="mt-1 font-primary text-[16px] font-semibold text-[#0F0F14]">
                  {isEditing ? "Edit Session" : "Add Session"}
                </Modal.Heading>

                <p className="mt-1 font-primary text-[12px] leading-5 text-[#72728A]">
                  Choose one of the client's assigned plans and schedule a
                  workout session.
                </p>
              </div>
            </Modal.Header>

            <Modal.Body className="bg-white px-4 py-2">
              <AddSessionForm
                plans={plans}
                days={days}
                isLoadingPlans={isLoadingPlans}
                isLoadingDays={isLoadingDays}
                description={form.description}
                notes={form.notes}
                date={form.date}
                startTime={form.startTime}
                endTime={form.endTime}
                workoutPlanId={form.workoutPlanId}
                workoutDayId={form.workoutDayId}
                onDescriptionChange={(value) =>
                  updateField("description", value)
                }
                onNotesChange={(value) => updateField("notes", value)}
                onDateChange={(value) => updateField("date", value)}
                onStartTimeChange={(value) =>
                  updateField("startTime", normalizeTime(value))
                }
                onEndTimeChange={(value) =>
                  updateField("endTime", normalizeTime(value))
                }
                onWorkoutPlanChange={(value) => {
                  setForm((previous) => ({
                    ...previous,
                    workoutPlanId: value,
                    workoutDayId: "",
                  }));
                }}
                onWorkoutDayChange={(value) =>
                  updateField("workoutDayId", value)
                }
              />
            </Modal.Body>

            <Modal.Footer className="border-t border-[#E5E7EB] bg-white pb-1 pt-3">
              <div className="flex w-full items-center justify-between gap-3">
                <div>
                  {isEditing ? (
                    <Button
                      variant="outline"
                      onPress={handleDelete}
                      isDisabled={isSubmitting}
                      className="h-9 rounded-xl border border-red-100 bg-white px-4 font-primary text-[12px] font-semibold text-red-500"
                    >
                      Delete
                    </Button>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onPress={() => onOpenChange(false)}
                    isDisabled={isSubmitting}
                    className="h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 font-primary text-[12px] font-semibold text-[#0F0F14]"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    onPress={handleSubmit}
                    isDisabled={
                      isSubmitting ||
                      plans.length === 0 ||
                      !form.description.trim() ||
                      !form.workoutPlanId ||
                      !form.workoutDayId
                    }
                    className="h-9 rounded-xl border-0 bg-indigo-500 px-4 font-primary text-[12px] font-semibold text-white hover:bg-indigo-600"
                  >
                    {isEditing ? "Save Changes" : "Save Session"}
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
