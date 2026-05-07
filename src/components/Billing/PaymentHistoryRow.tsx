import type { PaymentHistoryDetail } from "./type";

type Props = {
  payment: PaymentHistoryDetail;
  openInvoice: (payment: PaymentHistoryDetail) => void;
};

const PaymentRow = ({ payment, openInvoice }: Props) => {
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
    refunded: "bg-gray-100 text-gray-600",
  };

  const coachName = payment.coach
    ? `${payment.coach.first_name} ${payment.coach.last_name}`
    : "-";

  return (
    <div
      className="grid grid-cols-4 items-center px-4 py-4 border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => openInvoice(payment)}
    >
      <p className="text-sm text-gray-700">{date}</p>

      <p className="text-sm text-gray-700">{coachName}</p>

      <p className="text-sm font-medium text-gray-900">
        ${Number(payment.amount).toFixed(2)}
      </p>

      <div>
        <span
          className={`text-xs px-2 py-1 rounded-md ${statusColor[payment.status]}`}
        >
          {payment.status}
        </span>
      </div>
    </div>
  );
};

export default PaymentRow;
