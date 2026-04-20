export default function ScheduleLegend() {
    return (
        <div className="mt-5 flex flex-wrap gap-4 text-[11.25px] text-[#72728A]">
            <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#8E51FF]" />
                Strength
            </span>
            <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#00A6F4]" />
                Cardio
            </span>
            <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#00BC7D]" />
                Yoga
            </span>
            <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#90A1B9]" />
                Rest
            </span>
            <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FE9A00]" />
                Nutrition
            </span>
            <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#F6339A]" />
                Other
            </span>
        </div>
    );
}
