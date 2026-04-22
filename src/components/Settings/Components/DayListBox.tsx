import { Select, Label, ListBox } from "@heroui/react"
import type { AvailabilitySlot } from "../../../services/Setting/User";

type Prop = {
    slot: AvailabilitySlot;
    edit: boolean;
}


const DayListBox = ({ slot, edit }: Prop) => {
    return (
        <Select placeholder="Select one" value={slot.day_of_week} isDisabled={!edit} isRequired>
            <Label className="text-black">Day</Label>

            <Select.Trigger className="
                    min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm
                    shadow-none outline-none transition

                    hover:border-gray-400
                    data-[focus-visible=true]:border-black

                    /* override disabled styles */
                    data-[disabled=true]:opacity-100
                    data-[disabled=true]:bg-white
                    data-[disabled=true]:text-gray-900
                    data-[disabled=true]:border-gray-300
                    data-[disabled=true]:cursor-default
                    ">
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    <ListBox.Item id="Mon" textValue="monday">
                        Mon
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Tue" textValue="tuesday">
                        Tue
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Wed" textValue="wednesday">
                        Wed
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Thu" textValue="thursday">
                        Thu
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Fri" textValue="friday">
                        Fri
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Sat" textValue="saturday">
                        Sat
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Sun" textValue="sunday">
                        Sun
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

export default DayListBox;
