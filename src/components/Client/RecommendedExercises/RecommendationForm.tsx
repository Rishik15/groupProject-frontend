import { Card, Label, ListBox, Select, Button } from "@heroui/react";
import { Description, Radio, RadioGroup } from "@heroui/react";
import { useMemo, useState } from "react";
import type { Key } from "@heroui/react";
import type { ExerciseGoal, PredefinedPlansRequest } from "./types";

type Props = {
  goal: ExerciseGoal;
  onSubmit: (payload: PredefinedPlansRequest) => Promise<void>;
  loading?: boolean;
};

export function RecommendationForm({ goal, onSubmit, loading = false }: Props) {
  const IconComponent = goal.icon;

  const [days, setDays] = useState<number | null>(null);
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");

  const isFormValid = useMemo(() => {
    return days !== null && duration !== "" && level !== "";
  }, [days, duration, level]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || days === null) return;

    await onSubmit({
      category: goal.category,
      days_per_week: days,
      duration,
      level,
    });
  };

  return (
    <Card className="w-[650px]">
      <Card.Header className="p-6">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-6">
            <div className="grid [grid-template-columns:1fr_15fr] gap-3">
              <div className={`${goal.iconBg} p-3 rounded-xl w-fit`}>
                <IconComponent className="w-6 h-6" />
              </div>

              <div className="w-full">
                <Card.Title className="text-xl">{goal.title}</Card.Title>
                <Card.Description>{goal.description}</Card.Description>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label>How many days per week can you train?</Label>

              <div className="flex gap-3">
                {[3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    onPress={() => setDays(value)}
                    className={
                      days === value
                        ? "rounded-xl bg-[#F7F7FE] text-black border-2 border-indigo-500 h-[65px] w-[200px]"
                        : "rounded-xl bg-white text-black border-2 h-[65px] w-[200px] hover:border-indigo-500"
                    }
                  >
                    {value} days
                  </Button>
                ))}
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
                    <ListBox.Item id="30-45" textValue="30-45 minutes">
                      30-45 minutes
                    </ListBox.Item>
                    <ListBox.Item id="45-60" textValue="45-60 minutes">
                      45-60 minutes
                    </ListBox.Item>
                    <ListBox.Item id="60-75" textValue="60-75 minutes">
                      60-75 minutes
                    </ListBox.Item>
                    <ListBox.Item id="75+" textValue="75+ minutes">
                      75+ minutes
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
              <Label>What’s your experience level?</Label>

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

            <Button
              type="submit"
              isDisabled={!isFormValid || loading}
              className="bg-indigo-500 w-full rounded-xl text-white"
            >
              {loading ? "Loading..." : "Get Recommendations"}
            </Button>
          </div>
        </form>
      </Card.Header>
    </Card>
  );
}