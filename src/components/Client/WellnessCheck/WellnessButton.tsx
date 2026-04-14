import { Button } from "@heroui/react";

const WellnessButton = () => {

    return (
        <Button type="button" className="h-8 px-3 rounded-xl bg-gray-100 text-black hover:bg-[#5B5EF4] hover:text-white">
            <div className="flex items-center gap-2">
                <div className="text-[12px]">Mental Wellness</div>
            </div>
        </Button>
    );
}

export default WellnessButton;