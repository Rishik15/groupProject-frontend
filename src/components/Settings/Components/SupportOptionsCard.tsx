import { Button } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type Prop = {
  option_name: string;
  option_description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  onPress?: () => void;
};

const SupportOptionsCard = ({
  option_name,
  option_description,
  icon: Icon,
  iconColor = "text-red-600",
  iconBg = "bg-red-100",
  onPress,
}: Prop) => {
  return (
    <Button
      onPress={onPress}
      data-testid={option_name}
      className="
        mt-3
        w-full
        h-auto
        min-h-[104px]
        px-5
        py-4
        bg-white
        border
        border-gray-200
        rounded-[24px]
        hover:bg-gray-50
        justify-start
        overflow-hidden
      "
    >
      <div className="flex w-full items-center gap-4">
        <div
          className={`
            w-14
            h-14
            shrink-0
            rounded-[18px]
            flex
            items-center
            justify-center
            ${iconBg}
          `}
        >
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="text-[17px] font-semibold leading-[1.2] text-black truncate">
            {option_name}
          </p>
          <p className="mt-1 text-sm leading-[1.35] text-gray-500 whitespace-normal break-words">
            {option_description}
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Button>
  );
};

export default SupportOptionsCard;