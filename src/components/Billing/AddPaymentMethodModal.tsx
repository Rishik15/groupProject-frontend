import { useState } from "react";
import { Modal, Button, Input, Checkbox } from "@heroui/react";
import { Plus } from "lucide-react";
import { Label } from "@heroui/react";
import type { PaymentMethodForm } from "./type";
import type { PaymentMethod } from "./type";
import { add_payment_method } from "../../services/billing/add_payment_method";
import type { AddPaymentMethodPayload } from "./type";

type Props = {
    payment_methods: PaymentMethod[];
    addCardToList: (method: PaymentMethod) => void;
    removePaymentMethod: (id: number) => void;
};


const AddPaymentMethodModal = ({
    payment_methods,
    addCardToList,
    removePaymentMethod
}: Props) => {

    const [isOpen, setIsOpen] = useState(false);

    const initialForm: PaymentMethodForm = {
        cardNumber: "",
        expiry: "",
        cvc: "",
        name: "",
        isDefault: false,
    };

    const [form, setForm] = useState<PaymentMethodForm>(initialForm);

    const canSubmit =
        form.cardNumber.replace(/\s/g, "").length === 16 &&
        /^\d{2}\/\d{2}$/.test(form.expiry) &&
        /^\d{3,4}$/.test(form.cvc) &&
        form.name.trim().length > 1;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        const [month, year] = form.expiry.split("/");


        const payload: AddPaymentMethodPayload = {
            card_number: form.cardNumber,
            card_brand: "VISA",
            expiry_month: Number(month),
            expiry_year: Number("20" + year),
        };

        const res = await add_payment_method(payload);

        const newMethod: PaymentMethod = {
            payment_method_id: res.payment_method_id,
            user_id: 1,
            card_last_four: form.cardNumber.slice(-4),
            card_brand: payload.card_brand,
            expiry_month: payload.expiry_month,
            expiry_year: payload.expiry_year,
            is_default: form.isDefault ? 1 : 0,
        };

        addCardToList(newMethod);
        handleClose();
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 16);
        const formatted = value.replace(/(.{4})/g, "$1 ").trim();

        setForm({ ...form, cardNumber: formatted });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 4);

        const formatted =
            value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;

        setForm({ ...form, expiry: formatted });
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 4);

        setForm({ ...form, cvc: value });
    };

    const handleCheckbox = (checked: boolean) =>
        setForm({ ...form, isDefault: checked });

    const resetForm = () => setForm(initialForm);

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);

                if (!open) {
                    resetForm();
                }
            }}>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-lg py-3 bg-white text-indigo-500 border border-indigo-500 ml-auto"
            >
                <Plus /> Add Payment Method
            </Button>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className=" p-0 w-[600px] max-w-none h-[480px]">

                        <Modal.CloseTrigger onClick={handleClose} />

                        <Modal.Body className="flex flex-col gap-4 p-8">
                            <div className="mb-6">
                                <h2 className="text-lg text-black font-semibold">Add Payment Method</h2>
                                <p>Add a new card to your account.</p>
                            </div>

                            <div className="flex flex-col gap-5">

                                <div className="flex flex-col">
                                    <Label>Credit Card Number</Label>
                                    <Input
                                        value={form.cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 1234 1234 1234"
                                        className="rounded-lg h-11 border border-gray-300"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex flex-col w-1/2">
                                        <Label>Expiration Date</Label>
                                        <Input
                                            value={form.expiry}
                                            onChange={handleExpiryChange}
                                            placeholder="MM/YY"
                                            className="rounded-lg h-11 border border-gray-300"
                                        />
                                    </div>

                                    <div className="flex flex-col w-1/2">
                                        <Label>Security Code</Label>
                                        <Input
                                            value={form.cvc}
                                            onChange={handleCvcChange}
                                            placeholder="CVC"
                                            className="rounded-lg h-11 border border-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <Label>Name on Card</Label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="rounded-lg h-11 border border-gray-300"
                                    />
                                </div>

                                <Checkbox
                                    isSelected={form.isDefault}
                                    onChange={handleCheckbox}
                                >
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <Checkbox.Content>
                                        <Label>Set as default payment</Label>
                                    </Checkbox.Content>
                                </Checkbox>

                                <div className="flex ml-auto gap-2">
                                    <Button
                                        onClick={handleClose}
                                        className="border rounded-lg bg-white text-black"
                                    >
                                        Cancel
                                    </Button>

                                    <Button className="text-white bg-indigo-500 rounded-lg"
                                        onClick={handleSubmit}
                                        isDisabled={!canSubmit}
                                        >
                                        Add Card
                                    </Button>
                                </div>

                            </div>
                        </Modal.Body>

                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};

export default AddPaymentMethodModal;