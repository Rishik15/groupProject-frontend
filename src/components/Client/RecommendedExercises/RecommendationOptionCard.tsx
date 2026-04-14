import { Card } from "@heroui/react";
import { Label, ListBox, Select, Button } from "@heroui/react";
import { Description, Radio, RadioGroup } from "@heroui/react";
import { useMemo, useState } from "react";
import type { Key } from "@heroui/react";

type ExerciseCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
};

type PredefinedPlansRequest = {
  category: string;
  days_per_week: number;
  duration: string;
  level: string;
};
type Props = {
  onSuccess: (data: any) => void;
};
export function RecommendationOptionCard({
  title,
  description,
  icon,
  iconBg,
  onSuccess,
}: ExerciseCardProps & Props) {
  const IconComponent = icon;

  const [days, setDays] = useState<number | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  const isFormValid = useMemo(() => {
    return days !== null && duration !== "" && level !== "";
  }, [days, duration, level]);

  const sendData = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!isFormValid || days === null) {
      return;
    }

    const payload: PredefinedPlansRequest = {
      category: title,
      days_per_week: days,
      duration,
      level,
    };

    try {
      const res = await fetch("http://localhost:8080/workouts/predefined", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const result = await res.json();
      onSuccess(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="w-[650px]">
      <Card.Header className="p-6">
        <form onSubmit={sendData}>
          <div className="flex flex-col gap-6">
            <div className="grid [grid-template-columns:1fr_15fr] gap-3">
              <div className={`${iconBg} p-3 rounded-xl w-fit`}>
                <IconComponent className="w-6 h-6" />
              </div>

              <div className="w-full">
                <Card.Title className="text-xl">{title}</Card.Title>
                <Card.Description>{description}</Card.Description>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label> How many days per week can you train?</Label>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onPress={() => setDays(3)}
                  className={
                    days === 3
                      ? "rounded-xl bg-[#F7F7FE] text-black border border-2 border-indigo-500 h-[65px] w-[200px] flex flex-col items-center justify-center leading-tight gap-0"
                      : "rounded-xl bg-white text-black border border-2 h-[65px] w-[200px] hover:border-indigo-500 flex flex-col items-center justify-center leading-tight gap-0"
                  }
                >
                  3 days
                </Button>

                <Button
                  type="button"
                  onPress={() => setDays(4)}
                  className={
                    days === 4
                      ? "rounded-xl bg-[#F7F7FE] text-black border border-2 border-indigo-500 h-[65px] w-[200px] flex flex-col items-center justify-center leading-tight gap-0"
                      : "rounded-xl bg-white text-black border border-2 h-[65px] w-[200px] hover:border-indigo-500 flex flex-col items-center justify-center leading-tight gap-0"
                  }
                >
                  4 days
                </Button>

                <Button
                  type="button"
                  onPress={() => setDays(5)}
                  className={
                    days === 5
                      ? "rounded-xl bg-[#F7F7FE] text-black border border-2 border-indigo-500 h-[65px] w-[200px] flex flex-col items-center justify-center leading-tight gap-0"
                      : "rounded-xl bg-white text-black border border-2 h-[65px] w-[200px] hover:border-indigo-500 flex flex-col items-center justify-center leading-tight gap-0"
                  }
                >
                  5 days
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>How much time per session?</Label>

              <Select
                className="w-full"
                placeholder="Select session duration"
                selectedKey={duration || null}
                onSelectionChange={(key: Key | null) => {
                  setDuration(key ? String(key) : "");
                }}
              >
                <Select.Trigger className="bg-gray-50">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                  <ListBox>
                    <ListBox.Item
                      id="30-45"
                      textValue="30-45"
                      className="hover:bg-indigo-500 hover:text-white"
                    >
                      30-45 minutes
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="45-60"
                      textValue="45-60"
                      className="hover:bg-indigo-500 hover:text-white"
                    >
                      45-60 minutes
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="60-75"
                      textValue="60-75"
                      className="hover:bg-indigo-500 hover:text-white"
                    >
                      60-75 minutes
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="75+"
                      textValue="75+"
                      className="hover:bg-indigo-500 hover:text-white"
                    >
                      75+ minutes
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <RadioGroup
              value={level}
              onChange={(value) => setLevel(String(value))}
              name="plan"
              className="flex flex-col gap-2"
            >
              <Label>What's your experience level?</Label>

              <Radio
                value="Beginner"
                className="border-2 w-full rounded-xl h-[65px] px-4 flex items-center gap-3 m-0"
              >
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>

                <Radio.Content className="flex flex-col justify-center">
                  <Label className="leading-tight">Beginner</Label>
                  <Description className="text-gray-500 text-sm leading-tight">
                    New to structured training
                  </Description>
                </Radio.Content>
              </Radio>

              <Radio
                value="Intermediate"
                className="border-2 w-full rounded-xl h-[65px] px-4 flex items-center gap-3 m-0"
              >
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>

                <Radio.Content className="flex flex-col justify-center">
                  <Label className="leading-tight">Intermediate</Label>
                  <Description className="text-gray-500 text-sm leading-tight">
                    1-2 years of experience
                  </Description>
                </Radio.Content>
              </Radio>

              <Radio
                value="Advanced"
                className="border-2 w-full rounded-xl h-[65px] px-4 flex items-center gap-3 m-0"
              >
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>

                <Radio.Content className="flex flex-col justify-center">
                  <Label className="leading-tight">Advanced</Label>
                  <Description className="text-gray-500 text-sm leading-tight">
                    3+ years of consistent training
                  </Description>
                </Radio.Content>
              </Radio>
            </RadioGroup>

            <div className="pt-2">
              <Button type="submit" className="bg-indigo-500 w-full rounded-xl">
                Get Recommendations
              </Button>
            </div>
          </div>
        </form>
      </Card.Header>
    </Card>
  );
}
