import { Button } from "@heroui/react";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";

export type CoachProfileTab = "about" | "reviews" | "success-stories";

interface CoachProfileTabsProps {
  selectedTab: CoachProfileTab;
  onTabChange: (tab: CoachProfileTab) => void;
}

const tabs: { key: CoachProfileTab; label: string }[] = [
  { key: "about", label: "About" },
  { key: "reviews", label: "Reviews" },
  { key: "success-stories", label: "Success Stories" },
];

// the tab row is broken into its own component so the page stays small.
export default function CoachProfileTabs({
  selectedTab,
  onTabChange,
}: CoachProfileTabsProps) {
  return (
    <div className="flex gap-3">
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab.key;

        return (
          <Button
            key={tab.key}
            variant="ghost"
            className={
              isSelected
                ? "rounded-full border px-5 py-2"
                : "rounded-full px-5 py-2"
            }
            style={{
              backgroundColor: isSelected
                ? coachReviewTheme.colors.white
                : coachReviewTheme.colors.tabBackground,
              borderColor: isSelected
                ? coachReviewTheme.colors.border
                : "transparent",
              color: coachReviewTheme.colors.heading,
              fontSize: coachReviewTheme.fontSizes.label,
            }}
            onPress={() => onTabChange(tab.key)}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
