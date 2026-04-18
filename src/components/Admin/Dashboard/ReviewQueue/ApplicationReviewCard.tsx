import { Card } from "@heroui/react";
import { CheckCircle2, CircleX } from "lucide-react";
import type { ApplicationReviewItem } from "../../../../utils/Interfaces/Admin/reviewQueue";

interface ApplicationReviewCardProps {
    application: ApplicationReviewItem;
    onApprove?: (application: ApplicationReviewItem) => void;
    onReject?: (application: ApplicationReviewItem) => void;
}

const ApplicationReviewCard = ({
    application,
    onApprove,
    onReject,
}: ApplicationReviewCardProps) => {
    return (
        <Card className="rounded-[20px] border border-[#DCDCF4] bg-white shadow-none">
            <div className="p-[22.5px]">
                <div className="flex flex-col gap-[18px] lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-[18px]">
                        <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#F1F1FB] text-[18.75px] font-medium leading-none text-[#5B5FF6]">
                            {application.avatarInitial ?? application.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-[18.75px] font-semibold leading-[24px] text-[#0F0F14]">
                                {application.name}
                            </p>

                            <p className="truncate text-[13.125px] leading-[18px] text-[#72728A]">
                                {application.email}
                            </p>

                            <p className="text-[13.125px] leading-[18px] text-[#72728A]">
                                {application.appliedLabel}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-[9px] lg:justify-end">
                        {application.certifications.map((certification) => (
                            <span
                                key={certification}
                                className="inline-flex items-center justify-center rounded-[11.25px] bg-[#F5F5FA] px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none text-[#0F0F14]"
                            >
                                {certification}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-[18px] grid grid-cols-1 gap-[12px] md:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => onApprove?.(application)}
                        className="inline-flex h-[46px] items-center justify-center gap-[9px] rounded-[13.5px] bg-[#5B5FF6] px-[18px] text-[15px] font-semibold leading-[20.25px] text-white transition-opacity hover:opacity-95"
                    >
                        <CheckCircle2 className="h-[18px] w-[18px]" />
                        Approve
                    </button>

                    <button
                        type="button"
                        onClick={() => onReject?.(application)}
                        className="inline-flex h-[46px] items-center justify-center gap-[9px] rounded-[13.5px] border border-[#F3A1A1] bg-white px-[18px] text-[15px] font-semibold leading-[20.25px] text-[#F45B5B] transition-colors hover:bg-[#FFF8F8]"
                    >
                        <CircleX className="h-[18px] w-[18px]" />
                        Reject
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default ApplicationReviewCard;