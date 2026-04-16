import { Card, Input, Label, TextArea } from "@heroui/react";
import type { Dispatch, SetStateAction } from "react";
import { Calendar, DateField, DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

type User = {
    first_name?: string;
    last_name?: string;
    email?: string;
    dob?: string;
    weight?: string | number;
    height?: string | number;
    goal_weight?: string | number;
    bio?: string;
};

type InfoTabProps = {
    form: User | null;
    setForm: Dispatch<SetStateAction<User | null>>;
    edit: boolean;
};

export function InfoTab({ form, setForm, edit }: InfoTabProps) {

    const fullName = `${form?.first_name ?? ""} ${form?.last_name ?? ""}`.trim();

    if (!form) return null;
    return (
      <Card className="w-auto rounded-xl border border-[#E8E8EF]">
          <Card.Footer className="flex flex-col items-start gap-4 pt-2 pl-2 pr-2">
              <div className="flex flex-col w-full gap-2">
                  <Label>Full Name</Label>
                  <Input
                      value={fullName}
                      readOnly={!edit}
                      onChange={(e) => {
                          const parts = e.target.value.split(" ");
                          setForm((prev) =>
                              prev
                                  ? {
                                      ...prev,
                                      first_name: parts[0] ?? "",
                                      last_name: parts.slice(1).join(" "),
                                  }
                                  : prev
                          );
                      }}
                      className="bg-gray-100 rounded-md"
                  />
              </div>

              <div className="flex flex-col w-full gap-2">
                  <Label>Email</Label>
                  <Input
                      value={form.email ?? ""}
                      readOnly={!edit}
                      onChange={(e) =>
                          setForm((prev) => (prev ? { ...prev, email: e.target.value } : prev))
                      }
                      className="bg-gray-100 rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full ">
                    <DatePicker className="w-full" name="date" value={
                        form.dob
                            ? parseDate(new Date(form.dob).toISOString().split("T")[0])
                            : null
                    }>
                        <Label>Date of Birth</Label>
                        <DateField.Group fullWidth className="bg-gray-100">
                            <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                            <DateField.Suffix>
                                <DatePicker.Trigger>
                                    <DatePicker.TriggerIndicator />
                                </DatePicker.Trigger>
                            </DateField.Suffix>
                        </DateField.Group>
                        <DatePicker.Popover>
                            <Calendar aria-label="Event date">
                                <Calendar.Header>
                                    <Calendar.YearPickerTrigger>
                                        <Calendar.YearPickerTriggerHeading />
                                        <Calendar.YearPickerTriggerIndicator />
                                    </Calendar.YearPickerTrigger>
                                    <Calendar.NavButton slot="previous" />
                                    <Calendar.NavButton slot="next" />
                                </Calendar.Header>
                                <Calendar.Grid>
                                    <Calendar.GridHeader>
                                        {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                    </Calendar.GridHeader>
                                    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                                </Calendar.Grid>
                                <Calendar.YearPickerGrid>
                                    <Calendar.YearPickerGridBody>
                                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                                    </Calendar.YearPickerGridBody>
                                </Calendar.YearPickerGrid>
                            </Calendar>
                        </DatePicker.Popover>
                    </DatePicker>
                </div>

                <div className="grid grid-cols-3 w-full gap-4">
                  <div className="flex flex-col gap-2">
                        <Label>Weight</Label>
                      <Input
                            value={form.weight != null ? String(form.weight) : ""}
                            readOnly={!edit}
                            onChange={(e) =>
                                setForm((prev) => (prev ? { ...prev, weight: e.target.value } : prev))
                            }
                          className="bg-gray-100 rounded-md"
                      />
                  </div>
                    <div className="flex flex-col w-full gap-2">
                        <Label>Goal Weight</Label>
                        <Input
                            value={form.goal_weight != null ? String(form.goal_weight) : ""}
                            readOnly={!edit}
                            onChange={(e) =>
                                setForm((prev) =>
                                    prev ? { ...prev, goal_weight: e.target.value } : prev
                                )
                            }
                            className="bg-gray-100 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Height</Label>
                        <Input
                            value={form.height != null ? String(form.height) : ""}
                            readOnly={!edit}
                            onChange={(e) =>
                                setForm((prev) => (prev ? { ...prev, height: e.target.value } : prev))
                            }
                            className="bg-gray-100 rounded-md"
                        />
                    </div>
              </div>


              <div className="flex flex-col w-full gap-2">
                  <Label>Bio</Label>
                  <TextArea
                      value={form.bio ?? ""}
                      readOnly={!edit}
                      onChange={(e) =>
                          setForm((prev) => (prev ? { ...prev, bio: e.target.value } : prev))
                      }
                      className="bg-gray-100"
                  />
              </div>
          </Card.Footer>
      </Card>
  );
}