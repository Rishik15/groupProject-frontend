import { Card, Chip } from "@heroui/react";
import type { SelectCardOption } from "../../utils/Interfaces/OnboardingSurvey/selectCard";

interface SelectCardGroupProps {
  options: SelectCardOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
}

/**
 * Reusable multi-select card group used by several onboarding steps.
 *
 * Important:
 * - The parent owns the selected values.
 * - This component only handles the click/toggle UI.
 * - An optional max selection count can block extra selections.
 */
function SelectCardGroup({
  options,
  selectedValues,
  onChange,
  maxSelections,
}: SelectCardGroupProps) {
  const selectedCount = selectedValues.length;

  const isSelected = (value: string) => selectedValues.includes(value);

  const handleToggle = (value: string) => {
    if (isSelected(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    const hasReachedMax =
      typeof maxSelections === "number" && selectedCount >= maxSelections;

    if (hasReachedMax) {
      return;
    }

    onChange([...selectedValues, value]);
  };

  return (
    <div className="space-y-5">
      {typeof maxSelections === "number" ? (
        <div className="text-[11.25px] flex items-center justify-between">
          <Chip className="text-[11.25px]">
            {selectedCount} / {maxSelections}
          </Chip>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {options.map((option) => {
          const optionSelected = isSelected(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className="w-full text-left"
            >
              <Card
                className={[
                  "rounded-2xl border p-3 transition-all h-full",
                  "hover:shadow-md",
                  optionSelected
                    ? "border-[#5B5EF4] ring-2 ring-[#DCDDFE]"
                    : "border-[#E4E4EC]",
                ].join(" ")}
              >
                <div className="space-y-1">
                  <h3 className="text-[13.125px] font-semibold text-[#0F0F14]">
                    {option.label}
                  </h3>

                  {option.description ? (
                    <p className="text-[11.25px] font-medium text-[#72728A]">
                      {option.description}
                    </p>
                  ) : null}
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectCardGroup;
