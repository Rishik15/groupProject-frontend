import { Input } from "@heroui/react";
import type { ChangeEvent } from "react";
import {
  clientFitnessOptions,
  type ClientFitnessLevel,
  type ClientInfoValues,
} from "../../../utils/OnboardingSurvey/clientSurvey";

interface ClientInfoStepProps {
  values: ClientInfoValues;
  fitnessLevel: ClientFitnessLevel | "";
  onFieldChange: (name: keyof ClientInfoValues, value: string) => void;
  onFitnessLevelChange: (value: ClientFitnessLevel) => void;
}

function ClientInfoStep({
  values,
  fitnessLevel,
  onFieldChange,
  onFitnessLevelChange,
}: ClientInfoStepProps) {
  // Reuse one handler factory for all number inputs so the non-negative rule
  // stays consistent without repeating the same check in every field.
  const handleNonNegativeChange =
    (fieldName: keyof ClientInfoValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      // Block negative numbers at the input level so invalid values do not
      // enter component state. An empty string is still allowed for editing.
      if (value === "" || Number(value) >= 0) {
        onFieldChange(fieldName, value);
      }
    };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-3 text-[14px] font-semibold text-black">
          Current Fitness Level
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {clientFitnessOptions.map((option) => {
            const isSelected = fitnessLevel === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFitnessLevelChange(option.value)}
                className={[
                  "rounded-[18px] border px-2 py-2 text-center transition-all",
                  "min-h-[72px]",
                  isSelected
                    ? "border-[#5B5EF4] ring-2 ring-[#DCDDFE]"
                    : "border-[#E4E4EC]",
                ].join(" ")}
              >
                <div className="text-[16px] font-semibold text-black">
                  {option.label}
                </div>
                <div className="mt-1.5 text-[14px] leading-4 text-[#6E728C]">
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-[14px] font-semibold text-black">
            Age
          </label>
          <Input
            type="number"
            value={values.age}
            placeholder="28"
            onChange={handleNonNegativeChange("age")}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-black">
            Weight (lb)
          </label>
          <Input
            type="number"
            value={values.weight}
            placeholder="155"
            onChange={handleNonNegativeChange("weight")}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-black">
            Height (in)
          </label>
          <Input
            type="number"
            value={values.height}
            placeholder="68"
            onChange={handleNonNegativeChange("height")}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default ClientInfoStep;
