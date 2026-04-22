import { Button, Card } from "@heroui/react";
import {
    BadgeDollarSign,
    ClipboardList,
    ShieldCheck,
} from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CoachApplicationsTab from "../../components/Admin/CoachGovernance/CoachApplicationsTab";
import CoachPricesTab from "../../components/Admin/CoachGovernance/CoachPricesTab";

type GovernanceTab = {
    key: "applications" | "coach-prices";
    label: string;
    path: string;
    icon: typeof ClipboardList;
    description: string;
};

const governanceTabs: GovernanceTab[] = [
    {
        key: "applications",
        label: "Applications",
        path: "/admin/coach-governance/applications",
        icon: ClipboardList,
        description:
            "Review coach applications by status, search applicants, and approve or reject with an admin note.",
    },
    {
        key: "coach-prices",
        label: "Coach Prices",
        path: "/admin/coach-governance/coach-prices",
        icon: BadgeDollarSign,
        description:
            "Review pending coach price requests and approve or reject each proposal with a recorded admin action.",
    },
];

const CoachGovernance = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentTab =
        governanceTabs.find((tab) => location.pathname.startsWith(tab.path)) ??
        governanceTabs[0];

    return (
        <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
            <div className="space-y-6">
                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-default-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-default-700">
                                <ShieldCheck className="h-4 w-4" />
                                Coach Governance
                            </div>

                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                                    Coach review and pricing oversight
                                </h1>
                                <p className="mt-2 max-w-3xl text-sm text-default-600">
                                    This wrapper page owns the two coach governance workflows in the
                                    current admin architecture: application moderation and coach
                                    price moderation. The temporary buttons below let you move
                                    between wrapper pages until the shared admin navbar is built.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                                Governance tabs
                            </p>
                            <p className="mt-1 text-sm text-default-600">
                                {currentTab.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {governanceTabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = currentTab.key === tab.key;

                                return (
                                    <Button
                                        key={tab.key}
                                        onPress={() => navigate(tab.path)}
                                        className={active ? "border border-default-300" : undefined}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {tab.label}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                <Routes>
                    <Route index element={<Navigate to="applications" replace />} />
                    <Route path="applications" element={<CoachApplicationsTab />} />
                    <Route path="coach-prices" element={<CoachPricesTab />} />
                    <Route path="*" element={<Navigate to="applications" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default CoachGovernance;
