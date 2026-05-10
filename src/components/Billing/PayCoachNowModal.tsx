import { Button, Modal } from "@heroui/react";
import { CreditCard, DollarSign, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { payCoachNow } from "../../services/billing/payCoachNow";
import type { Contract, PaymentHistoryDetail } from "./type";
import api from "../../services/api";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onPaymentComplete?: (payment: PaymentHistoryDetail) => void;
};

type SubscriptionResponse = {
  contract: Contract | null;
};

const PayCoachNowModal = ({ isOpen, setIsOpen, onPaymentComplete }: Props) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const loadCurrentCoach = async () => {
    try {
      setLoadingCoach(true);
      setError("");

      const res = await api.get<SubscriptionResponse>("/payments/subscription");
      setContract(res.data.contract);
    } catch (err) {
      setError("Could not load your current coach.");
      setContract(null);
    } finally {
      setLoadingCoach(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCurrentCoach();
      setShowConfirm(false);
      setError("");
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setShowConfirm(false);
    setError("");
  };

  const handlePay = async () => {
    try {
      setPaying(true);
      setError("");

      const res = await payCoachNow();

      onPaymentComplete?.(res.payment);
      handleClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment could not be completed.";

      setError(message);
    } finally {
      setPaying(false);
    }
  };

  const amount = contract ? Number(contract.agreed_price).toFixed(2) : "0.00";

  return (
    <Modal isOpen={isOpen}>
      <Modal.Backdrop className="bg-black/40">
        <Modal.Container>
          <Modal.Dialog className="w-full max-w-lg rounded-2xl bg-white p-0 shadow-xl">
            <div className="flex items-start justify-between border-b p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <DollarSign className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xl font-bold">Pay Coach Now</p>
                  <p className="text-sm text-gray-500">
                    Make a direct payment to your current coach.
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Modal.Body className="p-6">
              {loadingCoach ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Loading your coach...
                </div>
              ) : !contract ? (
                <div className="rounded-xl border bg-gray-50 p-5 text-sm text-gray-600">
                  You currently have no coach.
                </div>
              ) : !showConfirm ? (
                <div className="flex flex-col gap-5">
                  <div className="rounded-xl border p-5">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="text-sm text-gray-500">Current Coach</p>
                        <p className="font-semibold">{contract.coach_name}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-semibold">${amount}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    This payment will be added to your payment history. If you
                    are subscribed, this payment will also count for the current
                    billing period.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border bg-indigo-50 p-5">
                  <p className="font-semibold text-black">
                    Are you sure you want to pay {contract.coach_name}?
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    You will be charged ${amount}. This will be saved in your
                    payment history.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </Modal.Body>

            <div className="flex justify-end gap-3 border-t p-6">
              <Button
                className="rounded-lg border bg-white px-6 text-black"
                onClick={handleClose}
                isDisabled={paying}
              >
                Cancel
              </Button>

              {contract && !showConfirm && (
                <Button
                  className="rounded-lg bg-indigo-500 px-6 text-white"
                  onClick={() => setShowConfirm(true)}
                >
                  Pay Coach
                </Button>
              )}

              {contract && showConfirm && (
                <Button
                  className="rounded-lg bg-indigo-500 px-6 text-white"
                  onClick={handlePay}
                  isDisabled={paying}
                >
                  {paying ? "Processing..." : "Yes, Pay Now"}
                </Button>
              )}
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PayCoachNowModal;
