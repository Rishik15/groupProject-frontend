import { Button, Card } from "@heroui/react";
import { FileText } from "lucide-react";
import type { PaymentHistoryDetail } from "./type";
import PaymentRow from "./PaymentHistoryRow";

type Props = {
    historyList: PaymentHistoryDetail[];
};

const PaymentHistoryCard = ({ historyList }: Props) => {
    return (
        <Card className="w-full border rounded-xl p-5 flex flex-col">
            <div className="flex items-center">
                <div className="flex justify-center items-center bg-gray-100 rounded-lg w-8 h-8">
                    <FileText />
                </div>

                <p className="font-bold">Payment History</p>
            </div>

            <div className="grid grid-cols-5 items-center px-4 mt-3 pb-4 text-sm text-gray-500 border-b">
                <p>Date</p>
                <p>Description</p>
                <p>Coach</p>
                <p>Amount</p>
                <p>Status</p>
            </div>

            <div className="max-h-[260px] overflow-y-auto">
                {historyList.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                        No payment history yet.
                    </div>
                ) : (
                    historyList.map((payment) => (
                        <PaymentRow
                            key={payment.payment_id}
                            payment={payment}
                        />
                    ))
                )}
            </div>
        </Card>
    );
};

export default PaymentHistoryCard;