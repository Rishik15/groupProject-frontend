import { Card } from "@heroui/react";
import type { User } from "../../../services/Setting/User";
import CertificationModal from "../Modals/CertificationModal";

type Prop = {
  form: User;
  edit: boolean;
};

export default function CoachCertificationsSection({ form, edit }: Prop) {
  const certifications = form.certifications ?? [];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Coach Certifications
            </p>
            <p className="text-xs text-gray-500">
              Show your credentials on your profile.
            </p>
          </div>

          {edit && <CertificationModal form={form} />}
        </div>

        <Card className="rounded-xl bg-gray-100 p-4">
          <div className="flex flex-col gap-2">
            <div>
              <p className="font-semibold text-gray-800">Saved Certifications</p>
              <p className="text-xs text-gray-500">
                {certifications.length} certification
                {certifications.length !== 1 ? "s" : ""} added
              </p>
            </div>

            {certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <span
                    key={`${cert.name}-${index}`}
                    className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {cert.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white px-3 py-2 text-sm text-gray-500">
                No certifications added yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}