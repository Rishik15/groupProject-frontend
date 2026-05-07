import { useState, useEffect } from "react";
import { toast } from "@heroui/react";
import BillingHeader from "../../components/Billing/BillingHeader";
import PaymentHistoryCard from "../../components/Billing/PaymentHistoryCard";
import PaymentMethodCard from "../../components/Billing/PaymentMethodCard";
import SubscriptionCard from "../../components/Billing/SubscriptionCard";
import { get_PaymentMethods } from "../../services/billing/get_PaymentMethod";
import { get_PaymentHistory } from "../../services/billing/get_payment_history";
import {
  type Contract,
  type PaymentHistoryDetail,
  type PaymentMethod,
} from "../../components/Billing/type";
import InvoiceModal from "../../components/Billing/InvoiceModal";
import { set_default_payment } from "../../services/billing/set_default_payment";
import { delete_payment_method } from "../../services/billing/delete_payment_method";
import { getSubscription } from "@/services/billing/get_subscription";
import { startSubscription } from "@/services/billing/start_subscription";
import { cancelSubscription } from "@/services/billing/cancel_subscription";

const Billing = () => {
  const [payment_methods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [history_list, setHistoryList] = useState<PaymentHistoryDetail[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubscriptionUpdating, setIsSubscriptionUpdating] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentHistoryDetail | null>(null);

  const openInvoice = (payment: PaymentHistoryDetail) => {
    setSelectedPayment(payment);
    setIsOpen(true);
  };

  const fetchPaymentMethods = async () => {
    const res = await get_PaymentMethods();
    setPaymentMethods(res.data);
  };

  const fetchHistory = async () => {
    const res = await get_PaymentHistory();
    setHistoryList(res.data);
  };

  const fetchSubscription = async () => {
    const res = await getSubscription();
    setContract(res.data.contract);
  };

  useEffect(() => {
    fetchSubscription();
    fetchHistory();
    fetchPaymentMethods();
  }, []);

  const addCardToList = (newMethod: PaymentMethod) => {
    setPaymentMethods((prev) => {
      if (newMethod.is_default === 1) {
        return [
          newMethod,
          ...prev.map((method) => ({
            ...method,
            is_default: 0,
          })),
        ];
      }

      return [...prev, newMethod];
    });
  };

  const removePaymentMethod = async (id: number) => {
    const removed = payment_methods.find((m) => m.payment_method_id === id);
    const new_list = payment_methods.filter((m) => m.payment_method_id !== id);

    if (!removed) return;

    await delete_payment_method(id);

    if (new_list.length > 0 && removed.is_default === 1) {
      new_list[0].is_default = 1;
      await set_default_payment(new_list[0].payment_method_id);
    }

    setPaymentMethods(new_list);
  };

  const setDefault = async (id: number) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({
        ...m,
        is_default: m.payment_method_id === id ? 1 : 0,
      })),
    );

    await set_default_payment(id);
  };

  const handleStartSubscription = async () => {
    const hasDefaultCard = payment_methods.some(
      (method) => method.is_default === 1,
    );

    if (!hasDefaultCard) {
      toast("Add a default payment method first", {
        description:
          "A default card is required before starting a subscription.",
        timeout: 4000,
      });
      return;
    }

    try {
      setIsSubscriptionUpdating(true);

      const res = await startSubscription();
      setContract(res.data.contract);

      toast("Subscription started", {
        description:
          "Your first subscription payment will be added after one month.",
        timeout: 4000,
      });
    } catch (err: any) {
      toast("Could not start subscription", {
        description: err?.response?.data?.error || "Please try again.",
        timeout: 4000,
      });
    } finally {
      setIsSubscriptionUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsSubscriptionUpdating(true);

      const res = await cancelSubscription();
      setContract(res.data.contract);

      toast("Subscription cancelled", {
        description:
          "Your coach contract is still active, but monthly billing is off.",
        timeout: 4000,
      });
    } catch (err: any) {
      toast("Could not cancel subscription", {
        description: err?.response?.data?.error || "Please try again.",
        timeout: 4000,
      });
    } finally {
      setIsSubscriptionUpdating(false);
    }
  };

  return (
    <div className="px-38 py-8">
      <BillingHeader />

      <div className="flex mt-8 gap-5">
        <PaymentMethodCard
          payment_methods={payment_methods}
          removePaymentMethod={removePaymentMethod}
          addCardToList={addCardToList}
          setDefault={setDefault}
        />

        <PaymentHistoryCard
          historyList={history_list}
          openInvoice={openInvoice}
        />
      </div>

      <div className="mt-8">
        <SubscriptionCard
          contract={contract}
          isUpdating={isSubscriptionUpdating}
          onStartSubscription={handleStartSubscription}
          onCancelSubscription={handleCancelSubscription}
        />
      </div>

      <InvoiceModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payment={selectedPayment}
      />
    </div>
  );
};

export default Billing;
