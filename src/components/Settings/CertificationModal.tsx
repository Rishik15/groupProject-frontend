"use client";

import { useMemo, useState } from "react";
import {
    Modal,
    Button,
    Card,
    Label,
    Input,
    TextArea,
    DatePicker,
    DateField,
    Calendar,
} from "@heroui/react";
import { parseDate, type CalendarDate } from "@internationalized/date";
import type { User } from "../../services/Setting/User";
import axios from "axios";

type CertificationForm = {
    name: string;
    provider: string;
    description: string;
    issued_date: CalendarDate | null;
    expires_date: CalendarDate | null;
};

type Props = {
    form: User;
};

function CertificationDatePicker({
    label,
    value,
    onChange,
}: {
    label: string;
    value: CalendarDate | null;
    onChange: (value: CalendarDate | null) => void;
}) {
    return (
        <DatePicker className="w-full" value={value} onChange={onChange}>
            <Label>{label}</Label>

            <DateField.Group fullWidth>
                <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>

                <DateField.Suffix>
                    <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                </DateField.Suffix>
            </DateField.Group>

            <DatePicker.Popover>
                <Calendar aria-label={label}>
                    <Calendar.Header>
                        <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                        </Calendar.YearPickerTrigger>

                        <Calendar.NavButton slot="previous" />
                        <Calendar.NavButton slot="next" />
                    </Calendar.Header>

                    <Calendar.Grid>
                        <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                        </Calendar.GridHeader>

                        <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} />}
                        </Calendar.GridBody>
                    </Calendar.Grid>

                    <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                        </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                </Calendar>
            </DatePicker.Popover>
        </DatePicker>
    );
}

export default function CertificationModal({ form }: Props) {
    const initialCerts = useMemo(() => {
        return (form.certifications || []).map((c: any) => ({
            name: c.name || "",
            provider: c.provider || "",
            description: c.description || "",
            issued_date: c.issued_date ? parseDate(c.issued_date) : null,
            expires_date: c.expires_date ? parseDate(c.expires_date) : null,
        }));
    }, [form]);

    const [certs, setCerts] = useState<CertificationForm[]>(initialCerts);

    const updateField = (
        index: number,
        field: keyof CertificationForm,
        value: string | CalendarDate | null
    ) => {
        setCerts((prev) =>
            prev.map((cert, i) =>
                i === index ? { ...cert, [field]: value } : cert
            )
        );
    };

    /**
     *     provider = incoming_json.get("provider_name")
         description = incoming_json.get("description")
    issued_date = incoming_json.get("issued_date")
    expires_date = incoming_json.get("expires_date")
     */
    const handleSave = async () => {
        const c = certs[0];

        const payload = {
            cert_name: c.name,
            provider_name: c.provider,
            description: c.description,
            issued_date: c.issued_date?.toString() || "",
            expires_date: c.expires_date?.toString() || "",
        };

        await axios.post("http://localhost:8080/coach/certificates", payload, {
            withCredentials: true,
        });
    };

    return (
        <Modal>
            <Button className="ml-auto rounded-xl border border-gray-300 bg-white text-black">
                Edit Certifications
            </Button>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="max-h-[90vh] overflow-hidden">
                        <Modal.CloseTrigger />

                        <Modal.Header>
                            <div className="flex flex-col">
                                <p className="text-lg font-semibold">Edit Certifications</p>
                                <p className="text-sm text-gray-500">
                                    Update your existing certifications.
                                </p>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {certs.length === 0 ? (
                                    <Card className="rounded-2xl bg-gray-100 p-4">
                                        <p className="text-sm text-gray-500">
                                            No certifications found.
                                        </p>
                                    </Card>
                                ) : (
                                    certs.map((cert, index) => (
                                        <Card key={index} className="rounded-2xl bg-gray-100 p-4">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-gray-900">
                                                        Certification {index + 1}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label>Certification Name</Label>
                                                    <Input
                                                        value={cert.name}
                                                        onChange={(e) =>
                                                            updateField(index, "name", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label>Provider Name</Label>
                                                    <Input
                                                        value={cert.provider}
                                                        onChange={(e) =>
                                                            updateField(index, "provider", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label>Description</Label>
                                                    <TextArea
                                                        value={cert.description}
                                                        onChange={(e) =>
                                                            updateField(index, "description", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <CertificationDatePicker
                                                        label="Issue Date"
                                                        value={cert.issued_date}
                                                        onChange={(value) =>
                                                            updateField(index, "issued_date", value)
                                                        }
                                                    />

                                                    <CertificationDatePicker
                                                        label="Expires Date"
                                                        value={cert.expires_date}
                                                        onChange={(value) =>
                                                            updateField(index, "expires_date", value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="ghost">Cancel</Button>
                            <Button variant="primary" onPress={handleSave}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}