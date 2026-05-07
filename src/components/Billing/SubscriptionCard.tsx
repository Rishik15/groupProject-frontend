import { Avatar, Button, Card } from "@heroui/react";
import type { Contract } from "./type";

type Props = {
  contract: Contract | null;
  isUpdating: boolean;
  onStartSubscription: () => void;
  onCancelSubscription: () => void;
};

const formatDate = (value: string | null) => {
  if (!value) return "Not scheduled";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const SubscriptionCard = ({
  contract,
  isUpdating,
  onStartSubscription,
  onCancelSubscription,
}: Props) => {
  const isSubscribed = contract?.is_recurring === 1;

  return (
    <Card className="w-full rounded-xl border p-5">
      <div className="mb-6 flex flex-col gap-1">
        <p className="font-bold">Subscriptions</p>
        <p className="text-xs text-gray-500">
          Manage your coach subscriptions.
        </p>
      </div>

      {!contract ? (
        <div className="text-sm text-gray-500">
          No active coach contract. Subscribe to a coach first before managing a
          monthly plan.
        </div>
      ) : (
        <Card className="rounded-xl border p-5 shadow-none">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <Avatar.Image
                  alt="Coach"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                />
                <Avatar.Fallback>
                  {contract.coach_name?.charAt(0) || "C"}
                </Avatar.Fallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="font-bold">{contract.coach_name}</p>

                <p className="text-sm text-gray-500">
                  {isSubscribed
                    ? "Online Coaching - Monthly Plan"
                    : "Active Coach Contract"}
                </p>

                <p className="text-sm text-gray-500">
                  ${Number(contract.agreed_price).toFixed(2)} / month
                </p>

                {isSubscribed && (
                  <p className="mt-1 text-xs text-gray-500">
                    Next billing date: {formatDate(contract.next_billing_date)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {isSubscribed ? (
                <>
                  <span className="rounded-md border border-green-500 px-2 py-1 text-xs text-green-600">
                    Subscribed
                  </span>

                  <Button
                    className="rounded-lg border border-red-400 bg-white text-red-500"
                    isDisabled={isUpdating}
                    onClick={onCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                </>
              ) : (
                <>
                  <span className="rounded-md border border-gray-400 px-2 py-1 text-xs text-gray-600">
                    Not subscribed
                  </span>

                  <Button
                    className="rounded-lg bg-indigo-500 text-white"
                    isDisabled={isUpdating}
                    onClick={onStartSubscription}
                  >
                    Start Monthly Subscription
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};

export default SubscriptionCard;
