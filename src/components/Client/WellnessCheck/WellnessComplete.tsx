import { Button } from "@heroui/react";
import { Check } from "lucide-react";
const WellnessComplete = () => {



    return (
        <Button
            isDisabled
            className="!bg-[#DAFAEA] !text-[#065F46] h-8 px-3 rounded-xl flex items-center gap-1 opacity-70"
        >
            <Check />
            <span className="text-[12px]">Wellness Complete</span>
        </Button>
    );
}

export default WellnessComplete;