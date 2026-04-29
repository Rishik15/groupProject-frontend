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
        <Card
            data-testid={`cert-card-${index}`}
            className="rounded-2xl bg-gray-100 p-4"
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">
                        Certification {index + 1}
                    </p>

                    <Button
                        data-testid={`delete-cert-${index}`}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                        onPress={handleDelete}
                    >
                        <X size={18} />
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Certification Name</Label>
                    <Input
                        data-testid={`certification-name-${index}`}
                        value={cert.name}
                        onChange={(e) =>
                            updateField(index, "name", e.target.value)
                        }
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Provider Name</Label>
                    <Input
                        data-testid={`provider-name-${index}`}
                        value={cert.provider}
                        onChange={(e) =>
                            updateField(index, "provider", e.target.value)
                        }
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Description</Label>
                    <TextArea
                        data-testid={`description-name-${index}`}
                        value={cert.description}
                        onChange={(e) =>
                            updateField(index, "description", e.target.value)
                        }
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CertificationDatePicker
                        index={index}
                        label="Issue Date"
                        data-testid={`issue-name-${index}`}
                        value={cert.issued_date}
                        onChange={(value) =>
                            updateField(index, "issued_date", value)
                        }
                    />

                    <CertificationDatePicker
                        index={index}
                        label="Expires Date"
                        data-testid={`expires-name-${index}`}
                        value={cert.expires_date}
                        onChange={(value) =>
                            updateField(index, "expires_date", value)
                        }
                    />
                </div>
            </div>
        </Card>
    );
}