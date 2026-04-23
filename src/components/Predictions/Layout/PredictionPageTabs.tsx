import type { Key } from "react";
import { Tabs } from "@heroui/react";
import { Flag, LayoutGrid, ReceiptText, Trophy } from "lucide-react";

export type PredictionPageTabKey =
    | "gambling-den"
    | "my-bets"
    | "my-markets"
    | "leaderboard";

export interface PredictionPageTabsProps {
    activeTab: PredictionPageTabKey;
    onChange: (tab: PredictionPageTabKey) => void;
}

const tabs: Array<{
    key: PredictionPageTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
        { key: "gambling-den", label: "Gambling Den", icon: LayoutGrid },
        { key: "my-bets", label: "My Bets", icon: ReceiptText },
        { key: "my-markets", label: "My Markets", icon: Flag },
        { key: "leaderboard", label: "Leaderboard", icon: Trophy },
    ];

export default function PredictionPageTabs({
    activeTab,
    onChange,
}: PredictionPageTabsProps) {
    return (
        <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key: Key) =>
                onChange(key as PredictionPageTabKey)
            }
            variant="secondary"
            className="w-full"
        >
            <Tabs.ListContainer className="w-full overflow-x-auto">
                <Tabs.List
                    aria-label="Prediction page sections"
                    className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2"
                >
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <Tabs.Tab
                            key={key}
                            id={key}
                            className="rounded-xl px-4 py-2 text-[13.125px] font-medium text-slate-600 transition data-[selected=true]:bg-[#5B5EF4] data-[selected=true]:text-white"
                        >
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                <Icon className="h-4 w-4" strokeWidth={2.2} />
                                {label}
                            </span>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs.ListContainer>

            {tabs.map(({ key }) => (
                <Tabs.Panel key={key} id={key} className="hidden">
                    {null}
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}