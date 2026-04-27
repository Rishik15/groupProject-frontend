import type { PaymentHistoryDetail } from "./type";

type Props = {
    payment: PaymentHistoryDetail;
};

const PaymentRow = ({ payment }: Props) => {
    const date = payment.paid_at
        ? new Date(payment.paid_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        : "-";

    const statusColor: Record<PaymentHistoryDetail["status"], string> = {
        completed: "bg-green-100 text-green-600",
        pending: "bg-yellow-100 text-yellow-600",
        failed: "bg-red-100 text-red-600",
    };
    return (
        <div className="grid grid-cols-5 items-center  px-4 py-4 border-b hover:bg-gray-50 cursor-pointer">
            <p className="text-sm text-gray-700">{date}</p>

            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">
                    {payment.description ?? "Payment"}
                </p>
            </div>

            <p className="text-sm text-gray-700">
                {payment.coach
                    ? `${payment.coach.first_name} ${payment.coach.last_name}`
                    : ""}
            </p>

            <p className="text-sm font-medium text-gray-900">
                ${Number(payment.amount).toFixed(2)}
            </p>

            <div>
                <span className={`text-xs px-2 py-1 rounded-md ${statusColor[payment.status]}`}>
                    {payment.status}
                </span>
            </div>
        </div>
    );
};

export default PaymentRow;