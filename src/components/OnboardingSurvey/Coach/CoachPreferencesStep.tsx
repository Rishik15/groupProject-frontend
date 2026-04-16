import SelectCardGroup from "../SelectCardGroup";

import type { CoachAvailabilityBlock } from "../../../utils/Interfaces/OnboardingSurvey/coach";

import {
  coachClientTypeOptions,
  coachDayLabelMap,
  coachDaysOfWeek,
  coachSessionFormatOptions,
} from "../../../utils/OnboardingSurvey/coachConfig";

import {
  createEmptyAvailabilityBlock,
  getOverlappingAvailabilityBlockIds,
  isAvailabilityBlockValid,
} from "../../../utils/OnboardingSurvey/coachHelpers";

interface CoachPreferencesStepProps {
  clientTypes: string[];
  sessionFormats: string[];
  price: string;
  availability: CoachAvailabilityBlock[];
  onClientTypesChange: (values: string[]) => void;
  onSessionFormatsChange: (values: string[]) => void;
  onPriceChange: (value: string) => void;
  onAvailabilityChange: (values: CoachAvailabilityBlock[]) => void;
}

function toggleValue(values: string[], value: string) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  return [...values, value];
}

function normalizePriceInput(value: string) {
  const digitsAndDotsOnly = value.replace(/[^\d.]/g, "");
  const [wholePart = "", ...decimalParts] = digitsAndDotsOnly.split(".");

  if (decimalParts.length === 0) {
    return wholePart;
  }

  return `${wholePart}.${decimalParts.join("")}`;
}

function CoachPreferencesStep({
  clientTypes,
  sessionFormats,
  price,
  availability,
  onClientTypesChange,
  onSessionFormatsChange,
  onPriceChange,
  onAvailabilityChange,
}: CoachPreferencesStepProps) {
  // We calculate overlapping ids once so each block card can look up whether
  // it has a conflict without repeating the full overlap check.
  const overlappingBlockIds = new Set(
    getOverlappingAvailabilityBlockIds(availability),
  );

  const addAvailabilityBlock = (
    dayOfWeek: CoachAvailabilityBlock["dayOfWeek"],
  ) => {
    onAvailabilityChange([
      ...availability,
      createEmptyAvailabilityBlock(dayOfWeek),
    ]);
  };

  const updateAvailabilityBlock = (
    id: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    onAvailabilityChange(
      availability.map((block) =>
        block.id === id ? { ...block, [field]: value } : block,
      ),
    );
  };

  const removeAvailabilityBlock = (id: string) => {
    onAvailabilityChange(availability.filter((block) => block.id !== id));
  };

  const hasInvalidBlock = availability.some(
    (block) => !isAvailabilityBlockValid(block),
  );
  const hasOverlappingBlocks = overlappingBlockIds.size > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-[13.125px] text-[#0F0F14] font-semibold">
          Prefered Client Skill Level
        </h2>

        {/* Reuse the shared card picker here so this section matches the other
            survey steps and avoids duplicate card-selection markup. */}
        <SelectCardGroup
          options={coachClientTypeOptions}
          selectedValues={clientTypes}
          onChange={onClientTypesChange}
        />
      </div>

      <div>
        <h2 className="mb-4 text-[13.125px] text-[#0F0F14] font-semibold">
          Session Format
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {coachSessionFormatOptions.map((option) => {
            const isSelected = sessionFormats.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onSessionFormatsChange(
                    toggleValue(sessionFormats, option.value),
                  )
                }
                className={[
                  "w-full rounded-2xl border px-3 py-1 transition-all",
                  isSelected
                    ? "border-[#5B5EF4] ring-2 ring-[#DCDDFE] text-[#5B5EF4]"
                    : "border-[#E4E4EC]",
                ].join(" ")}
              >
                <span className="text-[13.125px] text-[#0F0F14] font-semibold">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-[13.125px] text-[#0F0F14] font-semibold">
          Coaching Price
        </h2>
        <p className="mt-1 text-[11.25px] text-[#72728A]">
          Enter numbers only. Do not include a dollar sign.
        </p>

        <div className="mt-2 max-w-sm">
          <label className="block">
            <span className="mb-1 block text-[13.125px] text-[#0F0F14] font-medium">
              Price
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="50"
              value={price}
              onChange={(event) =>
                onPriceChange(normalizePriceInput(event.target.value))
              }
              className="block h-[37.5] w-93.25 rounded-xl border border-[#E4E4EC] bg-white px-3 py-2 text-[13.125px] text-[#0F0F14] outline-none transition focus:border-[#5B5EF4]"
            />
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[13.125px] text-[#0F0F14] font-semibold">
              Weekly Availability
            </h2>
            <p className="mt-1 text-[11.25px] text-[#72728A]">
              Add one or more weekly time blocks for each day. Blocks on the
              same day cannot overlap.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5">
          {coachDaysOfWeek.map((dayOfWeek) => {
            const dayBlocks = availability.filter(
              (block) => block.dayOfWeek === dayOfWeek,
            );

            return (
              <div
                key={dayOfWeek}
                className="rounded-2xl border border-[#E4E4EC] bg-[#FAFAFD] px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[13.125px] text-[#0F0F14] font-semibold">
                      {coachDayLabelMap[dayOfWeek]}
                    </h3>
                    <p className="text-[9px] text-[#72728A]">
                      {dayBlocks.length === 0
                        ? "No blocks added yet"
                        : `${dayBlocks.length} ${
                            dayBlocks.length === 1 ? "block" : "blocks"
                          } added`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addAvailabilityBlock(dayOfWeek)}
                    className="rounded-xl border border-[#DCDDFE] bg-white px-2 py-1 text-[11px] font-medium text-[#5B5EF4] transition hover:bg-[#F7F7FF]"
                  >
                    Add Block
                  </button>
                </div>

                {dayBlocks.length > 0 ? (
                  <div className="mt-3.5 space-y-2.5">
                    {dayBlocks.map((block, index) => {
                      const isInvalid = !isAvailabilityBlockValid(block);
                      const isOverlapping = overlappingBlockIds.has(block.id);

                      return (
                        <div
                          key={block.id}
                          className={[
                            "rounded-2xl border bg-white px-3 py-2.5",
                            isInvalid || isOverlapping
                              ? "border-red-300"
                              : "border-[#E4E4EC]",
                          ].join(" ")}
                        >
                          <div className="mb-2.5 flex items-center justify-between gap-3">
                            <p className="text-[11px] text-[#0F0F14]font-medium">
                              Block {index + 1}
                            </p>

                            <button
                              type="button"
                              onClick={() => removeAvailabilityBlock(block.id)}
                              className="text-[11px] font-medium text-red-500 transition hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5 2xl:grid-cols-2 2xl:gap-4">
                            <label className="block min-w-0">
                              <span className="mb-1 block text-[13.125px] text-[#0F0F14] font-medium">
                                Start time
                              </span>
                              <input
                                type="time"
                                step={900}
                                value={block.startTime}
                                onChange={(event) =>
                                  updateAvailabilityBlock(
                                    block.id,
                                    "startTime",
                                    event.target.value,
                                  )
                                }
                                className="block h-[37.5px] w-full min-w-0 rounded-xl border border-[#E4E4EC] bg-white px-3 py-2 text-[13.125px] text-[#0F0F14] outline-none transition focus:border-[#5B5EF4]"
                              />
                            </label>

                            <label className="block min-w-0">
                              <span className="mb-1 block text-[13.125px] text-[#0F0F14]-medium">
                                End time
                              </span>
                              <input
                                type="time"
                                step={900}
                                value={block.endTime}
                                onChange={(event) =>
                                  updateAvailabilityBlock(
                                    block.id,
                                    "endTime",
                                    event.target.value,
                                  )
                                }
                                className="block h-[37.5px] w-full min-w-0 rounded-xl border border-[#E4E4EC] bg-white px-3 py-2 text-[13.125px] text-[#0F0F14] outline-none transition focus:border-[#5B5EF4]"
                              />
                            </label>
                          </div>

                          {isInvalid ? (
                            <p className="mt-2.5 text-[13.125px] text-red-500">
                              End time must be later than start time.
                            </p>
                          ) : null}

                          {!isInvalid && isOverlapping ? (
                            <p className="mt-2.5 text-[13.125px] text-red-500">
                              This block overlaps another block on the same day.
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {hasInvalidBlock || hasOverlappingBlocks ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13.125px] text-red-600">
            {hasInvalidBlock
              ? "Fix any block where the end time is earlier than the start time."
              : "Remove overlapping blocks on the same day before continuing."}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CoachPreferencesStep;
