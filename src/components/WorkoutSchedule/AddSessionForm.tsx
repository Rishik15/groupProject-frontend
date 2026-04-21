import {
    Input,
    Label,
    TextArea,
    TimeField,
    type TimeValue,
} from "@heroui/react";
import { parseTime } from "@internationalized/date";

import type {
    WorkoutScheduleKind,
    WorkoutScheduleStatus,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";
import { normalizeTimeForInput } from "../../utils/WorkoutLog/timeUtils";
import ScheduleDateField from "./ScheduleDateField";
import ScheduleSelectField from "./ScheduleSelectField";

const sessionTypeOptions: Array<{ value: WorkoutScheduleKind; label: string }> = [
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "yoga", label: "Yoga" },
    { value: "rest", label: "Rest" },
    { value: "nutrition", label: "Nutrition" },
    { value: "other", label: "Other" },
];

function getStatusLabel(status: WorkoutScheduleStatus) {
    if (status === "scheduled") {
        return "Scheduled";
    }

    if (status === "active") {
        return "Active";
    }

    if (status === "complete" || status === "done") {
        return "Done";
    }

    return "Missed";
}

function safeParseTime(value: string): TimeValue | null {
    const normalized = normalizeTimeForInput(value);

    try {
        return parseTime(normalized);
    } catch {
        return null;
    }
}

function formatTimeValue(value: TimeValue | null) {
    if (!value) {
        return "";
    }

    return `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;
}

interface AddSessionFormProps {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    kind: WorkoutScheduleKind;
    systemStatus: WorkoutScheduleStatus;
    statusHelpText: string;
    notes: string;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
    onKindChange: (value: WorkoutScheduleKind) => void;
    onNotesChange: (value: string) => void;
}

export default function AddSessionForm({
    title,
    date,
    startTime,
    endTime,
    kind,
    systemStatus,
    statusHelpText,
    notes,
    onTitleChange,
    onDateChange,
    onStartTimeChange,
    onEndTimeChange,
    onKindChange,
    onNotesChange,
}: AddSessionFormProps) {
    return (
        <div className="space-y-4 bg-white px-5 py-5">
            <div className="space-y-2">
                <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                    Session Title
                </label>

                <Input
                    placeholder="Upper Body Strength"
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    className="w-full text-[13.125px]"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ScheduleDateField value={date} onChange={onDateChange} />

                <ScheduleSelectField
                    label="Session Type"
                    value={kind}
                    placeholder="Select session type"
                    options={sessionTypeOptions}
                    onChange={(value) => onKindChange(value as WorkoutScheduleKind)}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TimeField
                    className="w-full"
                    value={safeParseTime(startTime)}
                    onChange={(value: TimeValue | null) =>
                        onStartTimeChange(
                            normalizeTimeForInput(formatTimeValue(value)),
                        )
                    }
                    granularity="minute"
                    hourCycle={12}
                >
                    <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                        Start Time
                    </Label>

                    <TimeField.Group
                        className="rounded-xl border border-[#E5E7EB] bg-white"
                        fullWidth
                        variant="secondary"
                    >
                        <TimeField.Input className="px-3 text-[13.125px] text-[#0F0F14]">
                            {(segment) => <TimeField.Segment segment={segment} />}
                        </TimeField.Input>
                    </TimeField.Group>
                </TimeField>

                <TimeField
                    className="w-full"
                    value={safeParseTime(endTime)}
                    onChange={(value: TimeValue | null) =>
                        onEndTimeChange(
                            normalizeTimeForInput(formatTimeValue(value)),
                        )
                    }
                    granularity="minute"
                    hourCycle={12}
                >
                    <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                        End Time
                    </Label>

                    <TimeField.Group
                        className="rounded-xl border border-[#E5E7EB] bg-white"
                        fullWidth
                        variant="secondary"
                    >
                        <TimeField.Input className="px-3 text-[13.125px] text-[#0F0F14]">
                            {(segment) => <TimeField.Segment segment={segment} />}
                        </TimeField.Input>
                    </TimeField.Group>
                </TimeField>
            </div>

            <div className="space-y-2">
                <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                    Session Status
                </label>

                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[13.125px] text-[#0F0F14]">
                            {getStatusLabel(systemStatus)}
                        </span>

                        <span className="rounded-full border border-[#E5E7EB] bg-white px-2.5 py-1 text-[11px] font-medium text-[#4F46E5]">
                            System
                        </span>
                    </div>

                    <p className="mt-2 text-[12px] text-[#72728A]">
                        {statusHelpText}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                    Notes
                </label>

                <TextArea
                    placeholder="Optional session notes"
                    value={notes}
                    onChange={(event) => onNotesChange(event.target.value)}
                    className="w-full text-[13.125px]"
                />
            </div>
        </div>
    );
}
