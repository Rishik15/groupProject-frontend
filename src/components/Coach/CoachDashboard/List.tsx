import { Card, Chip, Separator } from "@heroui/react";
import type { ReactNode } from "react";
import type { Contract } from "../../../utils/Interfaces/Dashboard/Coach/types";

type RequestDetails = {
  training_reason?: string;
  goals?: string;
  preferred_schedule?: string;
  notes?: string;
  price?: string;
};

type ContractWithRequestDetails = Contract & {
  request_details?: RequestDetails;
  contract_text?: string;
  details?: string;
  price?: string | number;
  agreed_price?: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "Not started";
  return new Date(dateString).toLocaleDateString();
}

function parseContractText(text?: string): RequestDetails {
  const details: RequestDetails = {};

  if (!text) return details;

  const parts = text.split("|");

  parts.forEach((part) => {
    const colonIndex = part.indexOf(":");

    if (colonIndex === -1) return;

    const key = part.slice(0, colonIndex).trim();
    const value = part.slice(colonIndex + 1).trim();

    if (!key) return;

    if (
      key === "training_reason" ||
      key === "goals" ||
      key === "preferred_schedule" ||
      key === "notes" ||
      key === "price"
    ) {
      details[key] = value;
    }
  });

  return details;
}

function getRequestDetails(item: ContractWithRequestDetails): RequestDetails {
  if (item.request_details) {
    return item.request_details;
  }

  return parseContractText(item.contract_text || item.details);
}

function getClientName(item: ContractWithRequestDetails) {
  if (item.name) return item.name;

  const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();

  return fullName || "Client";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const List = ({
  data,
  renderActions,
}: {
  data: Contract[];
  renderActions?: (item: Contract) => ReactNode;
}) => {
  if (!data.length) {
    return (
      <div className="text-gray-400 text-sm text-center py-6">Nothing here</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2 px-8">
      {data.map((contract) => {
        const item = contract as ContractWithRequestDetails;
        const requestDetails = getRequestDetails(item);
        const clientName = getClientName(item);

        const price =
          requestDetails.price || item.price || item.agreed_price || "Not set";

        return (
          <Card
            key={item.contract_id}
            className="border rounded-3xl p-5 shadow-none hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-5">
              <div className="flex gap-4 min-w-0">
                <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0">
                  {getInitials(clientName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-[15px] text-black">
                      {clientName}
                    </p>

                    <Chip
                      size="sm"
                      className="bg-gray-50 text-gray-600 border border-gray-100"
                    >
                      ${price}
                    </Chip>
                  </div>

                  <p className="text-[12px] text-gray-400 mt-1">
                    {formatDate(item.start_date)}{" "}
                    {item.end_date
                      ? `- ${formatDate(item.end_date)}`
                      : "- Ongoing"}
                  </p>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                        Training reason
                      </p>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {requestDetails.training_reason || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                        Goals
                      </p>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {requestDetails.goals || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                        Preferred schedule
                      </p>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {requestDetails.preferred_schedule || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                        Extra notes
                      </p>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {requestDetails.notes || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {renderActions && (
                <div className="flex items-center gap-2 shrink-0">
                  {renderActions(contract)}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default List;
