"use client";

import { useMemo, useState } from "react";
import { Modal, Button, Card } from "@heroui/react";
import { parseDate, type CalendarDate } from "@internationalized/date";
import type { User } from "../../../services/Setting/User";
import axios from "axios";
import CertificationCard from "../Components/CertificationCard";
import { Plus } from "lucide-react";

export type CertificationForm = {
    id?: number;
    name: string;
    provider: string;
    description: string;
    issued_date: CalendarDate | null;
    expires_date: CalendarDate | null;
};

type Props = {
    form: User;
};

export default function CertificationModal({ form }: Props) {
    const [open, setOpen] = useState(false);

    const initialCerts = useMemo(() => {
        return (form.certifications || []).map((c: any) => ({
            id: c.id,
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

    const addCertificate = () => {
        setCerts((prev) => [
            ...prev,
            {
                id: undefined,
                name: "",
                provider: "",
                description: "",
                issued_date: null,
                expires_date: null,
            },
        ]);
    };

    const removeCertificate = async (index: number) => {
        const cert = certs[index];
        if (!cert) return;

        if (cert.id != null) {
            await axios.delete("http://localhost:8080/coach/certifications/delete", {
                data: {
                    role: "coach",
                    cert_id: cert.id,
                },
                withCredentials: true,
            });
        }

        setCerts((prev) => prev.filter((_, i) => i !== index));
    };

    const isValid = () => {
        return certs.every(
            (c) =>
                c.name.trim() !== "" &&
                c.provider.trim() !== "" &&
                c.issued_date !== null
        );
    };

    const handleSave = async () => {
        if (!isValid()) return;

        const newCerts = certs.filter((c) => c.id == null);

        for (const c of newCerts) {
            await axios.post(
                "http://localhost:8080/coach/certificates",
                {
                    role: "coach",
                    cert_name: c.name,
                    provider_name: c.provider,
                    description: c.description,
                    issued_date: c.issued_date?.toString() || "",
                    expires_date: c.expires_date?.toString() || "",
                },
                {
                    withCredentials: true,
                }
            );
        }

        setOpen(false);
        window.location.reload();
    };

    return (
        <Modal>
            <Button
                className="ml-auto rounded-xl border border-gray-300 bg-white text-black"
                onPress={() => setOpen(true)}
            >
                Edit Certifications
            </Button>

            <Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
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
                                        <CertificationCard
                                            key={cert.id ?? index}
                                            cert={cert}
                                            index={index}
                                            updateField={updateField}
                                            removeCertificate={removeCertificate}
                                        />
                                    ))
                                )}
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <div className="flex w-full items-center justify-between gap-3">
                                <Button  className="bg-indigo-500 rounded-xl text-white" onPress={addCertificate}>
                                    <Plus />
                                    Add Certification
                                </Button>

                                <div className="flex gap-2">
                                    <Button className="border border-gray-300 rounded-xl bg-white text-black" onPress={() => setOpen(false)}>
                                        Cancel
                                    </Button>

                                    <Button
                                    className="bg-indigo-500 rounded-xl text-white"
                                        onPress={handleSave}
                                        isDisabled={!isValid()}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}