type Tab = "about" | "reviews" | "stories";

interface ProfileTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "about", label: "About" },
  { key: "reviews", label: "Reviews" },
  { key: "stories", label: "Success Stories" },
];

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex gap-6 border-b border-default-200">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`text-sm pb-2.5 border-b-2 transition-colors ${
            activeTab === key
              ? "border-foreground font-medium text-foreground"
              : "border-transparent text-default-400 hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export type { Tab };