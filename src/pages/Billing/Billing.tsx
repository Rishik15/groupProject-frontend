import BillingHeader from "../../components/Billing/BillingHeader";
import PaymentHistoryCard from "../../components/Billing/PaymentHistoryCard";
import PaymentMethodCard from "../../components/Billing/PaymentMethodCard";
import SubscriptionCard from "../../components/Billing/SubscriptionCard";

const Billing = () => {

    return (
        <div className="px-16 py-8">
            <BillingHeader />
            <div className="flex  mt-8 gap-5">
                <PaymentMethodCard />
                <PaymentHistoryCard />
            </div>
            <div className="mt-8">
                <SubscriptionCard />
            </div>
        </div>
    );
}

export default Billing;