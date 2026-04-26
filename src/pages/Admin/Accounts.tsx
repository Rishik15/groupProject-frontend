import { Button, Card } from "@heroui/react";
import { useState } from "react";
import { ActiveCoachesTab, UsersTab } from "../../components/Admin/Accounts";

type AccountsTab = "users" | "active-coaches";

const accountTabs: Array<{
    key: AccountsTab;
    label: string;
    description: string;
}> = [
        {
            key: "users",
            label: "Users",
            description: "All registered users, account status, and enforcement actions.",
        },
        {
            key: "active-coaches",
            label: "Active Coaches",
            description: "Current coaches, prices, certifications, and contract counts.",
        },
    ];

const Accounts = () => {
    const [selectedTab, setSelectedTab] = useState<AccountsTab>("users");
    return (
        <div>
            <div className="py-6 px-36 border-b border-neutral-200 bg-white">
                <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                    Account oversight
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-default-600">
                    Review platform accounts, manage suspension and deactivation
                    flows, and inspect the active coach roster from one shared page.
                </p>
            </div>

            <div className="min-h-[calc(100vh-56px)] px-36 py-8">
                <Card className="space-y-6 bg-white">
                    <div className="flex flex-col gap-4 p-6">
                        <div className="flex flex-wrap gap-3">
                            {accountTabs.map((tab) => {
                                const isActive = tab.key === selectedTab;
                                return (
                                    <Button
                                        key={tab.key}
                                        onPress={() => setSelectedTab(tab.key)}
                                        className={isActive ? "bg-[#5B5EF4] font-semibold" : "bg-[#5B5EF4] text-default-700"}
                                    >
                                        {tab.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedTab === "users" ? <UsersTab /> : <ActiveCoachesTab />}
                </Card>
            </div>
        </div>
    );
};

export default Accounts;