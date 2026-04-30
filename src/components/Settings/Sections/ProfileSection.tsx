import type { User } from "../../../services/Setting/User";
import { formatDate } from "../utils";

type ProfileSectionProps = {
  form: User;
  role: string;
};

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-[#0F0F14]">{label}</p>

      <div className="min-h-12 rounded-xl border border-transparent bg-[#F5F6FA] px-4 py-3 text-sm text-[#0F0F14]">
        {value || "Not provided"}
      </div>
    </div>
  );
}

export default function ProfileSection({ form, role }: ProfileSectionProps) {
  const fullName = `${form.first_name ?? ""} ${form.last_name ?? ""}`.trim();

  return (
    <section className="flex w-full flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-[#0F0F14]">
          Account Details
        </h3>
        <p className="mt-1 text-xs text-[#72728A]">
          These details are connected to your account and cannot be edited here.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4">
        <InfoRow label="Full Name" value={fullName} />
        <InfoRow label="Email" value={form.email ?? ""} />

        {role !== "coach" && (
          <InfoRow
            label="Date of Birth"
            value={form.dob ? formatDate(form.dob) : ""}
          />
        )}
      </div>
    </section>
  );
}
