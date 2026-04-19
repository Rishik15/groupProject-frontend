import { Button, Modal } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import type {
    CreateWorkoutCalendarEventInput,
    WorkoutCalendarEvent,
    WorkoutScheduleStatus,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";
import {
    getAllowedStatusOptions,
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
    status: WorkoutScheduleStatus;
    notes: string;
}

function getStatusHelpText(statusOptions: WorkoutScheduleStatus[]) {
    if (
        statusOptions.length === 2 &&
        statusOptions.includes("complete") &&
        statusOptions.includes("missed")
    ) {
        return "Past sessions can only be marked complete or missed.";
    }

    if (statusOptions.includes("active") && !statusOptions.includes("scheduled")) {
        return "Sessions happening right now can be marked active, complete, done, or missed.";
    }

    return "Future sessions can stay scheduled or be updated manually.";
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
            status: editingEvent?.status ?? "scheduled",
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

    useEffect(() => {
        setForm((previous) => {
            const safeStartTime = normalizeTimeForInput(previous.startTime);
            const safeEndTime = normalizeTimeForInput(previous.endTime);

            const nextStatus = normalizeStatusForRange(
                previous.status,
                previous.date,
                safeStartTime,
                safeEndTime,
            );

            if (
                nextStatus === previous.status &&
                safeStartTime === previous.startTime &&
                safeEndTime === previous.endTime
            ) {
                return previous;
            }

            return {
                ...previous,
                startTime: safeStartTime,
                endTime: safeEndTime,
                status: nextStatus,
            };
        });
    }, [form.date, form.startTime, form.endTime]);

    const statusOptions = useMemo(
        () =>
            getAllowedStatusOptions(
                form.date,
                normalizeTimeForInput(form.startTime),
                normalizeTimeForInput(form.endTime),
            ),
        [form.date, form.startTime, form.endTime],
    );

    const isEditing = Boolean(editingEvent && editingEvent.source !== "active-session");
    const canSetActive = Boolean(
        isEditing &&
        editingEvent &&
        editingEvent.source !== "active-session" &&
        editingEvent.status === "scheduled" &&
        onSetActive,
    );

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
            const safeStartTime = normalizeTimeForInput(form.startTime);
            const safeEndTime = normalizeTimeForInput(form.endTime);

            const payload: CreateWorkoutCalendarEventInput = {
                title: form.title.trim(),
                date: form.date,
                startTime: safeStartTime,
                endTime: safeEndTime,
                kind: form.kind,
                status: normalizeStatusForRange(
                    form.status,
                    form.date,
                    safeStartTime,
                    safeEndTime,
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
                <Modal.Container placement="center" size="md" scroll="inside" className="p-4">
                    <Modal.Dialog
                        aria-label={isEditing ? "Edit workout session" : "Add workout session"}
                        className="w-full max-w-[680px] overflow-hidden rounded-3xl bg-white"
                        style={{ border: "1px solid #5E5EF44D" }}
                    >
                        <div
                            className="bg-white px-5 py-5"
                            style={{ borderBottom: "1px solid #5E5EF44D" }}
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
                                            ? "Update the scheduled block, move its timing, or change the status."
                                            : "Create a schedule block for a workout session."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="rounded-xl px-3 py-2 text-[11.25px] font-semibold text-[#0F0F14] transition"
                                    style={{ border: "1px solid #5E5EF466" }}
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <AddSessionForm
                            title={form.title}
                            date={form.date}
                            startTime={form.startTime}
                            endTime={form.endTime}
                            kind={form.kind}
                            status={form.status}
                            notes={form.notes}
                            statusOptions={statusOptions}
                            statusHelpText={getStatusHelpText(statusOptions)}
                            onTitleChange={(value) => updateField("title", value)}
                            onDateChange={(value) => updateField("date", value)}
                            onStartTimeChange={(value) =>
                                updateField("startTime", normalizeTimeForInput(value))
                            }
                            onEndTimeChange={(value) =>
                                updateField("endTime", normalizeTimeForInput(value))
                            }
                            onKindChange={(value) => updateField("kind", value)}
                            onStatusChange={(value) => updateField("status", value)}
                            onNotesChange={(value) => updateField("notes", value)}
                        />

                        <div
                            className="bg-white px-5 py-4"
                            style={{ borderTop: "1px solid #5E5EF44D" }}
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div className="order-2 sm:order-1">
                                    {isEditing ? (
                                        <Button
                                            variant="ghost"
                                            onPress={handleDelete}
                                            isDisabled={isSubmitting}
                                            className="w-full sm:w-auto text-[11.25px] font-semibold text-[#0F0F14]"
                                            style={{ border: "1px solid #5E5EF466" }}
                                        >
                                            Delete Session
                                        </Button>
                                    ) : null}
                                </div>

                                <div className="order-1 sm:order-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="ghost"
                                        onPress={() => onOpenChange(false)}
                                        isDisabled={isSubmitting}
                                        className="w-full sm:w-auto text-[11.25px] font-semibold text-[#0F0F14]"
                                        style={{ border: "1px solid #5E5EF466" }}
                                    >
                                        Cancel
                                    </Button>

                                    {canSetActive ? (
                                        <Button
                                            variant="outline"
                                            onPress={handleSetActive}
                                            isDisabled={isSubmitting}
                                            className="w-full sm:w-auto text-[11.25px] font-semibold text-[#5E5EF4]"
                                            style={{ borderColor: "#5E5EF466" }}
                                        >
                                            Set Active
                                        </Button>
                                    ) : null}

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
