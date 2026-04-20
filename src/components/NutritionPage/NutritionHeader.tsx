import LogMealButton from "./LogMealButton";

interface NutritionHeaderProps {
    onLogMeal: () => void;
}

const NutritionHeader = ({ onLogMeal }: NutritionHeaderProps) => {
    return (
        <div className="py-6 px-36 border-b border-neutral-200 bg-white">
            <div className="flex h-full items-center justify-between">
                <div>
                    <h1 className="text-[18.75px] font-semibold leading-none text-[#0F0F14]">
                        Nutrition
                    </h1>
                    <p className="mt-2 text-[13.125px] leading-none text-[#72728A]">
                        Track meals and macros
                    </p>
                </div>

                <LogMealButton onPress={onLogMeal} />
            </div>
        </div>
    );
};

export default NutritionHeader;