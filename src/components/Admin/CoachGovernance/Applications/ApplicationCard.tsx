import { Button } from "@heroui/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatAdminCurrency, formatAdminDateTime, formatCoachApplicationStatusLabel } from "../../../../utils/Admin/adminFormatters";
import type { AdminCoachApplication } from "../../../../utils/Interfaces/Admin/adminCoachApplication";

interface ApplicationCardProps {
  application: AdminCoachApplication;
  onApprove: (application: AdminCoachApplication) => void;
  onReject: (application: AdminCoachApplication) => void;
}

const ApplicationCard = ({ application, onApprove, onReject }: ApplicationCardProps) => {
  const canAct = application.status === "pending";

  return (
    <div className="rounded-[20px] border border-default-200 bg-default-50 p-5">
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-default-900">
              {application.name || application.email}
            </h3>
            <p className="text-sm text-default-600">{application.email}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-default-600">
            <span className="rounded-full border border-default-200 bg-white px-3 py-1">
              Status: {formatCoachApplicationStatusLabel(application.status)}
            </span>
            <span className="rounded-full border border-default-200 bg-white px-3 py-1">
              Desired price: {formatAdminCurrency(application.desired_price)}
            </span>
            <span className="rounded-full border border-default-200 bg-white px-3 py-1">
              Experience: {application.years_experience ?? "—"} yr
            </span>
          </div>

          <div className="space-y-1 text-sm text-default-600">
            <p>
              <span className="font-medium text-default-800">Applied:</span>{" "}
              {formatAdminDateTime(application.appliedLabel)}
            </p>
            <p>
              <span className="font-medium text-default-800">Description:</span>{" "}
              {application.coach_description ?? "—"}
            </p>
            <p>
              <span className="font-medium text-default-800">Admin note:</span>{" "}
              {application.admin_action ?? "—"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-default-600">
            {(application.certifications ?? []).length > 0 ? (
              application.certifications.map((certification) => (
                <span
                  key={`${application.application_id}-${certification}`}
                  className="rounded-full border border-default-200 bg-white px-3 py-1"
                >
                  {certification}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-default-200 bg-white px-3 py-1">
                No certifications listed
              </span>
            )}
          </div>
        </div>

        {canAct ? (
          <div className="mt-auto flex flex-wrap gap-2 border-t border-default-200 pt-4">
            <Button onPress={() => onApprove(application)}>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </span>
            </Button>
            <Button onPress={() => onReject(application)}>
              <span className="inline-flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Reject
              </span>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ApplicationCard;
