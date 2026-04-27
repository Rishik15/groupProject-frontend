import { Input, Label } from "@heroui/react";
import type { User } from "../../../services/Setting/User";
import { formatDate, readonlyClass } from "../utils";

type ProfileSectionProps = {
  form: User;
  role: string;
};

export default function ProfileSection({ form, role }: ProfileSectionProps) {
  const fullName = `${form.first_name ?? ""} ${form.last_name ?? ""}`.trim();

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Label>Full Name</Label>
        <Input value={fullName} readOnly className={readonlyClass} />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label>Email</Label>
        <Input value={form.email ?? ""} readOnly className={readonlyClass} />
      </div>

      {role !== "coach" && (
        <div className="flex w-full flex-col gap-2">
          <Label>Date of Birth</Label>
          <Input
            value={form.dob ? formatDate(form.dob) : ""}
            readOnly
            className={readonlyClass}
          />
        </div>
      )}
    </>
  );
}
