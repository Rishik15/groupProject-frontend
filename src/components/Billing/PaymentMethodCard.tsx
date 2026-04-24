import { Card, Button } from "@heroui/react";
import { CreditCard, Lock, LockKeyhole, Plus } from "lucide-react";
import PaymentInfoCard from "./PaymentInfoCard";

const PaymentMethodCard = () => {

    return (
        <Card className="w-220 border rounded-xl p-5">
            <div className="flex gap-2">
                <div className=" flex justify-center items-center bg-gray-100 rounded-lg w-8 h-8" >
                    <CreditCard />
                </div>

                <p className="my-auto font-bold">
                    Payment Methods
                </p>
                <Button className="rounded-lg py-3 bg-white text-indigo-500 border border-indigo-500 ml-auto"> <Plus /> Add Payment Method</Button>
            </div>

            <Card className="overflow-hidden rounded-2xl border p-0 mt-6 mb-6">
                <PaymentInfoCard isDefault />
                <PaymentInfoCard />
            </Card>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
                <LockKeyhole className="h-4 w-4 mt-[0px]" />
                <p className="mt-[3px] text-xs leading-tight">
                    Your payment information is secure and encrypted.
                </p>
            </div>
        </Card>
    );


}

export default PaymentMethodCard;