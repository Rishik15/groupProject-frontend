import { useState } from "react";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";

interface PaymentRequiredModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    card_number: string;
    card_brand: string;
    expiry_month: number;
    expiry_year: number;
  }) => void;
}

export default function PaymentRequiredModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: PaymentRequiredModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const cleanCardNumber = cardNumber.replace(/\s/g, "");

  const canSubmit =
    cleanCardNumber.length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3,4}$/.test(cvc) &&
    name.trim().length > 1;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.replace(/(.{4})/g, "$1 ").trim();

    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;

    setExpiry(formatted);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(value);
  };

  const getCardBrand = () => {
    if (cleanCardNumber.startsWith("4")) return "VISA";
    if (cleanCardNumber.startsWith("5")) return "MASTERCARD";
    if (cleanCardNumber.startsWith("3")) return "AMEX";
    if (cleanCardNumber.startsWith("6")) return "DISCOVER";

    return "CARD";
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const [month, year] = expiry.split("/");

    onSubmit({
      card_number: cleanCardNumber,
      card_brand: getCardBrand(),
      expiry_month: Number(month),
      expiry_year: Number(`20${year}`),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-md">
      <Card className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B5EF4]/10">
            <CreditCard className="h-5 w-5 text-[#5B5EF4]" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Add a payment method
            </h2>
            <p className="mt-1 text-sm text-default-400">
              We noticed you do not have a payment method yet. A payment method
              is required before sending a coaching request.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#5B5EF4]/20 bg-[#5B5EF4]/5 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#5B5EF4]" />
            <p className="text-sm leading-relaxed text-default-600">
              Your card will be saved to your account, but you will not be
              charged right now. Payment only happens after the coach accepts
              your request and the contract starts.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <TextField fullWidth value={cardNumber}>
            <Label>Credit card number</Label>
            <Input
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 1234 1234 1234"
              className="h-11 rounded-lg border border-gray-300"
            />
          </TextField>

          <div className="flex gap-4">
            <TextField fullWidth value={expiry}>
              <Label>Expiration date</Label>
              <Input
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="h-11 rounded-lg border border-gray-300"
              />
            </TextField>

            <TextField fullWidth value={cvc}>
              <Label>Security code</Label>
              <Input
                value={cvc}
                onChange={handleCvcChange}
                placeholder="CVC"
                className="h-11 rounded-lg border border-gray-300"
              />
            </TextField>
          </div>

          <TextField fullWidth value={name}>
            <Label>Name on card</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="h-11 rounded-lg border border-gray-300"
            />
          </TextField>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-gray-500">
          <LockKeyhole className="h-4 w-4" />
          <p className="text-xs leading-tight">
            Your payment information is secure and encrypted.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            className="rounded-lg bg-[#5B5EF4] text-white"
            onPress={handleSubmit}
            isDisabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save and send request"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
