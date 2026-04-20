import {
  Select,
  Label,
  Description,
  ListBox,
} from "@heroui/react";

export type FilterItem = {
  key: string;
  label: string;
  description?: string;
};

type Props = {
  name: string;
  items: FilterItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const FilterList = ({
  name,
  items,
  value,
  onChange,
  placeholder = "Select an option",
}: Props) => {
  return (
    <Select
      selectedKey={value || null}
      onSelectionChange={(key) => {
        if (key != null) {
          onChange(String(key));
        }
      }}
      placeholder={placeholder}
    >
      <Label className="mb-2 block font-bold">{name}</Label>

      <Select.Trigger className="flex h-12 items-center rounded-xl border border-gray-300 px-3">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <ListBox className="min-w-[220px]">
          {items.map((item) => (
            <ListBox.Item
              key={item.key}
              id={item.key}
              textValue={item.label}
            >
              <Label>{item.label}</Label>
              {item.description && (
                <Description>{item.description}</Description>
              )}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default FilterList;