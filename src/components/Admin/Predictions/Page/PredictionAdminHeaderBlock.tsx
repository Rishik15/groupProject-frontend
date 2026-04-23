import { Button, Card, Chip, Spinner } from "@heroui/react";
import {
    Gavel,
    RefreshCcw,
} from "lucide-react";

type SummaryCard = {
    id: string;
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
};

type PredictionAdminHeaderBlockProps = {
    summaryCards: SummaryCard[];
    isLoading?: boolean;
    isRefreshing?: boolean;
    onRefresh: () => void;
};

export default function PredictionAdminHeaderBlock({
    summaryCards,
    isLoading = false,
    isRefreshing = false,
    onRefresh,
}: PredictionAdminHeaderBlockProps) {
    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                    <Chip
                        variant="soft"
                        className="border border-[#5B5EF4]/20 bg-[#EEF0FF] text-[#5B5EF4]"
                    >
                        Admin Moderation
                    </Chip>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                            Prediction Control Center
                        </h1>
                        <p className="max-w-3xl text-base text-slate-600">
                            Review submitted markets, settle finalized outcomes,
                            and manage pending cancellation requests from one
                            moderation workspace.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="outline"
                        onPress={onRefresh}
                        isDisabled={isLoading || isRefreshing}
                    >
                        <span className="inline-flex items-center gap-2">
                            {isRefreshing ? (
                                <Spinner size="sm" />
                            ) : (
                                <RefreshCcw className="h-4 w-4" />
                            )}
                            {isRefreshing ? "Refreshing..." : "Refresh queues"}
                        </span>
                    </Button>

                    <Button
                        className="font-medium text-white"
                        style={{ backgroundColor: "#5B5EF4" }}
                        isDisabled
                    >
                        <span className="inline-flex items-center gap-2">
                            <Gavel className="h-4 w-4" />
                            Moderation workspace
                        </span>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 px-8 pb-8 md:grid-cols-3">
                {summaryCards.map(({ id, title, value, icon: Icon, description }) => (
                    <Card
                        key={id}
                        className="h-full rounded-2xl border border-slate-200 bg-white shadow-none"
                    >
                        <div className="flex items-start justify-between gap-3 p-5">
                            <div className="space-y-1">
                                <p className="text-[13.125px] text-slate-500">{title}</p>
                                <p className="text-2xl font-semibold text-slate-900">
                                    {value}
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#EEF0FF] p-2 text-[#5B5EF4]">
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="px-5 pb-5 pt-0 text-[13.125px] text-slate-500">
                            {description}
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
}