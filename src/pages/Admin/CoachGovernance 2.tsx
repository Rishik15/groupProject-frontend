import { Button, Card } from "@heroui/react";
import { BadgeDollarSign, ClipboardList } from "lucide-react";
import { useState } from "react";
import CoachApplicationsTab from "../../components/Admin/CoachGovernance/CoachApplicationsTab";
import CoachPricesTab from "../../components/Admin/CoachGovernance/CoachPricesTab";

type GovernanceTab = "applications" | "coach-prices";

const governanceTabs: Array<{
  key: GovernanceTab;
  label: string;
  icon: typeof ClipboardList;
  description: string;
}> = [
  {
    key: "applications",
    label: "Applications",
    icon: ClipboardList,
    description:
      "Review coach applications by status, search applicants, and approve or reject with an admin note.",
  },
  {
    key: "coach-prices",
    label: "Coach Prices",
    icon: BadgeDollarSign,
    description:
      "Review pending coach price requests and approve or reject each proposal with a recorded admin action.",
  },
];

const CoachGovernance = () => {
  const [selectedTab, setSelectedTab] = useState<GovernanceTab>("applications");

  const currentTab =
    governanceTabs.find((tab) => tab.key === selectedTab) ?? governanceTabs[0];

  return (
    <div>
      <div className="justify-between items-center px-38 py-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="space-y-3">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-default-900">
              Coach review and pricing oversight
            </h1>
            <p className="mt-2 max-w-3xl text-[13.125px] leading-6 text-default-600">
              Review coach applications and coach price moderation from one
              fixed admin page.
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
        <div className="space-y-6">
          <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                  Governance tabs
                </p>
                <p className="mt-1 text-sm text-default-600">
                  {currentTab.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {governanceTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = currentTab.key === tab.key;

                  return (
                    <Button
                      key={tab.key}
                      onPress={() => setSelectedTab(tab.key)}
                      className={
                        active
                          ? "bg-[#5B5EF4] font-semibold"
                          : "bg-[#5B5EF4] text-default-700"
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>

          {selectedTab === "applications" ? (
            <CoachApplicationsTab />
          ) : (
            <CoachPricesTab />
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachGovernance;
