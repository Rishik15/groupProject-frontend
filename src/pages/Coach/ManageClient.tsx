import { useState, useEffect } from "react";
import ManageClientModal from "../../components/Coach/ManageClients/ManageClientModal";
import { getClients } from "../../services/ManageClients/getClients";

type Client = {
  contract_id: number;
  name: string;
};

export default function ManageClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedContract, setSelectedContract] = useState<number | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data || []);
      } catch (err) {
        console.error("failed to fetch clients", err);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="py-8 px-38">
      <h1 className="text-2xl font-semibold mb-2">Manage Clients</h1>
      <h2 className="text-[14px] mb-6">
        Manage your clients dashboard, nutrition and workout plan
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {clients.map((c) => (
          <div
            key={c.contract_id}
            onClick={() => setSelectedContract(c.contract_id)}
            className="p-5 border rounded-xl cursor-pointer hover:shadow transition"
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
