import type { ReactNode } from "react";

import SurveyFooter from "./SurveyFooter";
import SurveyHeader from "./SurveyHeader";

interface SurveyLayoutProps {
  badgeLabel: string;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextButtonLabel?: string;
  backButtonLabel?: string;
  isNextDisabled?: boolean;
}

/**
 * Shared page shell for all onboarding steps.
 * Each survey page passes the step-specific content in through children.
 */
function SurveyLayout({
  badgeLabel,
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextButtonLabel = "Continue",
  backButtonLabel = "Back",
  isNextDisabled = false,
}: SurveyLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F4F4F7] px-4 py-12 flex items-center justify-center">
      <div className="mx-auto w-full max-w-104.5">
        {/* Small product mark shown above the survey card. */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5B5EF4] text-[10px] font-bold text-white">
            βF
          </div>
          <div className="text-[15px] font-bold">βFit</div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#E4E4EC] bg-white shadow-sm">
          <SurveyHeader
            badgeLabel={badgeLabel}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

          <section className="px-8 py-6">
            <h1 className="text-[18.75px] font-bold text-[#0F0F14]">{title}</h1>

            {subtitle ? (
              <p className="text-[13.25px] text-[#72728A]">{subtitle}</p>
            ) : null}

            <div className="mt-5">{children}</div>
          </section>

          <SurveyFooter
            onBack={onBack}
            onNext={onNext}
            nextButtonLabel={nextButtonLabel}
            backButtonLabel={backButtonLabel}
            isNextDisabled={isNextDisabled}
          />
        </div>
      </div>
    </main>
  );
}

export default SurveyLayout;
