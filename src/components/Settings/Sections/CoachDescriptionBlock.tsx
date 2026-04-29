import { Label, TextArea } from "@heroui/react";
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
  const description = form.coach_description?.trim();

  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-[#0F0F14]">
          Coach Description
        </h3>
        <p className="mt-1 text-xs text-[#72728A]">
          {edit
            ? "Write a short description that appears on your coach profile."
            : "This is what clients see when they view your coach profile."}
        </p>
      </div>

      {edit ? (
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-[#0F0F14]">
            Description
          </Label>

          <TextArea
            value={form.coach_description ?? ""}
            onChange={(e) => updateField("coach_description", e.target.value)}
            placeholder="Tell clients about your coaching style, experience, and what you help with..."
            className="
              w-full
              rounded-2xl
              border
              border-[#E8E8EF]
              bg-white
              px-4
              py-3
              text-sm
              [&_textarea]:min-h-32
              [&_textarea]:resize-none
              [&_textarea]:bg-transparent
              [&_textarea]:outline-none
            "
          />
        </div>
      ) : (
        <div className="min-h-28 rounded-2xl border border-[#E8E8EF] bg-[#FAFAFC] px-5 py-4">
          {description ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#0F0F14]">
              {description}
            </p>
          ) : (
            <p className="text-sm text-[#72728A]">
              No coach description added yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
