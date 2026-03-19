import { Card, Chip } from "@heroui/react";
import type {
  ClientInfoValues,
  ClientFitnessLevel,
} from "../../../utils/OnboardingSurvey/clientSurvey";
import { clientGoalLabelMap } from "../../../utils/OnboardingSurvey/clientSurvey";

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
  // Convert the stored enum-like value into a readable label for the summary.
  // Keeping this tiny formatting step here avoids duplicating display-only labels
  // inside form state.
  const formattedFitnessLevel = fitnessLevel
    ? `${fitnessLevel.charAt(0).toUpperCase()}${fitnessLevel.slice(1)}`
    : "Not provided";

  return (
    <div className="space-y-5">
      <Card className="rounded-[20px] border border-[#CFCFFE] bg-[#F7F7FF] px-6 py-6 shadow-none">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8E8FF] text-[28px] text-[#5B5EF4]">
            ✓
          </div>

          <div className="flex-1">
            <h2 className="text-[18px] font-semibold text-black">
              Profile Complete
            </h2>

            <p className="mt-1 text-[15px] text-[#6E728C]">
              {goals.length} goal{goals.length === 1 ? "" : "s"} selected ·{" "}
              {formattedFitnessLevel} level
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-[14px] text-[#6E728C]">
              <span>
                <span className="font-medium text-black">Age:</span>{" "}
                {values.age || "—"}
              </span>
              <span>
                <span className="font-medium text-black">Weight:</span>{" "}
                {values.weight || "—"} lb
              </span>
              <span>
                <span className="font-medium text-black">Height:</span>{" "}
                {values.height || "—"} in
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] px-6 py-6 shadow-none">
        <h3 className="text-[17px] font-semibold text-black">
          Selected Goals
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">
          {/*
            Goals are stored as stable option values in state. The label map turns
            those values back into user-facing text so this HeroUI chip list stays
            simple and consistent with the selection step.
          */}
          {goals.length > 0 ? (
            goals.map((goal) => (
              <Chip
                key={goal}
                className="bg-[#E8E8FF] text-[14px] font-medium text-[#5B5EF4]"
              >
                {clientGoalLabelMap[goal] ?? goal}
              </Chip>
            ))
          ) : (
            <p className="text-[14px] text-[#6E728C]">No goals selected</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ClientSummaryStep;
