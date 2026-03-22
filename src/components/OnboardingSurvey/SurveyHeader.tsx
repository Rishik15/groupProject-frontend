import { ProgressBar } from "@heroui/react";

interface SurveyHeaderProps {
  badgeLabel: string;
  currentStep: number;
  totalSteps: number;
}

/**
 * Shared survey header with:
 * - a small badge for the flow
 * - current step text
 * - progress bar
 */
function SurveyHeader({
  badgeLabel,
  currentStep,
  totalSteps,
}: SurveyHeaderProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="border-b border-[#E4E4EC] px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-full bg-[#EEF0FF] px-4 py-2 text-[11.25px] font-medium text-[#5B5EF4]">
          {badgeLabel}
        </div>

        <div className="text-[11.25px] font-medium text-[#72728A]">
          {currentStep} / {totalSteps}
        </div>
      </div>

      <ProgressBar aria-label="Survey progress" value={progressPercent} className="w-full">
        <ProgressBar.Track className="h-1.5 w-full rounded-full bg-[#DCDDFE]">
          <ProgressBar.Fill className="rounded-full bg-[#5B5EF4]" />
        </ProgressBar.Track>
      </ProgressBar>
    </div>
  );
}

export default SurveyHeader;
