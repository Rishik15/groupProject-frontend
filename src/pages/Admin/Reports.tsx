import { Button, Card } from "@heroui/react";
import {
    ClipboardList,
    FileWarning,
} from "lucide-react";
import { useState } from "react";
import { ClosedReportsTab, OpenReportsTab } from "../../components/Admin/Reports";

type ReportsTab = "open" | "closed";

const reportTabs: Array<{
    key: ReportsTab;
    label: string;
    icon: typeof FileWarning;
    description: string;
}> = [
        {
            key: "open",
            label: "Open Reports",
            icon: FileWarning,
            description: "Review reports awaiting moderation and close them with an admin note.",
        },
        {
            key: "closed",
            label: "Closed Reports",
            icon: ClipboardList,
            description: "Review previous moderation outcomes and stored admin action history.",
        },
    ];

const Reports = () => {
    const [selectedTab, setSelectedTab] = useState<ReportsTab>("open");

    const currentTab = reportTabs.find((tab) => tab.key === selectedTab) ?? reportTabs[0];

    return (
        <div>
            <div className="py-6 px-36 border-b border-neutral-200 bg-white">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                        Conduct moderation
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-default-600">
                        Review open platform reports, record moderation outcomes, and reference closed report history.
                    </p>
                </div>
            </div>

            <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
                <div className="space-y-6">
                    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                                    Report tabs
                                </p>
                                <p className="mt-1 text-sm text-default-600">{currentTab.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {reportTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const active = currentTab.key === tab.key;

                                    return (
                                        <Button
                                            key={tab.key}
                                            onPress={() => setSelectedTab(tab.key)}
                                            className={active ? "bg-[#5B5EF4] font-semibold" : "bg-[#5B5EF4] text-default-700"}
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

                    {selectedTab === "open" ? <OpenReportsTab /> : <ClosedReportsTab />}
                </div>
            </div>
        </div >
    );
};

export default Reports;