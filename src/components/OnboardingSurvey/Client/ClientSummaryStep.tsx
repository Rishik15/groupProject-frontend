import { Card, Chip } from "@heroui/react";

import type {
  ClientFitnessLevel,
  ClientInfoValues,
} from "../../../utils/Interfaces/OnboardingSurvey/client";

import {
  clientGoalLabelMap,
} from "../../../utils/OnboardingSurvey/clientConfig";

interface ClientSummaryStepProps {
  goals: string[];
  values: ClientInfoValues;
  fitnessLevel?: ClientFitnessLevel | "";
}

/**
 * Final client onboarding summary.
 * Shows the completed profile info and the selected goals.
 */
function ClientSummaryStep({
  goals,
  values,
  fitnessLevel = "",
}: ClientSummaryStepProps) {
  // Convert the stored value into readable summary text.
  const formattedFitnessLevel = fitnessLevel
    ? `${fitnessLevel.charAt(0).toUpperCase()}${fitnessLevel.slice(1)}`
    : "Not provided";

  return (
    <div className="space-y-3">
      <Card className="rounded-[20px] border border-[#CFCFFE] bg-[#F7F7FF] px-6 py-3 shadow-none">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8E8FF] text-[18.75px] text-[#5B5EF4]">
            ✓
          </div>

          <div className="flex-1">
            <h2 className="text-[13.125px] font-semibold text-black">
              Profile Complete
            </h2>

            <p className="mt-1 text-[13.125px] text-[#6E728C]">
              {goals.length} goal{goals.length === 1 ? "" : "s"} selected ·{" "}
              {formattedFitnessLevel} level
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-[13.125px] text-[#6E728C]">
              <span>
                <span className="font-medium text-black">Height:</span>{" "}
                {values.height || "—"} in
              </span>
              <span>
                <span className="font-medium text-black">Weight:</span>{" "}
                {values.weight || "—"} lb
              </span>
              <span>
                <span className="font-medium text-black">Weight Goal:</span>{" "}
                {values.goalWeight || "—"}
                {values.goalWeight ? " lb" : ""}
              </span>
              <span>
                <span className="font-medium text-black">DOB:</span>{" "}
                {values.dateOfBirth || "—"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] px-6 py-4 shadow-none">
        <h3 className="text-[13.125px] font-semibold text-black">
          Selected Goals
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {/* Goal values stay stable in state, and this label map converts them
              back to friendly text for the summary UI. */}
          {goals.length > 0 ? (
            goals.map((goal) => (
              <Chip
                key={goal}
                className="bg-[#E8E8FF] text-[13.125px] font-medium text-[#5B5EF4]"
              >
                {clientGoalLabelMap[goal] ?? goal}
              </Chip>
            ))
          ) : (
            <p className="text-[13.125px] text-[#6E728C]">No goals selected</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ClientSummaryStep;
