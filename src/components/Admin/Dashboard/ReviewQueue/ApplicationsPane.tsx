import ApplicationReviewCard from "./ApplicationReviewCard";
import type { ApplicationReviewItem } from "../../../../utils/Interfaces/Admin/reviewQueue";

interface ApplicationsPaneProps {
    applications: ApplicationReviewItem[];
    onApprove?: (application: ApplicationReviewItem) => void;
    onReject?: (application: ApplicationReviewItem) => void;
}

const ApplicationsPane = ({
    applications,
    onApprove,
    onReject,
}: ApplicationsPaneProps) => {
    return (
        <div className="space-y-[18px]">
            <p className="text-[18.75px] leading-[24px] text-[#72728A]">
                Review and approve coach applications
            </p>

            {applications.map((application) => (
                <ApplicationReviewCard
                    key={application.id}
                    application={application}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            ))}
        </div>
    );
};

export default ApplicationsPane;