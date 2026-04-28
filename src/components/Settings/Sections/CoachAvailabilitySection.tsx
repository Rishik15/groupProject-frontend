import { Label, Button } from "@heroui/react";
import type { AvailabilitySlot } from "../../../services/Setting/User";
import AvailabilityCard from "../Components/AvailabilityCard";
import { Plus } from "lucide-react";

type CoachAvailabilitySectionProps = {
  availability?: AvailabilitySlot[];
  edit: boolean;
  updateAvailabilityField: (
    index: number,
    key: keyof AvailabilitySlot,
    value: string,
  ) => void;
  addAvailability: () => void;
  removeAvailability: (index: number) => void;
};

export default function CoachAvailabilitySection({
  availability,
  edit,
  updateAvailabilityField,
  addAvailability,
  removeAvailability,
}: CoachAvailabilitySectionProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-row items-center">
        <Label>Availability</Label>

        <div className="ml-auto">
          <Button
            onPress={addAvailability}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
              !edit ? "invisible pointer-events-none" : ""
            }`}
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>

      {availability && availability.length > 0 ? (
        <div className="flex flex-col gap-3">
          {availability.map((slot, index) => (
            <AvailabilityCard
              key={`${slot.day_of_week}-${index}`}
              slot={slot}
              index={index}
              edit={edit}
              updateAvailabilityField={updateAvailabilityField}
              removeAvailability={removeAvailability}
            />
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
