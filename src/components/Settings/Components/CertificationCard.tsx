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
        value: string | CalendarDate | null
    ) => void;
    removeCertificate: (index: number) => void;
};

export default function CertificationCard({
    cert,
    index,
    updateField,
    removeCertificate,
}: Props) {
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
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                        onPress={handleDelete}
                        data-testid={`delete-cert-${index}`}
                    >
                        <X size={18} />
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Certification Name</Label>
                    <Input
                        value={cert.name}
                        onChange={(e) =>
                            updateField(index, "name", e.target.value)
                        }
                        data-testid={`certification-name-${index}`}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Provider Name</Label>
                    <Input
                        value={cert.provider}
                        onChange={(e) =>
                            updateField(index, "provider", e.target.value)
                        }
                        data-testid={`provider-name-${index}`}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Description</Label>
                    <TextArea
                        value={cert.description}
                        onChange={(e) =>
                            updateField(index, "description", e.target.value)
                        }
                        data-testid={`description-name-${index}`}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CertificationDatePicker
                        index={index}
                        label="Issue Date"
                        value={cert.issued_date}
                        onChange={(value) =>
                            updateField(index, "issued_date", value)
                        }
                        data-testid={`Issue Date${index}`}
                    />

                    <CertificationDatePicker
                        index={index}
                        label="Expires Date"
                        value={cert.expires_date}
                        onChange={(value) =>
                            updateField(index, "expires_date", value)
                        }
                        data-testid={`Expires Date${index}`}
                    />
                </div>
            </div>
        </Card>
    );
}