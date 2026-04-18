import { Card } from "@heroui/react";
import { FileWarning } from "lucide-react";
import type { ReportReviewItem } from "../../../../utils/Interfaces/Admin/reviewQueue";

interface ReportReviewCardProps {
    report: ReportReviewItem;
    onOpenReport?: (report: ReportReviewItem) => void;
}

const ReportReviewCard = ({
    report,
    onOpenReport,
}: ReportReviewCardProps) => {
    return (
        <Card className="rounded-[20px] border border-[#DCDCF4] bg-white shadow-none">
            <div className="flex flex-col gap-[18px] p-[22.5px] md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-start gap-[18px]">
                    <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#FFF2F2] text-[#EF5350]">
                        <FileWarning className="h-[20px] w-[20px]" />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-[18.75px] font-semibold leading-[24px] text-[#0F0F14]">
                            {report.title}
                        </p>

                        <p className="mt-[3px] text-[13.125px] leading-[18px] text-[#72728A]">
                            {report.description}
                        </p>

                        <p className="mt-[3px] text-[13.125px] leading-[18px] text-[#72728A]">
                            {report.submittedLabel}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-[12px]">
                    {report.statusLabel ? (
                        <span className="inline-flex items-center justify-center rounded-[11.25px] bg-[#FFF2F2] px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none text-[#EF5350]">
                            {report.statusLabel}
                        </span>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => onOpenReport?.(report)}
                        className="inline-flex h-[42px] items-center justify-center rounded-[13.5px] border border-[#DCDCF4] bg-white px-[18px] text-[13.125px] font-medium leading-[18px] text-[#0F0F14] transition-colors hover:bg-[#F8F8FC]"
                    >
                        Open report
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default ReportReviewCard;