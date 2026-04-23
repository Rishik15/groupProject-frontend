import { Button, Modal } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import type {
    CreateWorkoutCalendarEventInput,
    WorkoutCalendarEvent,
    WorkoutScheduleStatus,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";
import {
    deriveSystemStatus,
    normalizeStatusForRange,
} from "../../utils/WorkoutLog/useWorkoutSchedule";
import {
    addOneHourToTime,
    normalizeTimeForInput,
} from "../../utils/WorkoutLog/timeUtils";
import AddSessionForm from "./AddSessionForm";

interface AddSessionModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    defaultDate: string;
    defaultStartTime: string;
    editingEvent?: WorkoutCalendarEvent | null;
    onCreate: (input: CreateWorkoutCalendarEventInput) => void | Promise<unknown>;
    onUpdate: (eventId: string, input: CreateWorkoutCalendarEventInput) => void | Promise<unknown>;
    onDelete: (eventId: string) => void | Promise<unknown>;
    onSetActive?: (eventId: string) => void | Promise<unknown>;
}

interface AddSessionFormState {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    kind: CreateWorkoutCalendarEventInput["kind"];
    notes: string;
}

function getStatusHelpText(status: WorkoutScheduleStatus) {
    if (status === "active") {
        return "Active is system-determined when the current time overlaps this session window.";
    }

    if (status === "done") {
        return "Done is preserved from completed session data returned by the system.";
    }

    if (status === "missed") {
        return "Missed is system-determined for sessions in the past that are not marked done.";
    }

    return "Scheduled is system-determined for sessions in the future.";
}

export default function AddSessionModal({
    isOpen,
    onOpenChange,
    defaultDate,
    defaultStartTime,
    editingEvent,
    onCreate,
    onUpdate,
    onDelete,
    onSetActive,
}: AddSessionModalProps) {
    const initialState = useMemo<AddSessionFormState>(
        () => ({
            title: editingEvent?.title ?? "",
            date: editingEvent?.date ?? defaultDate,
            startTime: normalizeTimeForInput(
                editingEvent?.startTime ?? defaultStartTime,
            ),
            endTime: normalizeTimeForInput(
                editingEvent?.endTime ?? addOneHourToTime(defaultStartTime),
            ),
            kind: editingEvent?.kind ?? "strength",
            notes: editingEvent?.notes ?? "",
        }),
        [defaultDate, defaultStartTime, editingEvent],
    );

    const [form, setForm] = useState<AddSessionFormState>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm(initialState);
            setIsSubmitting(false);
        }
    }, [initialState, isOpen]);

    const normalizedStartTime = normalizeTimeForInput(form.startTime);
    const normalizedEndTime = normalizeTimeForInput(form.endTime);

    const systemStatus = useMemo(
        () =>
            deriveSystemStatus(
                form.date,
                normalizedStartTime,
                normalizedEndTime,
                editingEvent?.status,
            ),
        [editingEvent?.status, form.date, normalizedEndTime, normalizedStartTime],
    );

    const isEditing = Boolean(editingEvent && editingEvent.source !== "active-session");

    function updateField<K extends keyof AddSessionFormState>(
        field: K,
        value: AddSessionFormState[K],
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    async function handleSubmit() {
        if (!form.title.trim() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: CreateWorkoutCalendarEventInput = {
                title: form.title.trim(),
                date: form.date,
                startTime: normalizedStartTime,
                endTime: normalizedEndTime,
                kind: form.kind,
                status: normalizeStatusForRange(
                    editingEvent?.status ?? systemStatus,
                    form.date,
                    normalizedStartTime,
                    normalizedEndTime,
                ),
                notes: form.notes.trim() || undefined,
            };

            if (isEditing && editingEvent) {
                await onUpdate(editingEvent.id, payload);
            } else {
                await onCreate(payload);
            }

            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!editingEvent || editingEvent.source === "active-session" || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onDelete(editingEvent.id);
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSetActive() {
        if (!editingEvent || !onSetActive || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSetActive(editingEvent.id);
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
                <Modal.Container placement="center" size="md" scroll="inside">
                    <Modal.Dialog
                        aria-label={isEditing ? "Edit workout session" : "Add workout session"}
                        className="flex max-h-[92vh] w-full max-w-[680px] flex-col overflow-hidden rounded-4xl bg-white"
                        style={{ border: "1px solid #E5E7EB" }}
                    >
                        <div
                            className="shrink-0 bg-white py-2 px-4"
                            style={{ borderBottom: "1px solid #ECEEF2" }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[11.25px] font-medium text-[#72728A]">
                                        Workout Schedule
                                    </p>

                                    <h2 className="mt-1 text-[18.75px] font-semibold text-[#0F0F14]">
                                        {isEditing ? "Edit Session" : "Add Session"}
                                    </h2>

                                    <p className="mt-2 text-[11.25px] text-[#72728A]">
                                        {isEditing
                                            ? "Update the scheduled block and the system will recalculate its status."
                                            : "Create a schedule block and let the system determine its status."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="rounded-xl px-3 py-2 text-[11.25px] font-semibold text-[#0F0F14] transition"
                                    style={{
                                        border: "1px solid #E5E7EB",
                                        backgroundColor: "#FFFFFF",
                                    }}
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto bg-white">
                            <AddSessionForm
                                title={form.title}
                                date={form.date}
                                startTime={form.startTime}
                                endTime={form.endTime}
                                kind={form.kind}
                                systemStatus={systemStatus}
                                statusHelpText={getStatusHelpText(systemStatus)}
                                notes={form.notes}
                                onTitleChange={(value) => updateField("title", value)}
                                onDateChange={(value) => updateField("date", value)}
                                onStartTimeChange={(value) =>
                                    updateField("startTime", normalizeTimeForInput(value))
                                }
                                onEndTimeChange={(value) =>
                                    updateField("endTime", normalizeTimeForInput(value))
                                }
                                onKindChange={(value) => updateField("kind", value)}
                                onNotesChange={(value) => updateField("notes", value)}
                            />
                        </div>

                        <div
                            className="shrink-0 bg-white px-4 pt-4"
                            style={{ borderTop: "1px solid #ECEEF2" }}
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div className="order-2 sm:order-1">
                                    {isEditing ? (
                                        <Button
                                            variant="ghost"
                                            onPress={handleDelete}
                                            isDisabled={isSubmitting}
                                            className="w-full sm:w-auto text-[11.25px] font-semibold text-[#0F0F14]"
                                            style={{
                                                border: "1px solid #E5E7EB",
                                                backgroundColor: "#FFFFFF",
                                            }}
                                        >
                                            Delete Session
                                        </Button>
                                    ) : null}
                                </div>

                                <div className="order-1 flex flex-col gap-3 sm:order-2 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="ghost"
                                        onPress={() => onOpenChange(false)}
                                        isDisabled={isSubmitting}
                                        className="w-full sm:w-auto text-[11.25px] font-semibold text-[#0F0F14]"
                                        style={{
                                            border: "1px solid #E5E7EB",
                                            backgroundColor: "#FFFFFF",
                                        }}
                                    >
                                        Cancel
                                    </Button>


                                    <Button
                                        variant="primary"
                                        onPress={handleSubmit}
                                        isDisabled={isSubmitting}
                                        className="w-full sm:w-auto text-[11.25px] font-semibold text-white"
                                        style={{ backgroundColor: "#5E5EF4" }}
                                    >
                                        {isEditing ? "Save Changes" : "Save Session"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
