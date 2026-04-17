import { useState } from "react";
import { Card, Tabs } from "@heroui/react";
import ApplicationsPane from "./ReviewQueue/ApplicationsPane";
import ReportsPane from "./ReviewQueue/ReportsPane";
import ReviewTabTitle from "./ReviewQueue/ReviewTabTitle";
import type {
    ApplicationReviewItem,
    ReportReviewItem,
} from "../../../utils/Interfaces/Admin/reviewQueue";

interface ReviewQueueSectionProps {
    applications?: ApplicationReviewItem[];
    reports?: ReportReviewItem[];
    onApprove?: (application: ApplicationReviewItem) => void;
    onReject?: (application: ApplicationReviewItem) => void;
    onOpenReport?: (report: ReportReviewItem) => void;
    onViewClosedReports?: () => void;
}

const fallbackApplications: ApplicationReviewItem[] = [
    {
        id: "1",
        name: "John Smith",
        email: "john.smith@email.com",
        appliedLabel: "Applied: Mar 1, 2026 · 5yr experience",
        certifications: ["ACE", "NASM"],
        avatarInitial: "J",
    },
    {
        id: "2",
        name: "Lisa Anderson",
        email: "lisa.anderson@email.com",
        appliedLabel: "Applied: Mar 2, 2026 · 8yr experience",
        certifications: ["ISSA", "PN"],
        avatarInitial: "L",
    },
    {
        id: "3",
        name: "David Kim",
        email: "david.kim@email.com",
        appliedLabel: "Applied: Mar 3, 2026 · 3yr experience",
        certifications: ["ACE"],
        avatarInitial: "D",
    },
];

const fallbackReports: ReportReviewItem[] = [
    {
        id: "r1",
        title: "Payment dispute",
        description: "A user flagged a billing issue related to a coaching subscription.",
        submittedLabel: "Submitted: Mar 4, 2026",
        statusLabel: "Open",
    },
    {
        id: "r2",
        title: "Coach conduct report",
        description: "A conversation was reported for inappropriate communication.",
        submittedLabel: "Submitted: Mar 5, 2026",
        statusLabel: "Open",
    },
];

type ReviewTabId = "applications" | "reports";

const ReviewQueueSection = ({
    applications = fallbackApplications,
    reports = fallbackReports,
    onApprove,
    onReject,
    onOpenReport,
    onViewClosedReports,
}: ReviewQueueSectionProps) => {
    const [selectedTab, setSelectedTab] = useState<ReviewTabId>("applications");

    return (
        <Card className="overflow-hidden rounded-[24px] border border-[#DCDCF4] bg-white shadow-none">
            <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as ReviewTabId)}
                variant="primary"
                className="w-full"
            >
                <Tabs.ListContainer className="px-[22.5px] pt-[22.5px]">
                    <Tabs.List
                        aria-label="Admin review queue"
                        className="w-fit gap-[3px] rounded-[16.875px] bg-[#F5F5FA] p-[4px]"
                    >
                        <Tabs.Tab
                            id="applications"
                            className="rounded-[13.5px] p-0 data-[selected=true]:bg-white data-[selected=true]:shadow-[0_1px_2px_rgba(15,15,20,0.08)]"
                        >
                            <ReviewTabTitle
                                label="Applications"
                                count={applications.length}
                                countVariant="neutral"
                            />
                            <Tabs.Indicator className="hidden" />
                        </Tabs.Tab>

                        <Tabs.Tab
                            id="reports"
                            className="rounded-[13.5px] p-0 data-[selected=true]:bg-white data-[selected=true]:shadow-[0_1px_2px_rgba(15,15,20,0.08)]"
                        >
                            <ReviewTabTitle
                                label="Reports"
                                count={reports.length}
                                countVariant="danger"
                            />
                            <Tabs.Indicator className="hidden" />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel
                    id="applications"
                    className="border-t border-[#E6E6F0] px-[22.5px] py-[22.5px]"
                >
                    <ApplicationsPane
                        applications={applications}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                </Tabs.Panel>

                <Tabs.Panel
                    id="reports"
                    className="border-t border-[#E6E6F0] px-[22.5px] py-[22.5px]"
                >
                    <ReportsPane
                        reports={reports}
                        onOpenReport={onOpenReport}
                        onViewClosedReports={onViewClosedReports}
                    />
                </Tabs.Panel>
            </Tabs>
        </Card>
    );
};

export default ReviewQueueSection;