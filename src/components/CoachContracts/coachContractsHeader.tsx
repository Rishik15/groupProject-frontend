import { CircleAlert } from "lucide-react";

interface CoachContractsHeaderProps {
    pendingCount: number;
}

const CoachContractsHeader = ({
    pendingCount,
}: CoachContractsHeaderProps) => {
    return (
        <div className="bg-white">
            <div className="h-[84px] border-b border-neutral-200 bg-white">
                <div className="flex h-full items-center justify-between px-8">
                    <div>
                        <h1 className="text-[18.75px] font-semibold leading-none text-[#0F0F14]">
                            Coaching Contracts
                        </h1>
                        <p className="mt-2 text-[13.125px] leading-none text-[#72728A]">
                            Manage your coaching relationships and contract requests
                        </p>
                    </div>
                </div>
            </div>

            {pendingCount > 0 && (
                <div className="px-38 py-6">
                    <div className="rounded-3xl border border-[#DCDCF4] bg-[#F7F7FF] px-6 py-5">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <CircleAlert size={26} color="#5E5EF4" />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[18.75px] font-semibold leading-none text-[#0F0F14]">
                                    Action Required
                                </p>

                                <p className="text-[13.125px] leading-normal text-[#72728A]">
                                    You have {pendingCount} pending contract request
                                    {pendingCount === 1 ? "" : "s"} awaiting your response
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachContractsHeader;