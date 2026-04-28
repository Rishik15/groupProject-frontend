import { useState, useEffect } from "react";
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
import { getClientContract } from "../../services/billing/get_active_contract";
import InvoiceModal from "../../components/Billing/InvoiceModal";
import { set_default_payment } from "../../services/billing/set_default_payment";
import { delete_payment_method } from "../../services/billing/delete_payment_method";

const Billing = () => {
  const [payment_methods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [history_list, setHistoryList] = useState<PaymentHistoryDetail[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentHistoryDetail | null>(null);

  const openInvoice = (payment: PaymentHistoryDetail) => {
    setSelectedPayment(payment);
    setIsOpen(true);
  };
  useEffect(() => {
    const get_Payments = async () => {
      const res = await get_PaymentMethods();
      setPaymentMethods(res.data);
    };

    const get_History = async () => {
      const res = await get_PaymentHistory();
      setHistoryList(res.data);
      console.log(res.data);
    };

    const get_Contract = async () => {
      const res = await getClientContract();
      setContract(res.data.contract);
      console.log(res.data);
    };

    get_Contract();
    get_History();
    get_Payments();
  }, []);

  const addCardToList = (newMethod: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, newMethod]);
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

  return (
    <div className="px-16 py-8">
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
        <SubscriptionCard contract={contract} />
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
