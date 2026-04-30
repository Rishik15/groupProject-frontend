import { Button, Card, Label, TimeField } from "@heroui/react";
import { Clock, X } from "lucide-react";
import type { Time } from "@internationalized/date";
import type { AvailabilitySlot } from "../../../services/Setting/User";
import { parseBackendTime, formatTime, getTimeBoxClass } from "../utils";
import DayListBox from "./DayListBox";

type Props = {
  slot: AvailabilitySlot;
  index: number;
  edit: boolean;
  updateAvailabilityField: (
    index: number,
    key: keyof AvailabilitySlot,
    value: string,
  ) => void;
  removeAvailability: (index: number) => void;
};

const formatDisplayTime = (value?: string) => {
  if (!value) return "Not set";

  const [hourValue, minuteValue] = value.split(":");
  const hour = Number(hourValue);
  const minute = minuteValue ?? "00";

  if (Number.isNaN(hour)) return value;

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
};

export default function AvailabilityCard({
  slot,
  index,
  edit,
  updateAvailabilityField,
  removeAvailability,
}: Props) {
  const timeBoxClass = getTimeBoxClass(edit);

  if (!edit) {
    return (
      <Card data-testid={`availability-card-${index}`} className="rounded-2xl border border-[#E8E8EF] bg-[#FAFAFC] shadow-none">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
              {slot.day_of_week}
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0F0F14]">
                {slot.day_of_week}
              </p>
              <p className="mt-1 text-sm text-[#72728A]">
                {formatDisplayTime(slot.start_time)} to{" "}
                {formatDisplayTime(slot.end_time)}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#72728A] sm:flex">
            <Clock size={14} />
            Available
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-[#E8E8EF] bg-white p-4 shadow-sm">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        <div className="flex flex-col gap-2">
          <DayListBox
            slot={slot}
            edit={edit}
            updateDay={(value) =>
              updateAvailabilityField(index, "day_of_week", value)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-[#0F0F14]">
            Start Time
          </Label>

          <div className={timeBoxClass}>
            <TimeField
              className="flex w-full flex-row items-center"
              value={parseBackendTime(slot.start_time)}
              isReadOnly={!edit}
              onChange={(value) => {
                if (value) {
                  updateAvailabilityField(
                    index,
                    "start_time",
                    formatTime(value as Time),
                  );
                }
              }}
            >
              <TimeField.Input className="w-full outline-none"               data-testid={`start-time-${index}`}>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>

              <Clock size={18} className="text-[#72728A]" />
            </TimeField>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-[#0F0F14]">
            End Time
          </Label>

          <div className={timeBoxClass}>
            <TimeField
              className="flex w-full flex-row items-center"
              value={parseBackendTime(slot.end_time)}
              isReadOnly={!edit}
              onChange={(value) => {
                if (value) {
                  updateAvailabilityField(
                    index,
                    "end_time",
                    formatTime(value as Time),
                  );
                }
              }}
            >
              <TimeField.Input className="w-full outline-none"
              data-testid={`end-time-${index}`}
              >
                {(segment) => <TimeField.Segment segment={segment} />}

              </TimeField.Input>

              <Clock size={18} className="text-[#72728A]" />
            </TimeField>
          </div>
        </div>

        <Button
          onPress={() => removeAvailability(index)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8E8EF] bg-white text-gray-500 hover:bg-red-50 hover:text-red-500"
          data-testid={`remove-${index}`}
       >
          <X size={18} />
        </Button>
      </div>
    </Card>
  );
}
