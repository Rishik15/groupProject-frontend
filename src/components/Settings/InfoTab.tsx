import { Card, Input, Label, TextArea } from "@heroui/react";
import type { Dispatch, SetStateAction } from "react";

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
      <Card className="w-165 rounded-xl border border-[#E8E8EF]">
          <Card.Footer className="flex flex-col items-start gap-4 pt-2 pl-2 pr-2">
              <div className="flex flex-col w-full gap-2">
                  <Label>Full Name</Label>
                  <Input
                      value={fullName}
                      readOnly
                      className="bg-gray-100 rounded-md"
                  />
              </div>

              <div className="flex flex-col w-full gap-2">
                  <Label>Email</Label>
                  <Input
                      value={form.email ?? ""}
                      readOnly
                      className="bg-gray-100 rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full ">
                    <Label>
                        Date of Birth
                    </Label>
                     <Input
                      value={form.dob ?? ""}
                      readOnly
                      className="bg-gray-100 rounded-md"
                  />
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

          </Card.Footer>
      </Card>
  );
}