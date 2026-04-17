import StatCard, { type StatCardData } from "./StatCard";

interface AdminStatsSectionProps {
    stats: StatCardData[];
}

const StatsSection = ({ stats }: AdminStatsSectionProps) => {
    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="flex flex-wrap items-start gap-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
export type { StatCardData };