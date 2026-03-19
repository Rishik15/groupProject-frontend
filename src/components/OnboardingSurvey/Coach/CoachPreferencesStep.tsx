import {
  coachAvailabilityOptions,
  coachClientTypeOptions,
  coachSessionFormatOptions,
} from "../../../utils/OnboardingSurvey/coachSurvey";

interface CoachPreferencesStepProps {
  clientTypes: string[];
  sessionFormats: string[];
  availability: string[];
  onClientTypesChange: (values: string[]) => void;
  onSessionFormatsChange: (values: string[]) => void;
  onAvailabilityChange: (values: string[]) => void;
}

// Shared toggle helper for the preference groups below.
// It keeps each button click handler short and consistent.
function toggleValue(values: string[], value: string) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  return [...values, value];
}

function CoachPreferencesStep({
  clientTypes,
  sessionFormats,
  availability,
  onClientTypesChange,
  onSessionFormatsChange,
  onAvailabilityChange,
}: CoachPreferencesStepProps) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="mb-4 text-[15px] font-semibold">Who do you coach?</h2>

        <div className="grid grid-cols-2 gap-4">
          {coachClientTypeOptions.map((option) => {
            const isSelected = clientTypes.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onClientTypesChange(toggleValue(clientTypes, option.value))
                }
                className="w-full text-left"
              >
                <div
                  className={[
                    "rounded-2xl border p-3 transition-all",
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
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-[15px] font-semibold">Session Format</h2>

        <div className="grid grid-cols-2 gap-4">
          {coachSessionFormatOptions.map((option) => {
            const isSelected = sessionFormats.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onSessionFormatsChange(
                    toggleValue(sessionFormats, option.value)
                  )
                }
                className={[
                  "w-full rounded-2xl border p-3 text-center transition-all",
                  isSelected
                    ? "border-[#5B5EF4] ring-2 ring-[#DCDDFE] text-[#5B5EF4]"
                    : "border-[#E4E4EC]",
                ].join(" ")}
              >
                <span className="text-sm font-semibold">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-[15px] font-semibold">Availability</h2>

        <div className="grid grid-cols-2 gap-4">
          {coachAvailabilityOptions.map((option) => {
            const isSelected = availability.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onAvailabilityChange(toggleValue(availability, option.value))
                }
                className="w-full text-left"
              >
                <div
                  className={[
                    "rounded-2xl border p-3 transition-all",
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
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CoachPreferencesStep;
