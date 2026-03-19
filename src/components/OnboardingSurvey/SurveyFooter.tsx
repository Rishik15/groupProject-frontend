import { Button } from "@heroui/react";

interface SurveyFooterProps {
  onBack?: () => void;
  onNext: () => void;
  nextButtonLabel?: string;
  backButtonLabel?: string;
  isNextDisabled?: boolean;
}

/**
 * Shared footer navigation for onboarding surveys.
 * Back is optional because the first step does not show it.
 */
function SurveyFooter({
  onBack,
  onNext,
  nextButtonLabel = "Continue",
  backButtonLabel = "Back",
  isNextDisabled = false,
}: SurveyFooterProps) {
  return (
    <footer className="flex items-center justify-between gap-4 border-t border-[#E4E4EC] px-8 py-5">
      {onBack ? (
        <Button
          variant="outline"
          onPress={onBack}
          className="h-12 min-w-[110px] rounded-[14px] border-[#D9DCE8] bg-white text-black"
        >
          ← {backButtonLabel}
        </Button>
      ) : (
        <div />
      )}

      <Button
        variant="primary"
        onPress={onNext}
        isDisabled={isNextDisabled}
        className="h-12 min-w-[220px] rounded-[14px] bg-[#5B5EF4] text-white disabled:opacity-50"
      >
        {nextButtonLabel} →
      </Button>
    </footer>
  );
}

export default SurveyFooter;