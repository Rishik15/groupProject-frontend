import { Input, Label, TimeField } from "@heroui/react";
import type { Time } from "@internationalized/date";
import type { AvailabilitySlot } from "../../services/Setting/User";
import {
  parseBackendTime,
  formatTime,
  readonlyClass,
  getTimeBoxClass,
} from "./utils";

type CoachAvailabilitySectionProps = {
  availability?: AvailabilitySlot[];
  edit: boolean;
  updateAvailabilityField: (
    index: number,
    key: keyof AvailabilitySlot,
    value: string
  ) => void;
};

export default function CoachAvailabilitySection({
  availability,
  edit,
  updateAvailabilityField,
}: CoachAvailabilitySectionProps) {
  const timeBoxClass = getTimeBoxClass(edit);

  return (
    <div className="flex w-full flex-col gap-2">
      <Label>Availability</Label>

      {availability && availability.length > 0 ? (
        <div className="flex w-full flex-col gap-3">
          {availability.map((slot, index) => (
            <div
              key={`${slot.day_of_week}-${index}`}
              className="grid w-full grid-cols-3 gap-3 rounded-md border border-gray-200 p-3"
            >
              <div className="flex flex-col gap-2">
                <Label>Day</Label>
                <Input
                  value={slot.day_of_week}
                  readOnly
                  className={readonlyClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Start Time</Label>
                <div className={timeBoxClass}>
                  <TimeField
                    value={parseBackendTime(slot.start_time)}
                    isReadOnly={!edit}
                    onChange={(value) => {
                      if (value) {
                        updateAvailabilityField(
                          index,
                          "start_time",
                          formatTime(value as Time)
                        );
                      }
                    }}
                  >
                    <TimeField.Input className="w-full outline-none">
                      {(segment) => <TimeField.Segment segment={segment} />}
                    </TimeField.Input>
                  </TimeField>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>End Time</Label>
                <div className={timeBoxClass}>
                  <TimeField
                    value={parseBackendTime(slot.end_time)}
                    isReadOnly={!edit}
                    onChange={(value) => {
                      if (value) {
                        updateAvailabilityField(
                          index,
                          "end_time",
                          formatTime(value as Time)
                        );
                      }
                    }}
                  >
                    <TimeField.Input className="w-full outline-none">
                      {(segment) => <TimeField.Segment segment={segment} />}
                    </TimeField.Input>
                  </TimeField>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-gray-100 px-3 py-3 text-sm text-gray-500">
          No availability set
        </div>
      )}
    </div>
  );
}