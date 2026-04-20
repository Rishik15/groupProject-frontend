interface MealLogHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function MealLogHeader({
    title = "Log Meal",
    subtitle = "Choose the meal type, add food items, and review the final nutrition summary.",
}: MealLogHeaderProps) {
    return (
        <div className="space-y-1">
            <h2 className="text-[18.75px] font-semibold text-[#0F0F14]">{title}</h2>
            <p className="text-[13.125px] text-[#72728A]">{subtitle}</p>
        </div>
    );
}