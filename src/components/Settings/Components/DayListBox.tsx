import { Select, Label, ListBox } from "@heroui/react";
import type { AvailabilitySlot } from "../../../services/Setting/User";

type Prop = {
  slot: AvailabilitySlot;
  edit: boolean;
  updateDay: (value: string) => void;
};

const DayListBox = ({ updateDay, slot, edit }: Prop) => {
  return (
    <Select
      placeholder="Select one"
      onChange={(key) => updateDay(String(key))}
      isDisabled={!edit}
      isRequired
      value={slot.day_of_week}
    >
      <Label className="text-black">Day</Label>

      <Select.Trigger
        data-testid="day-select-trigger"
        className="
                    min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm
                    shadow-none outline-none transition
                    hover:border-gray-400
                    data-[focus-visible=true]:border-black
                    data-[disabled=true]:opacity-100
                    data-[disabled=true]:bg-white
                    data-[disabled=true]:text-gray-900
                    data-[disabled=true]:border-gray-300
                    data-[disabled=true]:cursor-default
                    "
      >
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item data-testid="Monday" id="Mon" textValue="monday">
            Mon
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item data-testid="Tuesday" id="Tue" textValue="tuesday">
            Tue
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item data-testid="Wednesday" id="Wed" textValue="wednesday">
            Wed
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item data-testid="Thursday" id="Thu" textValue="thursday">
            Thu
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item data-testid="Friday" id="Fri" textValue="friday">
            Fri
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item data-testid="Saturday" id="Sat" textValue="saturday">
            Sat
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item data-testid="Sunday" id="Sun" textValue="sunday">
            Sun
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default DayListBox;