import { Shield } from "lucide-react";

interface AdminDashboardHeaderProps {
    title?: string;
    subtitle?: string;
    onViewAllUsers?: () => void;
    onViewAllActiveCoaches?: () => void;
}

const actionButtonClassName =
    "inline-flex h-[42px] items-center justify-center rounded-[13.5px] border border-[#DCDCF4] bg-white px-[18px] text-[13.125px] font-medium leading-[18px] text-[#0F0F14] transition-colors hover:bg-[#F8F8FC]";

const AdminDashboardHeader = ({
    title = "Admin Dashboard",
    subtitle = "Platform governance & oversight",
    onViewAllUsers,
    onViewAllActiveCoaches,
}: AdminDashboardHeaderProps) => {
    return (
        <header className="border-b border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
                <div className="flex flex-col gap-[18px] lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/8 p-2">
                            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>

                        <div>
                            <h1 className="font-semibold leading-none text-[18.75px] text-[#0F0F14]">
                                {title}
                            </h1>
                            <p className="mt-0.5 leading-normal text-[13.125px] text-[#72728A]">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={onViewAllUsers}
                            className={actionButtonClassName}
                        >
                            View all users
                        </button>

                        <button
                            type="button"
                            onClick={onViewAllActiveCoaches}
                            className={actionButtonClassName}
                        >
                            View all active coaches
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminDashboardHeader;