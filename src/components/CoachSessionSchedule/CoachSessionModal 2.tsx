import { Button, Modal } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import type {
  CalendarEvent,
  CoachSessionConflict,
  CreateCoachSessionEventInput,
  UpdateCoachSessionEventInput,
} from "@/utils/Interfaces/Calendar/calendar";

import { getCoachSessionError } from "@/services/CoachSession/coachSessionService";
import type { CoachSessionClient } from "../../utils/Interfaces/CoachSession/coachSession";
import CoachSessionForm from "./CoachSessionForm";

interface CoachSessionModalProps {
  isOpen: boolean;
  clients: CoachSessionClient[];
  onOpenChange: (open: boolean) => void;
  defaultDate: string;
  defaultStartTime: string;
  editingEvent?: CalendarEvent | null;
  onCreate: (input: CreateCoachSessionEventInput) => void | Promise<unknown>;
  onUpdate: (
    eventId: number,
    input: UpdateCoachSessionEventInput,
  ) => void | Promise<unknown>;
  onDelete: (eventId: number) => void | Promise<unknown>;
  onStatusChange: (
    eventId: number,
    status: "scheduled" | "completed" | "cancelled",
  ) => void | Promise<unknown>;
}

interface CoachSessionFormState {
  contractId: string;
  description: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
}

function normalizeTime(value: string | null | undefined) {
  if (!value) return "09:00";

  const parts = value.split(":");
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return "09:00";

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function addOneHour(value: string) {
  const normalized = normalizeTime(value);
  const [hour, minute] = normalized.split(":").map(Number);

  return `${String((hour + 1) % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function CoachSessionModal({
  isOpen,
  clients,
  onOpenChange,
  defaultDate,
  defaultStartTime,
  editingEvent,
  onCreate,
  onUpdate,
  onDelete,
  onStatusChange,
}: CoachSessionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [conflicts, setConflicts] = useState<CoachSessionConflict[]>([]);

  const firstContractId = clients[0]?.contractId
    ? String(clients[0].contractId)
    : "";

  const initialState = useMemo<CoachSessionFormState>(
    () => ({
      contractId: editingEvent?.contractId
        ? String(editingEvent.contractId)
        : firstContractId,
      description: editingEvent?.description || "Coach Session",
      notes: editingEvent?.notes || "",
      date: editingEvent?.date || defaultDate,
      startTime: normalizeTime(editingEvent?.startTime || defaultStartTime),
      endTime: normalizeTime(
        editingEvent?.endTime || addOneHour(defaultStartTime),
      ),
    }),
    [defaultDate, defaultStartTime, editingEvent, firstContractId],
  );

  const [form, setForm] = useState<CoachSessionFormState>(initialState);
  const isEditing = Boolean(editingEvent);

  useEffect(() => {
    if (!isOpen) return;

    setForm(initialState);
    setSubmitError("");
    setConflicts([]);
    setIsSubmitting(false);
  }, [isOpen, initialState]);

  function updateField(field: keyof CoachSessionFormState, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (isSubmitting || !form.description.trim() || !form.contractId) return;

    setIsSubmitting(true);
    setSubmitError("");
    setConflicts([]);

    try {
      const payload = {
        contract_id: Number(form.contractId),
        event_date: form.date,
        start_time: normalizeTime(form.startTime),
        end_time: normalizeTime(form.endTime),
        description: form.description.trim(),
        notes: form.notes.trim(),
      };

      if (isEditing && editingEvent) {
        await onUpdate(editingEvent.eventId, payload);
      } else {
        await onCreate(payload);
      }

      onOpenChange(false);
    } catch (error) {
      const parsedError = getCoachSessionError(error);
      setSubmitError(parsedError.error);
      setConflicts(parsedError.conflicts || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editingEvent || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onDelete(editingEvent.eventId);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(
    status: "scheduled" | "completed" | "cancelled",
  ) {
    if (!editingEvent || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onStatusChange(editingEvent.eventId, status);
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
              isEditing ? "Edit coach session" : "Schedule coach session"
            }
            className="w-full rounded-3xl border border-[#E5E7EB] bg-white shadow-xl"
          >
            <Modal.Header className="border-b border-[#E5E7EB] bg-white px-5 pb-4">
              <div className="flex w-full items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium text-indigo-500">
                    Coach Session
                  </p>

                  <Modal.Heading className="mt-1 text-[16px] font-semibold text-[#0F0F14]">
                    {isEditing ? "Edit Session" : "Schedule Session"}
                  </Modal.Heading>

                  <p className="mt-1 text-[12px] leading-5 text-[#72728A]">
                    Select the client, date, and time.
                  </p>
                </div>

                {editingEvent?.status ? (
                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold capitalize text-indigo-600">
                    {editingEvent.status}
                  </div>
                ) : null}
              </div>
            </Modal.Header>

            <Modal.Body className="bg-white px-5 pt-4">
              {submitError ? (
                <div className="mb-3 rounded-2xl border border-red-100 bg-red-50 px-3 text-[12px] text-red-500">
                  <p className="font-semibold">{submitError}</p>

                  {conflicts.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      {conflicts.map((conflict) => (
                        <p key={conflict.eventId}>
                          {conflict.clientFirstName} {conflict.clientLastName}:{" "}
                          {conflict.startTime.slice(0, 5)} -{" "}
                          {conflict.endTime.slice(0, 5)}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <CoachSessionForm
                clients={clients}
                contractId={form.contractId}
                description={form.description}
                notes={form.notes}
                date={form.date}
                startTime={form.startTime}
                endTime={form.endTime}
                isEditing={isEditing}
                onContractChange={(value) => updateField("contractId", value)}
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
              />
            </Modal.Body>

            <Modal.Footer className="border-t border-[#E5E7EB] bg-white px-5 pt-3">
              <div className="flex w-full flex-col gap-3">
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onPress={() => handleStatusChange("scheduled")}
                      isDisabled={isSubmitting}
                      className="h-8 rounded-xl border border-[#E5E7EB] bg-white px-3 text-[12px] font-semibold text-[#0F0F14]"
                    >
                      Scheduled
                    </Button>

                    <Button
                      variant="outline"
                      onPress={() => handleStatusChange("completed")}
                      isDisabled={isSubmitting}
                      className="h-8 rounded-xl border border-emerald-100 bg-white px-3 text-[12px] font-semibold text-emerald-600"
                    >
                      Completed
                    </Button>

                    <Button
                      variant="outline"
                      onPress={() => handleStatusChange("cancelled")}
                      isDisabled={isSubmitting}
                      className="h-8 rounded-xl border border-orange-100 bg-white px-3 text-[12px] font-semibold text-orange-500"
                    >
                      Cancelled
                    </Button>
                  </div>
                ) : null}

                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    {isEditing ? (
                      <Button
                        variant="outline"
                        onPress={handleDelete}
                        isDisabled={isSubmitting}
                        className="h-9 rounded-xl border border-red-100 bg-white px-4 text-[12px] font-semibold text-red-500"
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
                      className="h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[12px] font-semibold text-[#0F0F14]"
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="primary"
                      onPress={handleSubmit}
                      isDisabled={
                        isSubmitting ||
                        !form.description.trim() ||
                        !form.contractId ||
                        clients.length === 0
                      }
                      className="h-9 rounded-xl border-0 bg-indigo-500 px-4 text-[12px] font-semibold text-white hover:bg-indigo-600"
                    >
                      {isEditing ? "Save" : "Schedule"}
                    </Button>
                  </div>
                </div>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
