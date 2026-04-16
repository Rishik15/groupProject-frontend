import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface SurveyFooterProps {
  onBack?: () => void;
  onNext: () => void;
  nextButtonLabel?: string;
  backButtonLabel?: string;
  isNextDisabled?: boolean;
}

/**
 * Shared footer navigation for survey screens.
 * The first step does not pass an onBack handler, so no back button is shown.
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
          className="flex items-center h-[37.5px] px-4 rounded-[14px] border-[#D9DCE8] bg-white text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          {backButtonLabel}
        </Button>
      ) : (
        <div />
      )}

      <Button
        variant="primary"
        onPress={onNext}
        isDisabled={isNextDisabled}
        className="h-[37.5px px-4 rounded-[14px] bg-[#5B5EF4] text-white disabled:opacity-50"
      >
        {nextButtonLabel}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </footer>
  );
}

export default SurveyFooter;
