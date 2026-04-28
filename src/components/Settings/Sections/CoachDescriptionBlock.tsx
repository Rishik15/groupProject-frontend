import { Label } from "@heroui/react";
import type { User } from "../../../services/Setting/User";

type CoachDescriptionBlockProps = {
  form: User;
  edit: boolean;
  updateField: (key: keyof User, value: string | number) => void;
};

export function CoachDescriptionBlock({
  form,
  edit,
  updateField,
}: CoachDescriptionBlockProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>Coach Description</Label>
      <textarea
        value={form.coach_description ?? ""}
        readOnly={!edit}
        onChange={(e) => updateField("coach_description", e.target.value)}
        className={`min-h-32 w-full resize-none rounded-md px-3 py-3 text-sm outline-none ${
          edit
            ? "border border-gray-200 bg-white"
            : "border border-transparent bg-gray-100"
        }`}
      />
    </div>
  );
}
