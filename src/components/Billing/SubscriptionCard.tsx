import { Avatar, Button, Card } from "@heroui/react";
import type { Contract } from "./type";

type Props = {
  contract: Contract | null;
};

const SubscriptionCard = ({ contract }: Props) => {
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
          No active subscription
        </div>
      ) : (
        <Card className="rounded-xl border p-5 shadow-none">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <Avatar.Image
                  alt="Coach"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                />
              </Avatar>

              <div className="flex flex-col">
                <p className="font-bold">{contract.coach_name}</p>
                <p className="text-sm text-gray-500">
                  Online Coaching - Monthly Plan
                </p>
                <p className="text-sm text-gray-500">
                  ${Number(contract.agreed_price).toFixed(2)} / month
                </p>
              </div>
            </div>

            <div className="ml-auto">
              <Button className="rounded-lg border border-red-300 bg-white px-6 text-red-500">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};

export default SubscriptionCard;