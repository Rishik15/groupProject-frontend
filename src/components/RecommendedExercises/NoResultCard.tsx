import { Card, Button } from "@heroui/react";

const NoResultCard = () => {
    return (
        <Card className="bg-white mt-4 rounded-2xl border border-dashed border-[#D9D6FF] bg-transparent shadow-none">
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EFEEFF] text-indigo-500">
                    <p className="text-2xl font-bold leading-none">?</p>
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#171A23]">
                    No matching plan found
                </h2>

                <div className="mt-3 max-w-[520px]">
                    <p className="text-sm leading-relaxed text-[#7A8398]">
                        We couldn’t find a workout plan for this combination. Try adjusting your filters to see more options.
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button
                        className="h-10 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white"
                    >
                        Adjust filters
                    </Button>

                    <Button className="h-10 rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-black">
                        Preview exercises
                    </Button>
                </div>

                <p className="mt-5 text-xs text-[#8A92A6]">
                    No results found for current filters.
                </p>

            </div>
        </Card>
    );

}

export default NoResultCard;