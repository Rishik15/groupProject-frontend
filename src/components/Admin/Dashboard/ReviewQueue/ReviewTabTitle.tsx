interface ReviewTabTitleProps {
    label: string;
    count: number;
    countVariant?: "neutral" | "danger";
}

const badgeClasses = {
    neutral: "bg-[#F1F1F6] text-[#0F0F14]",
    danger: "bg-[#EF5350] text-white",
};

const ReviewTabTitle = ({
    label,
    count,
    countVariant = "neutral",
}: ReviewTabTitleProps) => {
    return (
        <div className="flex items-center gap-[11.25px] px-[18px] py-[9px]">
            <span className="text-[15px] font-medium leading-[20.25px] text-[#0F0F14]">
                {label}
            </span>

            <span
                className={`inline-flex h-[28px] min-w-[28px] items-center justify-center rounded-[11.25px] px-[9px] text-[13.125px] font-semibold leading-none ${badgeClasses[countVariant]}`}
            >
                {count}
            </span>
        </div>
    );
};

export default ReviewTabTitle;