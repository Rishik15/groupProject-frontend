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

const sessionTypeOptions: Array<{ value: WorkoutScheduleKind; label: string }> =
  [
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "yoga", label: "Yoga" },
    { value: "rest", label: "Rest" },
    { value: "nutrition", label: "Nutrition" },
    { value: "other", label: "Other" },
  ];

const allStatuses: WorkoutScheduleStatus[] = [
  "scheduled",
  "active",
  "complete",
  "missed",
];

const getStatusStyles = (
  status: WorkoutScheduleStatus,
  current: WorkoutScheduleStatus,
) => {
  const isActive = status === current;

  const base =
    "flex text-center rounded-2xl py-2 px-4 text-[12px] font-medium border transition items-center";

  if (status === "active") {
    return `${base} ${isActive ? "bg-green-100 text-green-700 border-green-300" : "bg-white text-green-600 border-gray-200"}`;
  }

  if (status === "missed") {
    return `${base} ${isActive ? "bg-red-100 text-red-700 border-red-300" : "bg-white text-red-600 border-gray-200"}`;
  }

  if (status === "scheduled") {
    return `${base} ${isActive ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-blue-600 border-gray-200"}`;
  }

  return `${base} ${isActive ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-200"}`;
};

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
            onStartTimeChange(normalizeTimeForInput(formatTimeValue(value)))
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
            onEndTimeChange(normalizeTimeForInput(formatTimeValue(value)))
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

        <div className="px-3 py-3 space-y-3">
          <div className="flex gap-2">
            {allStatuses.map((status) => (
              <div
                key={status}
                className={getStatusStyles(status, systemStatus)}
              >
                {getStatusLabel(status)}
              </div>
            ))}
          </div>

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
          className="w-full text-[13.125px] h-24"
        />
      </div>
    </div>
  );
}
