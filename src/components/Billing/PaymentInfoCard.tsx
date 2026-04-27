import {
  Button,
  Dropdown,
  Label
} from "@heroui/react";
import { Ellipsis } from "lucide-react";
import type { PaymentMethod } from "./type";

type Props = {
  method: PaymentMethod;
  isDefault?: boolean;
  setDefault?: (id: number) => void;
  onRemove?: (id: number) => void;

};

const PaymentInfoCard = ({
  method,
  isDefault = false,
  setDefault,
  onRemove,
}: Props) => {
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
          Expires{" "}
          {String(method.expiry_month).padStart(2, "0")}/
          {String(method.expiry_year).slice(-2)}
        </p>
      </div>

      <Dropdown>
        <Button aria-label="Menu" variant="secondary" className="bg-white ml-auto">
          <Ellipsis className="text-gray-500" />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => {
            if (key == "delete") {
              onRemove?.(method.payment_method_id)
            }

            if (key == "set-default") {
              setDefault?.(method.payment_method_id)
            }
          }}>
            <Dropdown.Item id="set-default" textValue="default">
              <Label>Set as Default</Label>
            </Dropdown.Item>
            <Dropdown.Item id="delete" textValue="Delete" variant="danger">
              <Label>Delete Payment Method</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
};

export default PaymentInfoCard;