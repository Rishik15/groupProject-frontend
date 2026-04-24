import { Avatar, Button, Card } from "@heroui/react";
import { CreditCard, Pencil, RefreshCw } from "lucide-react";

const SubscriptionCard = () => {
  return (
    <Card className="w-full rounded-xl border p-5">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Subscriptions</p>
          <p className="text-xs text-gray-500">
            Manage your coach subscriptions.
          </p>
        </div>

        <Button className="bg-transparent text-indigo-500">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="rounded-xl border p-5 shadow-none">
        <div className="grid grid-cols-[320px_140px_190px_180px_1fr] items-start gap-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <Avatar.Image
                alt="Coach"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              />
            </Avatar>

            <div className="flex flex-col">
              <p className="font-bold">Marcus Reed</p>
              <p className="text-sm text-gray-500">
                Online Coaching - Monthly Plan
              </p>
              <p className="text-sm text-gray-500">$49.99 / month</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm ml-3 text-gray-500">Status</p>
            <span className="w-fit rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-600 mt-0.5">
              Active
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Next Billing Date</p>
            <p className="text-sm">May 12, 2026</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Payment Method</p>
            <div className="flex items-center gap-2 mt-0.5">
              <CreditCard className="h-4 w-4 text-indigo-500" />
              <p className="text-sm">•••• 1234</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 my-auto border-l pl-8">
            <Button className="rounded-lg border bg-white px-6 text-black">
              <Pencil className="h-4 w-4" />
              Update
            </Button>

            <Button className="rounded-lg border border-red-300 bg-white px-6 text-red-500">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </Card>
  );
};

export default SubscriptionCard;