import { useState, useEffect } from "react";
import ManageClientModal from "../../components/Coach/ManageClients/ManageClientModal";
import { getClients } from "../../services/ManageClients/getClients";
import { Card, Avatar } from "@heroui/react";

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
    <div className="min-h-screen bg-[#F5F7FB] px-38 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#111]">Manage Clients</h1>
        <p className="text-[14px] text-gray-500 mt-2">
          View and manage client dashboards, nutrition and workouts
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {clients.map((c) => (
          <Card
            key={c.contract_id}
            onClick={() => setSelectedContract(c.contract_id)}
            className="
              cursor-pointer
              rounded-2xl
              px-5 py-4
              border border-[#E5E7EB]
              bg-white
              transition-all
              hover:shadow-xl
              hover:-translate-y-1
              hover:bg-indigo-50
              group
            "
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
              </Avatar>

              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#111] group-hover:text-indigo-600 transition">
                  {c.name}
                </span>
              </div>
            </div>
          </Card>
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
