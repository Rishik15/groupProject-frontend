import { Card } from "@heroui/react";
import { CreditCard, LockKeyhole } from "lucide-react";
import PaymentInfoCard from "./PaymentInfoCard";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import type { PaymentMethod } from "./type";

type Props = {
    payment_methods: PaymentMethod[];
    addCardToList: (method: PaymentMethod) => void;
    removePaymentMethod: (id: number) => void;
    setDefault: (id: number) => void;
};

const PaymentMethodCard = ({
    payment_methods,
    addCardToList,
    removePaymentMethod,
    setDefault
}: Props) => {

    return (
        <Card className="w-220 border rounded-xl p-5">
            <div className="flex gap-2 items-center">
                <div className="flex justify-center items-center bg-gray-100 rounded-lg w-8 h-8">
                    <CreditCard />
                </div>

                <p className="font-bold">Payment Methods</p>

                <div className="ml-auto">
                    <AddPaymentMethodModal
                        payment_methods={payment_methods}
                        addCardToList={addCardToList}
                        removePaymentMethod={removePaymentMethod}
                    />
                </div>
            </div>

            <Card className="overflow-hidden rounded-2xl border p-0 mt-6 mb-6">
                {payment_methods.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                        No payment methods added yet.
                    </div>
                ) : (
                    <div className="max-h-[260px] overflow-y-auto">
                        {payment_methods.map((paymentMethod) => (
                            <PaymentInfoCard
                                key={paymentMethod.payment_method_id}
                                method={paymentMethod}
                                isDefault={paymentMethod.is_default === 1}
                                onRemove={removePaymentMethod}
                                setDefault={setDefault}
                                
                            />
                        ))}
                    </div>
                )}
            </Card>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
                <LockKeyhole className="h-4 w-4" />
                <p className="text-xs leading-tight">
                    Your payment information is secure and encrypted.
                </p>
            </div>
        </Card>
    );
};

export default PaymentMethodCard;