import { Button, Card } from "@heroui/react";
import {
    AlertTriangle,
    ClipboardList,
    FileWarning,
} from "lucide-react";
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ClosedReportsTab, OpenReportsTab } from "../../components/Admin/Reports";

const Reports = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const openActive = location.pathname.endsWith("/open") || location.pathname === "/admin/reports";
    const closedActive = location.pathname.endsWith("/closed");

    return (
        <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
            <div className="space-y-6">
                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-default-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-default-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    Reports
                                </div>

                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                                        Conduct moderation
                                    </h1>
                                    <p className="mt-2 max-w-3xl text-sm text-default-600">
                                        Review open platform reports, record moderation outcomes, and
                                        reference the closed report history. This page follows the
                                        expected admin contract using body-based report listing and close flows.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <NavLink
                                to="/admin/reports/open"
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${openActive
                                    ? "border-default-900 bg-[#5B5EF4] text-white"
                                    : "border-default-200 bg-white text-default-700 hover:border-default-300"
                                    }`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FileWarning className="h-4 w-4" />
                                    Open Reports
                                </span>
                            </NavLink>

                            <NavLink
                                to="/admin/reports/closed"
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${closedActive
                                    ? "border-default-900 bg-[#5B5EF4] text-white"
                                    : "border-default-200 bg-white text-default-700 hover:border-default-300"
                                    }`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <ClipboardList className="h-4 w-4" />
                                    Closed Reports
                                </span>
                            </NavLink>
                        </div>
                    </div>
                </Card>

                <Routes>
                    <Route index element={<Navigate to="/admin/reports/open" replace />} />
                    <Route path="open" element={<OpenReportsTab />} />
                    <Route path="closed" element={<ClosedReportsTab />} />
                </Routes>
            </div>
        </div>
    );
};

export default Reports;
