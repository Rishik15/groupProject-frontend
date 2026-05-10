import { Card, Button, Label, Input, TextArea } from "@heroui/react";
import type { CalendarDate } from "@internationalized/date";
import type { CertificationForm } from "../Modals/CertificationModal";
import CertificationDatePicker from "./CertificationDatePicker";
import { X } from "lucide-react";

type Props = {
  cert: CertificationForm;
  index: number;
  updateField: (
    index: number,
    field: keyof CertificationForm,
    value: string | CalendarDate | null,
  ) => void;
  removeCertificate: (index: number) => void;
};

const MAX_CERT_NAME_LENGTH = 100;
const MAX_PROVIDER_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 300;

const toDateString = (value: string | CalendarDate | null | undefined) => {
  if (!value) return "";

  return String(value);
};

const todayString = new Date().toISOString().split("T")[0];

export default function CertificationCard({
  cert,
  index,
  updateField,
  removeCertificate,
}: Props) {
  const issuedDate = toDateString(cert.issued_date);
  const expiresDate = toDateString(cert.expires_date);

  const nameError =
    cert.name.length > MAX_CERT_NAME_LENGTH
      ? `Max ${MAX_CERT_NAME_LENGTH}`
      : "";

  const providerError =
    cert.provider.length > MAX_PROVIDER_LENGTH
      ? `Max ${MAX_PROVIDER_LENGTH}`
      : "";

  const descriptionError =
    cert.description.length > MAX_DESCRIPTION_LENGTH
      ? `Max ${MAX_DESCRIPTION_LENGTH}`
      : "";

  const issuedDateError =
    issuedDate && issuedDate > todayString ? "No future dates" : "";

  const expiresDateError =
    issuedDate && expiresDate && expiresDate < issuedDate
      ? "After issue date"
      : "";

  const getInputClass = (error: string, extraClasses = "") =>
    [
      "outline outline-2 -outline-offset-1",
      error ? "outline-red-400" : "outline-transparent",
      extraClasses,
    ].join(" ");

  const handleTextChange = (
    field: keyof CertificationForm,
    value: string,
    maxLength: number,
  ) => {
    if (value.length <= maxLength) {
      updateField(index, field, value);
    }
  };

  const handleDelete = () => {
    removeCertificate(index);
  };

  return (
    <Card className="rounded-2xl bg-gray-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">
            Certification {index + 1}
          </p>

          <Button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            onPress={handleDelete}
          >
            <X size={18} />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Certification Name</Label>

          <Input
            value={cert.name}
            maxLength={MAX_CERT_NAME_LENGTH}
            aria-invalid={Boolean(nameError)}
            onChange={(e) =>
              handleTextChange("name", e.target.value, MAX_CERT_NAME_LENGTH)
            }
            className={getInputClass(nameError)}
          />

          <p className="h-2 text-[11px] leading-3 text-red-500">{nameError}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Provider Name</Label>

          <Input
            value={cert.provider}
            maxLength={MAX_PROVIDER_LENGTH}
            aria-invalid={Boolean(providerError)}
            onChange={(e) =>
              handleTextChange("provider", e.target.value, MAX_PROVIDER_LENGTH)
            }
            className={getInputClass(providerError)}
          />

          <p className="h-2 text-[11px] leading-3 text-red-500">
            {providerError}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Description</Label>

          <TextArea
            value={cert.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            aria-invalid={Boolean(descriptionError)}
            onChange={(e) =>
              handleTextChange(
                "description",
                e.target.value,
                MAX_DESCRIPTION_LENGTH,
              )
            }
            className={getInputClass(descriptionError)}
          />

          <p className="h-2 text-[11px] leading-3 text-red-500">
            {descriptionError}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <CertificationDatePicker
              label="Issue Date"
              value={cert.issued_date}
              onChange={(value) => updateField(index, "issued_date", value)}
            />

            <p className="mt-1 h-2 text-[11px] leading-3 text-red-500">
              {issuedDateError}
            </p>
          </div>

          <div>
            <CertificationDatePicker
              label="Expires Date"
              value={cert.expires_date}
              onChange={(value) => updateField(index, "expires_date", value)}
            />

            <p className="mt-1 h-2 text-[11px] leading-3 text-red-500">
              {expiresDateError}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
