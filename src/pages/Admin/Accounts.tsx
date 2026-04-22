import { Button, Card } from "@heroui/react";
import {
    Dumbbell,
    FileText,
    ShieldCheck,
    Users,
} from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../utils/Admin/adminRoutes";
import { ActiveCoachesTab, UsersTab } from "../../components/Admin/Accounts";

type AccountsTabConfig = {
    key: "users" | "active-coaches";
    label: string;
    description: string;
    path: string;
};

const accountTabs: AccountsTabConfig[] = [
    {
        key: "users",
        label: "Users",
        description: "All registered users, account status, and enforcement actions.",
        path: ADMIN_ROUTES.users,
    },
    {
        key: "active-coaches",
        label: "Active Coaches",
        description: "Current coaches, prices, certifications, and contract counts.",
        path: ADMIN_ROUTES.activeCoaches,
    },
];

const Accounts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const selectedTab =
        accountTabs.find((tab) => location.pathname.startsWith(tab.path))?.key ?? "users";

    return (
        <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
            <div className="space-y-6">
                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full border border-default-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-default-600">
                                    <Users className="h-4 w-4" />
                                    Accounts
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                                        Account oversight
                                    </h1>
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-default-600">
                                        Review all platform accounts, manage suspension and deactivation
                                        flows, and inspect the active coach roster from one shared page.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="rounded-[20px] border border-default-200 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-default-700">
                                    <Users className="h-4 w-4" />
                                    Users tab
                                </div>
                                <p className="mt-2 text-sm text-default-500">
                                    Fetches the complete user list and owns suspend, deactivate, and
                                    restore actions.
                                </p>
                            </div>
                            <div className="rounded-[20px] border border-default-200 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-default-700">
                                    <ShieldCheck className="h-4 w-4" />
                                    Enforcement
                                </div>
                                <p className="mt-2 text-sm text-default-500">
                                    Mutations send JSON bodies only and should update account state
                                    without inventing separate reactivation routes.
                                </p>
                            </div>
                            <div className="rounded-[20px] border border-default-200 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-default-700">
                                    <Dumbbell className="h-4 w-4" />
                                    Active coaches
                                </div>
                                <p className="mt-2 text-sm text-default-500">
                                    Keeps coach pricing, certifications, and contract totals visible in
                                    one searchable roster.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 p-6">
                        <div className="flex flex-wrap gap-3">
                            {accountTabs.map((tab) => {
                                const isActive = tab.key === selectedTab;
                                return (
                                    <Button
                                        key={tab.key}
                                        onPress={() => navigate(tab.path)}
                                        className={isActive ? "bg-[#5B5EF4] font-semibold" : "bg-[#5B5EF4]"}
                                    >
                                        {tab.label}
                                    </Button>
                                );
                            })}
                        </div>

                        <div className="rounded-[20px] border border-default-200 bg-default-50 px-4 py-3 text-sm text-default-600">
                            {
                                accountTabs.find((tab) => tab.key === selectedTab)?.description ??
                                accountTabs[0].description
                            }
                        </div>
                    </div>
                </Card>

                <Routes>
                    <Route index element={<Navigate to="users" replace />} />
                    <Route path="users" element={<UsersTab />} />
                    <Route path="active-coaches" element={<ActiveCoachesTab />} />
                    <Route path="*" element={<Navigate to="users" replace />} />
                </Routes>

                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 p-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-default-900">Route coverage</p>
                            <p className="mt-1 text-sm text-default-600">
                                This wrapper now owns the Users and Active Coaches flows so the admin
                                area matches the reduced page map.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-default-500">
                            <span className="rounded-full border border-default-200 px-3 py-1">
                                {ADMIN_ROUTES.users}
                            </span>
                            <span className="rounded-full border border-default-200 px-3 py-1">
                                {ADMIN_ROUTES.activeCoaches}
                            </span>
                            <span className="rounded-full border border-default-200 px-3 py-1">
                                GET /admin/users
                            </span>
                            <span className="rounded-full border border-default-200 px-3 py-1">
                                GET /admin/coaches/active
                            </span>
                            <span className="rounded-full border border-default-200 px-3 py-1">
                                <FileText className="mr-2 inline h-3.5 w-3.5" />
                                JSON mutations only
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Accounts;
