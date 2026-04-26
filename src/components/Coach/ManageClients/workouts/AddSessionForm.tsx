import {
  Input,
  Label,
  TextArea,
  TimeField,
  type TimeValue,
} from "@heroui/react";
import { parseTime } from "@internationalized/date";

import type {
  ManageWorkoutPlan,
  ManageWorkoutPlanDay,
} from "@/services/ManageClients/workout/getClients";

import ScheduleDateField from "../../../WorkoutSchedule/ScheduleDateField";
import ScheduleSelectField from "../../../WorkoutSchedule/ScheduleSelectField";

interface AddSessionFormProps {
  plans: ManageWorkoutPlan[];
  days: ManageWorkoutPlanDay[];
  isLoadingPlans: boolean;
  isLoadingDays: boolean;

  description: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  workoutPlanId: string;
  workoutDayId: string;

  onDescriptionChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onWorkoutPlanChange: (value: string) => void;
  onWorkoutDayChange: (value: string) => void;
}

function parseTimeValue(value: string, fallback: string) {
  try {
    const safeValue = value && value.length >= 5 ? value.slice(0, 5) : fallback;

    return parseTime(safeValue);
  } catch {
    return parseTime(fallback);
  }
}

function formatTimeValue(value: TimeValue | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  return `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;
}

export default function AddSessionForm({
  plans,
  days,
  isLoadingPlans,
  isLoadingDays,
  description,
  notes,
  date,
  startTime,
  endTime,
  workoutPlanId,
  workoutDayId,
  onDescriptionChange,
  onNotesChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onWorkoutPlanChange,
  onWorkoutDayChange,
}: AddSessionFormProps) {
  if (!isLoadingPlans && plans.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4">
        <p className="font-primary text-[14px] font-semibold text-[#0F0F14]">
          No workout plans found
        </p>

        <p className="mt-1 font-primary text-[12px] leading-5 text-[#72728A]">
          Assign a workout plan to this client first. After assignment, you can
          schedule sessions from that plan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white">
      <div className="space-y-1.5">
        <label className="block font-primary text-[12px] font-semibold text-[#0F0F14]">
          Session Title
        </label>

        <Input
          placeholder="Push Day"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="w-full font-primary text-[14px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScheduleSelectField
          label="Workout Plan"
          value={workoutPlanId}
          placeholder={
            isLoadingPlans ? "Loading plans..." : "Select workout plan"
          }
          options={plans.map((plan) => ({
            value: String(plan.plan_id),
            label: plan.plan_name,
            helperText: `${plan.source} • ${plan.total_exercises} exercises`,
          }))}
          onChange={onWorkoutPlanChange}
        />

        <ScheduleSelectField
          label="Workout Day"
          value={workoutDayId}
          placeholder={
            workoutPlanId
              ? isLoadingDays
                ? "Loading days..."
                : "Select workout day"
              : "Select a plan first"
          }
          options={days.map((day) => ({
            value: String(day.day_id),
            label: day.day_label || `Day ${day.day_order}`,
            helperText: `${day.total_exercises} exercises`,
          }))}
          onChange={onWorkoutDayChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScheduleDateField value={date} onChange={onDateChange} />

        <div className="grid grid-cols-2 gap-3">
          <TimeField
            className="w-full font-primary"
            value={parseTimeValue(startTime, "06:00")}
            onChange={(value) =>
              onStartTimeChange(formatTimeValue(value, "06:00"))
            }
            granularity="minute"
            hourCycle={12}
          >
            <Label className="font-primary text-[12px] font-semibold text-[#0F0F14]">
              Start Time
            </Label>

            <TimeField.Group
              fullWidth
              variant="secondary"
              className="h-[44px] rounded-xl border border-[#E5E7EB] bg-white"
            >
              <TimeField.Input className="px-3 font-primary text-[14px] text-[#0F0F14]">
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>

          <TimeField
            className="w-full font-primary"
            value={parseTimeValue(endTime, "07:00")}
            onChange={(value) =>
              onEndTimeChange(formatTimeValue(value, "07:00"))
            }
            granularity="minute"
            hourCycle={12}
          >
            <Label className="font-primary text-[12px] font-semibold text-[#0F0F14]">
              End Time
            </Label>

            <TimeField.Group
              fullWidth
              variant="secondary"
              className="h-[44px] rounded-xl border border-[#E5E7EB] bg-white"
            >
              <TimeField.Input className="px-3 font-primary text-[14px] text-[#0F0F14]">
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block font-primary text-[12px] font-semibold text-[#0F0F14]">
          Notes
        </label>

        <TextArea
          placeholder="Optional notes"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          className="h-24 w-full font-primary text-[14px]"
        />
      </div>
    </div>
  );
}
