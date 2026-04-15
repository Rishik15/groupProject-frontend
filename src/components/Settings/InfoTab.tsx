import { Card, Input, Label } from "@heroui/react";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";

type User = {
  first_name?: string;
  last_name?: string;
  email?: string;
  dob?: string;
  weight?: string | number;
  height?: string | number;
  goal_weight?: string | number;
  bio?: string;
  price?: string | number;
  coach_description?: string;
  experience_years?: string | number;
  specialties?: string;
  certifications?: string;
};

type InfoTabProps = {
  form: User | null;
  setForm: Dispatch<SetStateAction<User | null>>;
  edit: boolean;
  role: string;
};

export function InfoTab({ form, setForm, edit, role }: InfoTabProps) {
  if (!form) return null;

  const fullName = `${form.first_name ?? ""} ${form.last_name ?? ""}`.trim();

  const getInputClass = (editable: boolean) =>
    editable
      ? "rounded-md bg-white border border-gray-200"
      : "rounded-md bg-gray-100";

  const updateNumberField =
    (key: keyof User) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) =>
        prev
          ? {
              ...prev,
              [key]: value === "" ? "" : Number(value),
            }
          : prev
      );
    };

  const updateTextField =
    (key: keyof User) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) =>
        prev
          ? {
              ...prev,
              [key]: value,
            }
          : prev
      );
    };

  return (
    <Card className="w-165 rounded-xl border border-[#E8E8EF]">
      <Card.Footer className="flex flex-col items-start gap-4 pt-2 pl-2 pr-2">
        <div className="flex w-full flex-col gap-2">
          <Label>Full Name</Label>
          <Input
            value={fullName}
            readOnly
            className={getInputClass(false)}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Email</Label>
          <Input
            value={form.email ?? ""}
            readOnly
            className={getInputClass(false)}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Date of Birth</Label>
          <Input
            value={form.dob ?? ""}
            readOnly
            className={getInputClass(false)}
          />
        </div>

        <div className="grid w-full grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Weight</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={form.weight != null ? String(form.weight) : ""}
              readOnly={!edit}
              onChange={updateNumberField("weight")}
              className={getInputClass(edit)}
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label>Goal Weight</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={form.goal_weight != null ? String(form.goal_weight) : ""}
              readOnly={!edit}
              onChange={updateNumberField("goal_weight")}
              className={getInputClass(edit)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Height</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={form.height != null ? String(form.height) : ""}
              readOnly={!edit}
              onChange={updateNumberField("height")}
              className={getInputClass(edit)}
            />
          </div>
        </div>

        {role === "coach" && (
          <>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price != null ? String(form.price) : ""}
                  readOnly={!edit}
                  onChange={updateNumberField("price")}
                  className={getInputClass(edit)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Experience Years</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={
                    form.experience_years != null
                      ? String(form.experience_years)
                      : ""
                  }
                  readOnly={!edit}
                  onChange={updateNumberField("experience_years")}
                  className={getInputClass(edit)}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label>Specialties</Label>
              <Input
                value={form.specialties ?? ""}
                readOnly={!edit}
                onChange={updateTextField("specialties")}
                className={getInputClass(edit)}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label>Certifications</Label>
              <Input
                value={form.certifications ?? ""}
                readOnly={!edit}
                onChange={updateTextField("certifications")}
                className={getInputClass(edit)}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label>Coach Description</Label>
              <Input
                value={form.coach_description ?? ""}
                readOnly={!edit}
                onChange={updateTextField("coach_description")}
                className={getInputClass(edit)}
              />
            </div>
          </>
        )}
      </Card.Footer>
    </Card>
  );
}