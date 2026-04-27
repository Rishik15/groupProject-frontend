import { Button } from "@heroui/react";
import { Ellipsis } from "lucide-react";
import type { PaymentMethod } from "./type";

type Props = {
  method: PaymentMethod;
  isDefault?: boolean;
};

const PaymentInfoCard = ({ method, isDefault = false }: Props) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0">
      
      <div className="flex items-center justify-center h-10 w-15 rounded-xl border">
        <p className="text-sm">Logo</p>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <p className="font-semibold">
            Card ending in {method.card_last_four}
          </p>

          {isDefault && (
            <span className="text-xs border border-indigo-500 text-indigo-500 px-2 py-[2px] rounded-md">
              Default
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Expires {String(method.expiry_month).padStart(2, "0")}/{String(method.expiry_year).slice(-2)}
        </p>
      </div>

      <Button isIconOnly className="ml-auto bg-transparent text-gray-500">
        <Ellipsis className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default PaymentInfoCard;