import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@heroui/react";
import { ArrowLeft, BadgeDollarSign, UserCheck } from "lucide-react";
import {
    getActiveCoaches,
    type ActiveCoach,
} from "../../services/Admin/adminDashboardService";

const CoachesPage = () => {
    const navigate = useNavigate();
    const [coaches, setCoaches] = useState<ActiveCoach[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCoaches = async () => {
            try {
                setError(null);
                const data = await getActiveCoaches();
                setCoaches(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load active coaches.");
            } finally {
                setLoading(false);
            }
        };

        void loadCoaches();
    }, []);

    return (
        <div className="min-h-screen bg-default-50">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-[18px] px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/8 p-2">
                            <UserCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>

                        <div>
                            <h1 className="font-semibold leading-none text-[18.75px] text-[#0F0F14]">
                                Active Coaches
                            </h1>
                            <p className="mt-0.5 leading-normal text-[13.125px] text-[#72728A]">
                                View active coach accounts and certifications
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
                    <div className="text-sm text-[#72728A]">Loading active coaches...</div>
                ) : (
                    <div className="space-y-4">
                        {coaches.map((coach) => (
                            <Card
                                key={coach.user_id}
                                className="rounded-[20px] border border-[#DCDCF4] bg-white shadow-none"
                            >
                                <div className="flex flex-col gap-4 p-[22.5px]">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-primary/8 text-[16px] font-semibold text-primary">
                                                    {coach.first_name?.charAt(0)}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-[16.875px] font-semibold leading-[22px] text-[#0F0F14]">
                                                        {coach.name}
                                                    </p>
                                                    <p className="truncate text-[13.125px] leading-[18px] text-[#72728A]">
                                                        {coach.email}
                                                    </p>
                                                    {coach.coach_description ? (
                                                        <p className="mt-1 text-[13.125px] leading-[18px] text-[#72728A]">
                                                            {coach.coach_description}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center justify-center gap-1 rounded-[11.25px] bg-[#F5F5FA] px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none text-[#0F0F14]">
                                                <BadgeDollarSign className="h-3.5 w-3.5" />
                                                {coach.price != null ? `$${coach.price}` : "No price"}
                                            </span>

                                            <span className="inline-flex items-center justify-center rounded-[11.25px] bg-primary/8 px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none text-primary">
                                                {coach.contract_count} active contracts
                                            </span>
                                        </div>
                                    </div>

                                    {coach.certifications.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {coach.certifications.map((cert, index) => (
                                                <span
                                                    key={`${coach.user_id}-${cert.cert_name}-${index}`}
                                                    className="inline-flex items-center justify-center rounded-[11.25px] bg-[#F5F5FA] px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none text-[#0F0F14]"
                                                >
                                                    {cert.cert_name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachesPage;