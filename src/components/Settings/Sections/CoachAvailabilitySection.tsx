import { Button } from "@heroui/react";
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0F0F14]">Availability</h3>
          <p className="mt-1 text-xs text-[#72728A]">
            {edit
              ? "Add or update the days and times clients can book you."
              : "Your weekly booking availability shown to clients."}
          </p>
        </div>

        {edit && (
          <Button
            onPress={addAvailability}
            data-testid="add"
            className="h-10 rounded-xl bg-indigo-500 px-4 text-sm font-medium text-white"
          >
            <Plus size={17} />
            Add
          </Button>
        )}
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
        <div className="rounded-2xl border border-dashed border-[#D9DBE3] bg-[#FAFAFC] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[#0F0F14]">
            No availability set
          </p>
          <p className="mt-1 text-xs text-[#72728A]">
            {edit
              ? "Click Add to create your first availability slot."
              : "No booking times are currently available."}
          </p>
        </div>
      )}
    </div>
  );
}
