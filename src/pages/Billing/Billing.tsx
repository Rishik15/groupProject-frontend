import { useState, useEffect } from "react";
import BillingHeader from "../../components/Billing/BillingHeader";
import PaymentHistoryCard from "../../components/Billing/PaymentHistoryCard";
import PaymentMethodCard from "../../components/Billing/PaymentMethodCard";
import SubscriptionCard from "../../components/Billing/SubscriptionCard";
import { get_PaymentMethods } from "../../services/billing/get_PaymentMethod";
import { get_PaymentHistory } from "../../services/billing/get_payment_history";
import {type Contract, type PaymentHistoryDetail, type PaymentMethod } from "../../components/Billing/type";
import { getClientContract } from "../../services/billing/get_active_contract";



const Billing = () => {
    const [payment_methods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [history_list, setHistoryList] = useState<PaymentHistoryDetail[]>([]);
    const [contract, setContract] = useState<Contract | null>(null);


    useEffect(() => {
        const get_Payments = async () => {
            const res = await get_PaymentMethods();
            setPaymentMethods(res.data);
        };

        const get_History = async () => {
            const res = await get_PaymentHistory()
            setHistoryList(res.data)
            console.log(res.data)

        };

        const get_Contract = async () => {
            const res = await getClientContract();
            setContract(res.data.contract);
            console.log(res.data)

        }

        get_Contract();
        get_History();
        get_Payments();
    }, []);



    const addCardToList = (newMethod: PaymentMethod) => {
        setPaymentMethods((prev) => [...prev, newMethod]);
    };

    const removePaymentMethod = (id: number) => {
        setPaymentMethods((prev) =>
            prev.filter((m) => m.payment_method_id !== id)
        );
    };



    return (
        <div className="px-16 py-8">
            <BillingHeader />
            <div className="flex mt-8 gap-5">
                <PaymentMethodCard
                    payment_methods={payment_methods}
                    removePaymentMethod={removePaymentMethod}
                    addCardToList={addCardToList}
                />
                <PaymentHistoryCard historyList={history_list} />
            </div>

            <div className="mt-8">
                <SubscriptionCard  contract={contract}/>
            </div>
        </div>
    );
};

export default Billing;