import { Button } from "@heroui/react";
import { useState } from "react";
import PayCoachNowModal from "./PayCoachNowModal";
import type { PaymentHistoryDetail } from "./type";

type Props = {
  onPaymentComplete?: (payment: PaymentHistoryDetail) => void;
};

const BillingHeader = ({ onPaymentComplete }: Props) => {
  const [payModalOpen, setPayModalOpen] = useState(false);

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Payments & Billing</h1>
        <p className="text-sm text-gray-500">
          Manage your payment methods, view history, and manage coach
          subscriptions.
        </p>
      </div>

      <Button
        className="rounded-lg bg-indigo-500 px-5 text-white"
        onClick={() => setPayModalOpen(true)}
      >
        Pay Coach Now
      </Button>

      <PayCoachNowModal
        isOpen={payModalOpen}
        setIsOpen={setPayModalOpen}
        onPaymentComplete={onPaymentComplete}
      />
    </div>
  );
};

export default BillingHeader;
