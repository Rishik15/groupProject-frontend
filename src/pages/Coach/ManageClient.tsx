import { useState } from "react";
import ManageClientModal from "../../components/Coach/ManageClients.tsx/ManageClientModal";

export default function ManageClients() {
  const [selectedContract, setSelectedContract] = useState<number | null>(null);

  const clients = [
    { name: "Alex Taylor", contract_id: 1 },
    { name: "John Doe", contract_id: 2 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Clients</h1>

      <div className="grid grid-cols-3 gap-4">
        {clients.map((c) => (
          <div
            key={c.contract_id}
            onClick={() => setSelectedContract(c.contract_id)}
            className="p-5 border rounded-xl cursor-pointer hover:shadow"
          >
            {c.name}
          </div>
        ))}
      </div>

      {selectedContract && (
        <ManageClientModal
          contractId={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
}
