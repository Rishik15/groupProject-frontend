import { Chip } from "@heroui/react";
import type { CoachContractTabKey } from "../../utils/Interfaces/Contracts/coachContracts";

interface CoachContractsTabsProps {
    selectedKey: CoachContractTabKey;
    pendingCount: number;
    activeCount: number;
    historyCount: number;
    onSelectionChange: (key: CoachContractTabKey) => void;
}

interface TabButtonProps {
    label: string;
    count: number;
    tabKey: CoachContractTabKey;
    selectedKey: CoachContractTabKey;
    onSelectionChange: (key: CoachContractTabKey) => void;
}

const textStyle = {
    fontSize: "13.125px",
};

const TabButton = ({
    label,
    count,
    tabKey,
    selectedKey,
    onSelectionChange,
}: TabButtonProps) => {
    const isSelected = selectedKey === tabKey;

    return (
        <button
            type="button"
            onClick={() => onSelectionChange(tabKey)}
            className={`rounded-xl px-5 py-3 transition ${isSelected ? "bg-white shadow-sm" : "bg-transparent"
                }`}
        >
            <div className="flex items-center gap-2">
                <span
                    style={{
                        ...textStyle,
                        color: "#0F0F14",
                        fontWeight: isSelected ? 600 : 500,
                    }}
                >
                    {label}
                </span>

                <Chip
                    variant="soft"
                    className={isSelected ? "bg-[#F1F1FF]" : "bg-[#ECECF3]"}
                    style={textStyle}
                >
                    {count}
                </Chip>
            </div>
        </button>
    );
};

const CoachContractsTabs = ({
    selectedKey,
    pendingCount,
    activeCount,
    historyCount,
    onSelectionChange,
}: CoachContractsTabsProps) => {
    return (
        <div className="w-fit rounded-2xl bg-[#F5F5F8] p-1">
            <div className="flex items-center">
                <TabButton
                    label="Pending"
                    count={pendingCount}
                    tabKey="pending"
                    selectedKey={selectedKey}
                    onSelectionChange={onSelectionChange}
                />

                <TabButton
                    label="Active"
                    count={activeCount}
                    tabKey="active"
                    selectedKey={selectedKey}
                    onSelectionChange={onSelectionChange}
                />

                <TabButton
                    label="History"
                    count={historyCount}
                    tabKey="history"
                    selectedKey={selectedKey}
                    onSelectionChange={onSelectionChange}
                />
            </div>
        </div>
    );
};

export default CoachContractsTabs;