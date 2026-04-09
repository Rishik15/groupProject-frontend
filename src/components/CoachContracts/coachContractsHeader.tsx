import { CircleAlert } from "lucide-react";

interface CoachContractsHeaderProps {
    pendingCount: number;
}

const CoachContractsHeader = ({
    pendingCount,
}: CoachContractsHeaderProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1
                    className="font-semibold leading-none"
                    style={{ fontSize: "18.75px", color: "#0F0F14" }}
                >
                    Coaching Contracts
                </h1>

                <p
                    className="leading-normal"
                    style={{ fontSize: "13.125px", color: "#72728A" }}
                >
                    Manage your coaching relationships and contract requests
                </p>
            </div>

            {pendingCount > 0 && (
                <div className="rounded-3xl border border-[#DCDCF4] bg-[#F7F7FF] px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className="mt-1">
                            <CircleAlert size={26} color="#5E5EF4" />
                        </div>

                        <div className="space-y-2">
                            <p
                                className="font-semibold leading-none"
                                style={{ fontSize: "18.75px", color: "#0F0F14" }}
                            >
                                Action Required
                            </p>

                            <p
                                className="leading-normal"
                                style={{ fontSize: "13.125px", color: "#72728A" }}
                            >
                                You have {pendingCount} pending contract request
                                {pendingCount === 1 ? "" : "s"} awaiting your response
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachContractsHeader;