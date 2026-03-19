import { Card, Chip } from "@heroui/react";

export interface SelectCardOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectCardGroupProps {
  options: SelectCardOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
}

/**
 * Shared HeroUI-based selection group used across the onboarding survey.
 * The parent owns the selected values, while this component only handles
 * the add/remove interaction for a cleaner TSX structure in each step.
 */
function SelectCardGroup({
  options,
  selectedValues,
  onChange,
  maxSelections,
}: SelectCardGroupProps) {
  // Clicking an already-selected card removes it.
  // Clicking a new card adds it unless the optional max has been reached.
  const handleToggle = (value: string) => {
    const isSelected = selectedValues.includes(value);

    if (isSelected) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    if (maxSelections && selectedValues.length >= maxSelections) {
      return;
    }

    onChange([...selectedValues, value]);
  };

  return (
    <div className="space-y-4">
      {maxSelections ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Select up to {maxSelections}
          </p>

          <Chip>
            {selectedValues.length} / {maxSelections}
          </Chip>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className="w-full text-left"
            >
              <Card
                className={[
                  "rounded-2xl border p-3 transition-all",
                  "hover:shadow-md",
                  isSelected
                    ? "border-[#5B5EF4] ring-2 ring-[#DCDDFE]"
                    : "border-[#E4E4EC]",
                ].join(" ")}
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{option.label}</h3>

                  {option.description ? (
                    <p className="text-sm text-zinc-500">
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
