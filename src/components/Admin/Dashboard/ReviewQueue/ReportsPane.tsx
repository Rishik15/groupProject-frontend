import ReportReviewCard from "./ReportReviewCard";
import type { ReportReviewItem } from "../../../../utils/Interfaces/Admin/reviewQueue";

interface ReportsPaneProps {
    reports: ReportReviewItem[];
    onOpenReport?: (report: ReportReviewItem) => void;
    onViewClosedReports?: () => void;
}

const ReportsPane = ({
    reports,
    onOpenReport,
    onViewClosedReports,
}: ReportsPaneProps) => {
    return (
        <div className="space-y-[18px]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-[18.75px] leading-[24px] text-[#72728A]">
                    Review flagged platform reports
                </p>

                <button
                    type="button"
                    onClick={onViewClosedReports}
                    className="inline-flex h-[42px] items-center justify-center rounded-[13.5px] border border-[#DCDCF4] bg-white px-[18px] text-[13.125px] font-medium leading-[18px] text-[#0F0F14] transition-colors hover:bg-[#F8F8FC]"
                >
                    View closed reports
                </button>
            </div>

            {reports.map((report) => (
                <ReportReviewCard
                    key={report.id}
                    report={report}
                    onOpenReport={onOpenReport}
                />
            ))}
        </div>
    );
};

export default ReportsPane;