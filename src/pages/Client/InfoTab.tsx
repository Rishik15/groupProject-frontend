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
    function getAge(dob: string) {
        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    }

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

              <div className="grid grid-cols-3 w-full gap-4">
                  <div className="flex flex-col gap-2">
                      <Label>Age</Label>
                      <Input
                          value={form.dob ? String(getAge(form.dob)) : ""}
                          readOnly
                          className="bg-gray-100 rounded-md"
                      />
                  </div>

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