import {
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TimeField,
  type Key,
  type TimeValue,
} from "@heroui/react";
import { parseTime } from "@internationalized/date";

import ScheduleDateField from "@/components/WorkoutSchedule/ScheduleDateField";
import type { CoachSessionClient } from "../../utils/Interfaces/CoachSession/coachSession";

interface CoachSessionFormProps {
  clients: CoachSessionClient[];
  contractId: string;
  description: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  isEditing: boolean;

  onContractChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

function getSingleSelectValue(value: Key | Key[] | null) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value) && value.length > 0) {
    return String(value[0]);
  }

  return null;
}

function parseTimeValue(value: string, fallback: string) {
  try {
    const safeValue = value && value.length >= 5 ? value.slice(0, 5) : fallback;
    return parseTime(safeValue);
  } catch {
    return parseTime(fallback);
  }
}

function formatTimeValue(value: TimeValue | null, fallback: string) {
  if (!value) return fallback;

  return `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;
}

export default function CoachSessionForm({
  clients,
  contractId,
  description,
  notes,
  date,
  startTime,
  endTime,
  isEditing,
  onContractChange,
  onDescriptionChange,
  onNotesChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: CoachSessionFormProps) {
  const selectedClient = clients.find(
    (client) => String(client.contractId) === contractId,
  );

  return (
    <Form className="space-y-3 bg-white" validationBehavior="aria">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Select
          className="w-full"
          variant="secondary"
          value={contractId}
          placeholder="Select client"
          isDisabled={clients.length === 0}
          onChange={(nextValue) => {
            const parsedValue = getSingleSelectValue(nextValue);

            if (parsedValue) {
              onContractChange(parsedValue);
            }
          }}
        >
          <Label className="font-primary text-[12px] font-semibold text-[#0F0F14]">
            Client
          </Label>

          <Select.Trigger className="min-h-[40px] w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-none">
            <div className="min-w-0 flex-1 overflow-hidden pr-3">
              <Select.Value className="block max-w-full truncate font-primary text-[13px] text-[#0F0F14]">
                {selectedClient ? selectedClient.name : "Select client"}
              </Select.Value>
            </div>

            <Select.Indicator className="shrink-0 text-[#72728A]" />
          </Select.Trigger>

          <Select.Popover className="w-[var(--trigger-width)] rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-lg">
            <ListBox className="max-h-[220px] overflow-y-auto outline-none">
              {clients.map((client) => (
                <ListBox.Item
                  key={String(client.contractId)}
                  id={String(client.contractId)}
                  textValue={client.name}
                  className="rounded-lg px-3 py-2 data-[focused=true]:bg-indigo-50"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="truncate font-primary text-[13px] text-[#0F0F14]">
                      {client.name}
                    </p>

                    {client.email ? (
                      <p className="mt-0.5 truncate font-primary text-[11px] text-[#72728A]">
                        {client.email}
                      </p>
                    ) : null}
                  </div>

                  <ListBox.ItemIndicator className="shrink-0" />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <div className="space-y-1.5">
          <label className="block font-primary text-[12px] font-semibold text-[#0F0F14]">
            Title
          </label>

          <Input
            placeholder="Weekly Check-in"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            className="h-10 w-full font-primary text-[13px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ScheduleDateField value={date} onChange={onDateChange} />

        <div className="grid grid-cols-2 gap-2">
          <TimeField
            className="w-full font-primary"
            value={parseTimeValue(startTime, "09:00")}
            onChange={(value) =>
              onStartTimeChange(formatTimeValue(value, "09:00"))
            }
            granularity="minute"
            hourCycle={12}
          >
            <Label className="font-primary text-[12px] font-semibold text-[#0F0F14]">
              Start
            </Label>

            <TimeField.Group
              fullWidth
              variant="secondary"
              className="h-10 rounded-xl border border-[#E5E7EB] bg-white"
            >
              <TimeField.Input className="px-3 font-primary text-[13px] text-[#0F0F14]">
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>

          <TimeField
            className="w-full font-primary"
            value={parseTimeValue(endTime, "10:00")}
            onChange={(value) =>
              onEndTimeChange(formatTimeValue(value, "10:00"))
            }
            granularity="minute"
            hourCycle={12}
          >
            <Label className="font-primary text-[12px] font-semibold text-[#0F0F14]">
              End
            </Label>

            <TimeField.Group
              fullWidth
              variant="secondary"
              className="h-10 rounded-xl border border-[#E5E7EB] bg-white"
            >
              <TimeField.Input className="px-3 font-primary text-[13px] text-[#0F0F14]">
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block font-primary text-[12px] font-semibold text-[#0F0F14]">
          Notes
        </label>

        <TextArea
          placeholder="Optional notes"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          className="h-20 w-full font-primary text-[13px]"
        />
      </div>

      {isEditing ? (
        <p className="text-[11px] leading-5 text-[#72728A]">
          Changing the client moves this session to that client's calendar.
        </p>
      ) : null}
    </Form>
  );
}