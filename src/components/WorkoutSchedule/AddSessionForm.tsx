import { Input, TextArea } from "@heroui/react";

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

    if (status === "complete") {
        return "Complete";
    }

    if (status === "done") {
        return "Done";
    }

    return "Missed";
}

interface AddSessionFormProps {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    kind: WorkoutScheduleKind;
    status: WorkoutScheduleStatus;
    notes: string;
    statusOptions: WorkoutScheduleStatus[];
    statusHelpText: string;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
    onKindChange: (value: WorkoutScheduleKind) => void;
    onStatusChange: (value: WorkoutScheduleStatus) => void;
    onNotesChange: (value: string) => void;
}

export default function AddSessionForm({
    title,
    date,
    startTime,
    endTime,
    kind,
    status,
    notes,
    statusOptions,
    statusHelpText,
    onTitleChange,
    onDateChange,
    onStartTimeChange,
    onEndTimeChange,
    onKindChange,
    onStatusChange,
    onNotesChange,
}: AddSessionFormProps) {
    return (
        <div className="space-y-4 bg-white px-5 py-5">
            <div className="space-y-2">
                <label className="text-[11.25px] font-semibold text-[#0F0F14]">
                    Session Title
                </label>

                <Input
                    placeholder="Upper Body Strength"
                    value={title}
                    onChange={(event) => onTitleChange(event.currentTarget.value)}
                    className="w-full"
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
                <div className="space-y-2">
                    <label className="text-[11.25px] font-semibold text-[#0F0F14]">
                        Start Time
                    </label>

                    <Input
                        type="time"
                        value={normalizeTimeForInput(startTime)}
                        onChange={(event) =>
                            onStartTimeChange(
                                normalizeTimeForInput(event.currentTarget.value),
                            )
                        }
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11.25px] font-semibold text-[#0F0F14]">
                        End Time
                    </label>

                    <Input
                        type="time"
                        value={normalizeTimeForInput(endTime)}
                        onChange={(event) =>
                            onEndTimeChange(
                                normalizeTimeForInput(event.currentTarget.value),
                            )
                        }
                        className="w-full"
                    />
                </div>
            </div>

            <ScheduleSelectField
                label="Session Status"
                value={status}
                placeholder="Select status"
                options={statusOptions.map((statusValue) => ({
                    value: statusValue,
                    label: getStatusLabel(statusValue),
                }))}
                onChange={(value) => onStatusChange(value as WorkoutScheduleStatus)}
            />

            <p className="-mt-2 text-[11.25px] text-[#72728A]">{statusHelpText}</p>

            <div className="space-y-2">
                <label className="text-[11.25px] font-semibold text-[#0F0F14]">
                    Notes
                </label>

                <TextArea
                    placeholder="Optional session notes"
                    value={notes}
                    onChange={(event) => onNotesChange(event.currentTarget.value)}
                    className="w-full"
                />
            </div>
        </div>
    );
}