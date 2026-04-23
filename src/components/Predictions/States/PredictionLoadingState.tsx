import { Card, Spinner } from "@heroui/react";

export interface PredictionLoadingStateProps {
    message?: string;
    rows?: number;
}

export default function PredictionLoadingState({
    message = "Loading prediction data…",
    rows = 3,
}: PredictionLoadingStateProps) {
    return (
        <div className="space-y-4">
            <Card className="border border-default-200 shadow-sm">
                <div className="flex items-center gap-3 p-6">
                    <Spinner color="accent" size="md" />
                    <p className="text-sm font-medium text-foreground/70">{message}</p>
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {Array.from({ length: rows }).map((_, index) => (
                    <Card key={index} className="border border-default-200 shadow-none">
                        <div className="space-y-4 p-6">
                            <div className="h-5 w-2/5 rounded-full bg-default-200" />
                            <div className="h-4 w-full rounded-full bg-default-100" />
                            <div className="h-4 w-4/5 rounded-full bg-default-100" />
                            <div className="grid grid-cols-2 gap-3">
                                <div className="h-20 rounded-3xl bg-default-100" />
                                <div className="h-20 rounded-3xl bg-default-100" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}