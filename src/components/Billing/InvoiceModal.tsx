import { Button, Modal } from "@heroui/react";
import { Calendar, CreditCard, DollarSign, FileText, User, X } from "lucide-react";
import type { PaymentHistoryDetail } from "./type";

type Prop = {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    payment: PaymentHistoryDetail | null;
};

const InvoiceModal = ({ payment, isOpen, setIsOpen }: Prop) => {
    if (!payment) return null;

    const date = payment.paid_at
        ? new Date(payment.paid_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        : "";

    const coachName = payment.coach
        ? `${payment.coach.first_name} ${payment.coach.last_name}`
        : "";

    const cardUsed = payment.payment_method
        ? `${payment.payment_method.card_brand} •••• ${payment.payment_method.card_last_four}`
        : "";

    return (
        <Modal isOpen={isOpen}>
            <Modal.Backdrop className="bg-black/40">
                <Modal.Container>
                    <Modal.Dialog className="w-full max-w-xl rounded-2xl bg-white p-0 shadow-xl">
                        <div className="flex items-start justify-between border-b p-6">
                            <div className="flex gap-4">

                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <p className="my-auto text-2xl font-bold">Invoice</p>


                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <Modal.Body className="p-6">
                            <div className="flex justify-between border-b pb-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Payment ID
                                    </p>
                                    <p className="mt-1 font-medium">#{payment.payment_id}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Invoice Date
                                    </p>
                                    <p className="mt-1 font-medium">{date}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col divide-y">
                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-indigo-500" />
                                        <p className="font-medium">Coach</p>
                                    </div>
                                    <p>{coachName}</p>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <p className="font-medium">Description</p>
                                    </div>
                                    <p>{payment.description ?? "Payment"}</p>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-indigo-500" />
                                        <p className="font-medium">Payment Date</p>
                                    </div>
                                    <p>{date}</p>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-4 w-4 text-indigo-500" />
                                        <p className="font-medium">Payment Method</p>
                                    </div>
                                    <p>{cardUsed}</p>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="h-4 w-4 text-indigo-500" />
                                        <p className="font-medium">Amount</p>
                                    </div>
                                    <p>${Number(payment.amount).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t pt-6">
                                <p className="text-lg text-black font-bold">Total</p>
                                <p className="text-2xl text-black font-bold">
                                    ${Number(payment.amount).toFixed(2)}
                                </p>
                            </div>
                        </Modal.Body>

                        <div className="flex justify-end gap-3 border-t p-6">
                            <Button
                                className="rounded-lg border bg-white px-6 text-black"
                                onClick={() => window.print()}
                            >
                                Print
                            </Button>

                            <Button
                                className="rounded-lg bg-indigo-500 px-6 text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};

export default InvoiceModal;