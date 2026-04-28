import {
  Button,
  ListBox,
  Select,
  Card,
  Input,
  Label,
  TimeField,
} from "@heroui/react";
import { Clock, X } from "lucide-react";
import type { Time } from "@internationalized/date";
import type { AvailabilitySlot } from "../../../services/Setting/User";
import {
  parseBackendTime,
  formatTime,
  readonlyClass,
  getTimeBoxClass,
} from "../utils";
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

export default function AvailabilityCard({
  slot,
  index,
  edit,
  updateAvailabilityField,
  removeAvailability,
}: Props) {
  const timeBoxClass = getTimeBoxClass(edit);
  return (
    <Card className="rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="grid w-full grid-cols-4 gap-3">
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
          <Label>Start Time</Label>
          <div className={timeBoxClass}>
            <TimeField
              className="flex w-full flex-row"
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
              <TimeField.Input className="w-full outline-none">
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
              <Clock size={18} />
            </TimeField>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>End Time</Label>
          <div className={timeBoxClass}>
            <TimeField
              className="flex w-full flex-row"
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
              <TimeField.Input className="w-full outline-none">
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
              <Clock size={18} />
            </TimeField>
          </div>
        </div>

        <div className="ml-auto w-fit">
          <Button
            onPress={() => removeAvailability(index)}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
              !edit ? "invisible pointer-events-none" : ""
            }`}
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
