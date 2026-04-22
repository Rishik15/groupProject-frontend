import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@heroui/react";
import { ArrowLeft, Shield, Users } from "lucide-react";
import {
    getAdminUsers,
    type AdminUser,
} from "../../services/Admin/adminDashboardService";

const UsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setError(null);
                const data = await getAdminUsers();
                setUsers(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        void loadUsers();
    }, []);

    return (
        <div className="min-h-screen bg-default-50">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-[18px] px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/8 p-2">
                            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>

                        <div>
                            <h1 className="font-semibold leading-none text-[18.75px] text-[#0F0F14]">
                                All Users
                            </h1>
                            <p className="mt-0.5 leading-normal text-[13.125px] text-[#72728A]">
                                View every registered account
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[13.5px] border border-[#DCDCF4] bg-white px-[18px] text-[13.125px] font-medium leading-[18px] text-[#0F0F14] transition-colors hover:bg-[#F8F8FC]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                {error ? (
                    <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="text-sm text-[#72728A]">Loading users...</div>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <Card
                                key={user.user_id}
                                className="rounded-[20px] border border-[#DCDCF4] bg-white shadow-none"
                            >
                                <div className="flex flex-col gap-4 p-[22.5px] md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-primary/8 text-[16px] font-semibold text-primary">
                                                {user.first_name?.charAt(0)}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-[16.875px] font-semibold leading-[22px] text-[#0F0F14]">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-[13.125px] leading-[18px] text-[#72728A]">
                                                    {user.email}
                                                </p>
                                                {user.username ? (
                                                    <p className="text-[13.125px] leading-[18px] text-[#72728A]">
                                                        @{user.username}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {user.is_coach ? (
                                            <span className="inline-flex items-center justify-center rounded-[11.25px] bg-primary/8 px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none text-primary">
                                                Coach
                                            </span>
                                        ) : null}

                                        {user.is_admin ? (
                                            <span className="inline-flex items-center justify-center gap-1 rounded-[11.25px] bg-[#F5F5FA] px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none text-[#0F0F14]">
                                                <Shield className="h-3.5 w-3.5" />
                                                Admin
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;